-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable RLS globally
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Tabel users (profil pemain)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  division TEXT,                          -- Divisi/departemen perusahaan
  employee_id TEXT UNIQUE,                -- ID karyawan (opsional)
  role TEXT NOT NULL DEFAULT 'user'       -- 'user' | 'admin' | 'superadmin'
    CHECK (role IN ('user', 'admin', 'superadmin')),
  
  -- ELO & Matchmaking
  elo_rating INTEGER NOT NULL DEFAULT 1000,
  skill_level TEXT NOT NULL DEFAULT 'pemula'
    CHECK (skill_level IN ('pemula', 'menengah', 'mahir', 'master')),
  
  -- Loyalty
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  loyalty_tier TEXT NOT NULL DEFAULT 'bronze'
    CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  
  -- Stats ringkasan (di-cache dari match_results untuk performa)
  total_matches INTEGER NOT NULL DEFAULT 0,
  total_wins INTEGER NOT NULL DEFAULT 0,
  win_streak INTEGER NOT NULL DEFAULT 0,
  longest_win_streak INTEGER NOT NULL DEFAULT 0,
  
  -- FCM
  fcm_token TEXT,                         -- Token push notification
  
  -- Meta
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies untuk users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);                -- Profil publik untuk leaderboard

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role has full access" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger: update updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: auto-insert ke users saat user baru daftar di auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User Baru'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Tabel venues (gedung/lokasi)
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Jakarta',
  phone TEXT,
  admin_id UUID REFERENCES users(id),     -- Superadmin venue ini
  is_active BOOLEAN NOT NULL DEFAULT true,
  open_time TIME NOT NULL DEFAULT '06:00',
  close_time TIME NOT NULL DEFAULT '23:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Venues viewable by all" ON venues FOR SELECT USING (true);
CREATE POLICY "Superadmin can manage venues" ON venues
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'superadmin')
  );

-- Tabel courts (lapangan)
CREATE TABLE courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                     -- Contoh: "Lapangan A", "Court 1"
  description TEXT,
  photo_url TEXT,
  court_number INTEGER NOT NULL,
  
  -- Harga per jam (dalam Rupiah)
  price_morning INTEGER NOT NULL DEFAULT 50000,    -- 06:00 - 12:00
  price_afternoon INTEGER NOT NULL DEFAULT 75000,  -- 12:00 - 18:00
  price_evening INTEGER NOT NULL DEFAULT 100000,   -- 18:00 - 23:00
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'maintenance', 'inactive')),
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courts viewable by all" ON courts FOR SELECT USING (true);
CREATE POLICY "Admin can manage courts" ON courts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE TRIGGER courts_updated_at
  BEFORE UPDATE ON courts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabel bookings (pemesanan lapangan)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES courts(id),
  
  -- Jadwal
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours NUMERIC(3,1) NOT NULL,   -- 1.0, 1.5, 2.0, dst
  
  -- Harga
  total_price INTEGER NOT NULL,           -- Total dalam Rupiah
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN (
      'pending_payment',  -- Belum bayar
      'confirmed',        -- Sudah bayar
      'checked_in',       -- Sudah scan QR & masuk lapangan
      'completed',        -- Selesai bermain
      'cancelled',        -- Dibatalkan user
      'expired'           -- Kadaluwarsa (tidak bayar dalam 1 jam)
    )),
  
  -- QR Tiket
  qr_code TEXT UNIQUE,                    -- Token unik untuk QR
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES users(id), -- Admin yang scan
  
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  refund_amount INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: tidak boleh booking lapangan sama di waktu yang sama
  EXCLUDE USING GIST (
    court_id WITH =,
    booking_date WITH =,
    tsrange(
      (booking_date + start_time)::TIMESTAMP,
      (booking_date + end_time)::TIMESTAMP,
      '[)'
    ) WITH &&
  ) WHERE (status NOT IN ('cancelled', 'expired'))
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin sees all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "Users create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending_payment');

CREATE POLICY "Admin full access bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index untuk query availability yang sering dipakai
CREATE INDEX idx_bookings_court_date ON bookings(court_id, booking_date, status);
CREATE INDEX idx_bookings_user ON bookings(user_id, status);

