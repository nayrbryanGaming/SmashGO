-- SmashGo Professional: Production Schema v18
-- Focus: Atomic Operations, Data Integrity, and Performance

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- CLEANUP (For Re-runnable Migrations)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS matchmaking;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS courts;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    skill_level INTEGER DEFAULT 2 CHECK (skill_level BETWEEN 1 AND 3),
    elo_rating INTEGER DEFAULT 1200,
    matches_played INTEGER DEFAULT 0,
    win_rate INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURTS TABLE
CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    open_time TIME NOT NULL DEFAULT '06:00',
    close_time TIME NOT NULL DEFAULT '23:00',
    price_per_hour INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    admin_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS TABLE
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting_admin' CHECK (status IN ('pending', 'waiting_admin', 'confirmed', 'completed', 'cancelled', 'expired', 'checked_in')),
    qr_code TEXT UNIQUE,
    checked_in_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- ATOMIC OVERLAP CONSTRAINT (GIST)
    EXCLUDE USING GIST (
        court_id WITH =,
        date WITH =,
        tsrange(
            (CAST('1970-01-01 ' || start_time AS TIMESTAMP)),
            (CAST('1970-01-01 ' || end_time AS TIMESTAMP)),
            '[)'
        ) WITH &&
    ) WHERE (status NOT IN ('cancelled', 'expired'))
);

-- 4. MATCHMAKING TABLE
CREATE TABLE matchmaking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_level INTEGER NOT NULL CHECK (skill_level BETWEEN 1 AND 3),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'searching' CHECK (status IN ('searching', 'matched', 'confirmed', 'expired', 'cancelled')),
    matched_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INDEXES
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bookings_date_status ON bookings(date, status);
CREATE INDEX idx_matchmaking_status ON matchmaking(status);

-- 6. RLS POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles" ON users FOR SELECT USING (true);
CREATE POLICY "User manage self" ON users FOR ALL USING (auth.uid() = id);

ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courts are public" ON courts FOR SELECT USING (true);
CREATE POLICY "Admins manage courts" ON courts FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins see all bookings" ON bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update bookings" ON bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE matchmaking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Matchmaking viewable" ON matchmaking FOR SELECT USING (true);
CREATE POLICY "Users manage own queue" ON matchmaking FOR ALL USING (auth.uid() = user_id);

-- 7. TRIGGER: Handle New Auth User
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'New Player'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- 8. RPC: ATOMIC MATCHMAKING ENGINE
CREATE OR REPLACE FUNCTION fn_match_players(v_entry_id UUID)
RETURNS JSONB AS $$
DECLARE
    r_self RECORD;
    r_match RECORD;
    v_overlap_start TIME;
    v_overlap_end TIME;
    v_overlap_minutes NUMERIC;
BEGIN
    SELECT * INTO r_self FROM matchmaking WHERE id = v_entry_id AND status = 'searching' FOR UPDATE;
    IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'message', 'Entry not found'); END IF;

    FOR r_match IN (
        SELECT m.*, u.name as user_name FROM matchmaking m
        JOIN users u ON m.user_id = u.id
        WHERE m.status = 'searching' AND m.user_id != r_self.user_id
          AND ABS(m.skill_level - r_self.skill_level) <= 1
          AND (GREATEST(m.start_time, r_self.start_time) < LEAST(m.end_time, r_self.end_time))
        FOR UPDATE SKIP LOCKED LIMIT 1
    ) LOOP
        v_overlap_start := GREATEST(r_match.start_time, r_self.start_time);
        v_overlap_end := LEAST(r_match.end_time, r_self.end_time);
        v_overlap_minutes := EXTRACT(EPOCH FROM (v_overlap_end - v_overlap_start)) / 60;

        IF v_overlap_minutes >= 30 THEN
            UPDATE matchmaking SET status = 'matched', matched_user_id = r_self.user_id WHERE id = r_match.id;
            UPDATE matchmaking SET status = 'matched', matched_user_id = r_match.user_id WHERE id = r_self.id;
            RETURN jsonb_build_object('success', true, 'match_id', r_match.id, 'partner_name', r_match.user_name);
        END IF;
    END LOOP;

    RETURN jsonb_build_object('success', false, 'message', 'Searching...');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. RPC: ATOMIC BOOKING CREATION
CREATE OR REPLACE FUNCTION fn_create_booking(
    v_user_id UUID, v_court_id UUID, v_date DATE, v_start_time TIME, v_end_time TIME
)
RETURNS JSONB AS $$
DECLARE
    v_overlap_exists BOOLEAN;
    v_booking_id UUID;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM bookings
        WHERE court_id = v_court_id AND date = v_date AND status NOT IN ('cancelled', 'expired')
          AND ((start_time, end_time) OVERLAPS (v_start_time, v_end_time))
    ) INTO v_overlap_exists;

    IF v_overlap_exists THEN
        RETURN jsonb_build_object('success', false, 'message', 'Overlap detected');
    END IF;

    INSERT INTO bookings (user_id, court_id, date, start_time, end_time, status, qr_code)
    VALUES (v_user_id, v_court_id, v_date, v_start_time, v_end_time, 'waiting_admin', encode(gen_random_bytes(12), 'hex'))
    RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
