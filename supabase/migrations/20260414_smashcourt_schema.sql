-- SmashCourt: Production-Ready Schema
-- Focus: Reliability, Concurrency-Safety, and Performance

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Initialize production-ready database structures
DROP TABLE IF EXISTS matchmaking;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS courts;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------
-- TABLE: users
-- ----------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------
-- TABLE: courts
-- ----------------------------------
CREATE TABLE courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  open_time TIME NOT NULL DEFAULT '06:00',
  close_time TIME NOT NULL DEFAULT '23:00',
  price_per_hour INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  admin_phone TEXT -- Optional specific WhatsApp number for this court
);

-- ----------------------------------
-- TABLE: bookings
-- ----------------------------------
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES courts(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'waiting_admin', 'confirmed', 'completed', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- ANTI-OVERLAP CONSTRAINT
  -- Requires btree_gist extension
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

-- ----------------------------------
-- TABLE: matchmaking
-- ----------------------------------
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

-- INDEXES
CREATE INDEX idx_matchmaking_status ON matchmaking(status);
CREATE INDEX idx_bookings_court_date ON bookings(court_id, date);
CREATE INDEX idx_bookings_user ON bookings(user_id);

-- RLS POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all names" ON users FOR SELECT USING (true);
CREATE POLICY "Users can manage own data" ON users FOR ALL USING (auth.uid() = id);

ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courts viewable by all" ON courts FOR SELECT USING (true);
CREATE POLICY "Admins manage courts" ON courts FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins see all" ON bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users create own" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users cancel before confirm" ON bookings FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (status = 'cancelled');
CREATE POLICY "Admins update all" ON bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE matchmaking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow matching discovery" ON matchmaking FOR SELECT USING (true);
CREATE POLICY "Users manage own queue" ON matchmaking FOR ALL USING (auth.uid() = user_id);

-- AUTOMATIC PROFILE CREATION
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