-- Tabel preorders (pesanan alat & minuman)
CREATE TABLE preorders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  items JSONB NOT NULL DEFAULT '[]',
  -- Format items: [{ "item_id": "uuid", "name": "Raket Yonex", "qty": 1, "price": 25000 }]
  
  total_price INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE preorders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own preorders" ON preorders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own preorders" ON preorders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tabel inventory (stok barang)
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  name TEXT NOT NULL,                   -- "Raket Yonex", "Shuttlecock IST", "Air Mineral"
  category TEXT NOT NULL
    CHECK (category IN ('equipment', 'consumable', 'merchandise')),
  price_per_unit INTEGER NOT NULL,      -- Harga sewa atau jual
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_alert INTEGER DEFAULT 5,    -- Notif admin jika stok di bawah ini
  is_rentable BOOLEAN DEFAULT false,    -- Sewa atau beli
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active inventory viewable by authenticated" ON inventory
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);
CREATE POLICY "Admin manages inventory" ON inventory
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Tabel payments (pembayaran)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Midtrans
  midtrans_order_id TEXT UNIQUE NOT NULL, -- Format: SMASHGO-{booking_id}-{timestamp}
  midtrans_transaction_id TEXT,           -- Dari Midtrans setelah dibayar
  snap_token TEXT,                        -- Token untuk Midtrans Snap popup
  payment_url TEXT,                       -- URL redirect pembayaran
  
  -- Detail
  amount INTEGER NOT NULL,                -- Total bayar dalam Rupiah
  payment_method TEXT,                    -- 'qris', 'gopay', 'bank_transfer', dll
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed', 'expired', 'refunded')),
  
  -- Webhook data dari Midtrans
  webhook_payload JSONB,
  paid_at TIMESTAMPTZ,
  
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin sees all payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );
CREATE POLICY "Service role full access payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_order_id ON payments(midtrans_order_id);

-- Tabel matchmaking_queue (antrian matchmaking — KEY FEATURE)
CREATE TABLE matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Data pemain saat masuk antrian (snapshot, tidak berubah meski ELO berubah)
  user_elo INTEGER NOT NULL,
  user_skill_level TEXT NOT NULL,
  
  -- Filter dari user
  match_type TEXT NOT NULL DEFAULT 'singles'
    CHECK (match_type IN ('singles', 'doubles', 'mixed_doubles')),
  preferred_date DATE,                    -- NULL = kapan saja
  preferred_time_start TIME,
  preferred_time_end TIME,
  venue_id UUID REFERENCES venues(id),    -- NULL = semua venue
  
  -- Status antrian
  status TEXT NOT NULL DEFAULT 'searching'
    CHECK (status IN ('searching', 'matched', 'confirmed', 'cancelled', 'expired')),
  
  -- Threshold ELO yang terus berkembang jika tidak ada lawan
  current_elo_threshold INTEGER NOT NULL DEFAULT 150,
  threshold_expanded_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Jika sudah matched
  matched_with UUID REFERENCES users(id),
  match_id UUID,                          -- FK ke tabel matches setelah confirmed
  
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own queue entry" ON matchmaking_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own queue entry" ON matchmaking_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own queue entry" ON matchmaking_queue
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON matchmaking_queue
  FOR ALL USING (auth.role() = 'service_role');

-- Enable Realtime untuk tabel ini (wajib untuk waiting room)
ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;

CREATE INDEX idx_queue_searching ON matchmaking_queue(status, user_elo) WHERE status = 'searching';
CREATE INDEX idx_queue_user ON matchmaking_queue(user_id, status);

CREATE TRIGGER queue_updated_at
  BEFORE UPDATE ON matchmaking_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabel matches (hasil pertandingan)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Pemain
  player_a_id UUID NOT NULL REFERENCES users(id),
  player_b_id UUID NOT NULL REFERENCES users(id),
  
  -- Untuk doubles
  player_a2_id UUID REFERENCES users(id),
  player_b2_id UUID REFERENCES users(id),
  
  match_type TEXT NOT NULL DEFAULT 'singles'
    CHECK (match_type IN ('singles', 'doubles', 'mixed_doubles')),
  
  -- Source match
  source TEXT NOT NULL DEFAULT 'matchmaking'
    CHECK (source IN ('matchmaking', 'tournament', 'friendly')),
  tournament_id UUID,                     -- Jika dari turnamen
  court_id UUID REFERENCES courts(id),    -- Lapangan yang dipakai
  booking_id UUID REFERENCES bookings(id),
  
  -- Jadwal
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'walkover')),
  
  -- Skor per set (JSONB untuk fleksibilitas)
  scores JSONB NOT NULL DEFAULT '[]',
  -- Format: [{ "set": 1, "score_a": 21, "score_b": 15 }, { "set": 2, "score_a": 19, "score_b": 21 }]
  
  -- Pemenang
  winner_id UUID REFERENCES users(id),
  
  -- ELO sebelum & sesudah (untuk riwayat)
  player_a_elo_before INTEGER,
  player_b_elo_before INTEGER,
  player_a_elo_after INTEGER,
  player_b_elo_after INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players see their own matches" ON matches
  FOR SELECT USING (
    auth.uid() = player_a_id OR auth.uid() = player_b_id OR
    auth.uid() = player_a2_id OR auth.uid() = player_b2_id
  );

CREATE POLICY "Authenticated can see all completed matches" ON matches
  FOR SELECT USING (auth.role() = 'authenticated' AND status = 'completed');

CREATE POLICY "Players can update in_progress matches" ON matches
  FOR UPDATE USING (
    (auth.uid() = player_a_id OR auth.uid() = player_b_id) AND
    status IN ('scheduled', 'in_progress')
  );

CREATE POLICY "Service role full access" ON matches
  FOR ALL USING (auth.role() = 'service_role');

-- Enable Realtime untuk live score
ALTER PUBLICATION supabase_realtime ADD TABLE matches;

CREATE INDEX idx_matches_player_a ON matches(player_a_id, status);
CREATE INDEX idx_matches_player_b ON matches(player_b_id, status);
CREATE INDEX idx_matches_completed ON matches(status, completed_at DESC) WHERE status = 'completed';

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabel tournaments (turnamen)
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  created_by UUID NOT NULL REFERENCES users(id),
  
  name TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  
  match_type TEXT NOT NULL DEFAULT 'singles'
    CHECK (match_type IN ('singles', 'doubles', 'mixed_doubles')),
  format TEXT NOT NULL DEFAULT 'single_elimination'
    CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin')),
  
  max_participants INTEGER NOT NULL DEFAULT 16,
  current_participants INTEGER NOT NULL DEFAULT 0,
  registration_deadline TIMESTAMPTZ NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  
  prize_description TEXT,               -- Deskripsi hadiah
  entry_fee INTEGER NOT NULL DEFAULT 0, -- 0 = gratis
  
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed', 'ongoing', 'completed', 'cancelled')),
  
  -- Bracket tersimpan sebagai JSON
  bracket JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  partner_id UUID REFERENCES users(id),   -- Untuk doubles
  status TEXT NOT NULL DEFAULT 'registered'
    CHECK (status IN ('registered', 'approved', 'rejected', 'withdrawn')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tournaments viewable by all" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Admin manages tournaments" ON tournaments
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));
CREATE POLICY "Users see tournament participants" ON tournament_participants FOR SELECT USING (true);
CREATE POLICY "Users register themselves" ON tournament_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tabel notifications (notifikasi in-app)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL
    CHECK (type IN (
      'booking_confirmed', 'booking_reminder', 'booking_cancelled',
      'payment_success', 'payment_failed',
      'match_found', 'match_request', 'match_result',
      'tournament_reminder', 'tournament_result',
      'loyalty_tier_up', 'reward_redeemed',
      'system'
    )),
  
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',              -- Payload tambahan (booking_id, match_id, dll)
  
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Enable Realtime untuk notif real-time
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Function to safely update loyalty points
CREATE OR REPLACE FUNCTION add_loyalty_points(
  p_user_id UUID,
  p_points INTEGER,
  p_description TEXT DEFAULT 'Loyalty reward'
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET loyalty_points = loyalty_points + p_points
  WHERE id = p_user_id;

  -- Logic to check for tier-up
  UPDATE public.users
  SET loyalty_tier = 
    CASE 
      WHEN loyalty_points >= 5000 THEN 'platinum'
      WHEN loyalty_points >= 2000 THEN 'gold'
      WHEN loyalty_points >= 500 THEN 'silver'
      ELSE 'bronze'
    END
  WHERE id = p_user_id;

  -- Create notification for points added
  INSERT INTO public.notifications (user_id, type, title, body, data)
  VALUES (
    p_user_id, 
    'system', 
    'Poin Loyalty Bertambah!', 
    'Kamu baru saja mendapatkan ' || p_points || ' poin: ' || p_description,
    jsonb_build_object('points', p_points, 'description', p_description)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tabel rewards & redemptions (loyalty)
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  reward_type TEXT NOT NULL
    CHECK (reward_type IN ('discount', 'free_booking', 'merchandise', 'preorder_free')),
  value INTEGER,                          -- Nominal diskon atau jam gratis
  stock INTEGER,                          -- NULL = tidak terbatas
  min_tier TEXT DEFAULT 'bronze'
    CHECK (min_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  reward_id UUID NOT NULL REFERENCES rewards(id),
  points_spent INTEGER NOT NULL,
  voucher_code TEXT UNIQUE,               -- Kode promo untuk dipakai
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'used', 'expired')),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active rewards viewable by authenticated" ON rewards
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Users see own redemptions" ON redemptions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create redemptions" ON redemptions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin manages rewards" ON rewards
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "Admin manages redemptions" ON redemptions
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

CREATE POLICY "Service role full access rewards" ON rewards
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access redemptions" ON redemptions
  FOR ALL USING (auth.role() = 'service_role');
