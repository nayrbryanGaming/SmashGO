-- SmashGo Seed Data
-- Run AFTER 001_initial_schema.sql in Supabase SQL Editor
-- This populates real data so the admin dashboard is not empty

-- ============================================================
-- 1. VENUES
-- ============================================================
INSERT INTO venues (id, name, address, city, phone, is_active, open_time, close_time)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'GOR Badminton Corporate A', 'Jl. Sudirman No. 100, Gedung Utama Lantai 2', 'Jakarta', '021-5551234', true, '06:00', '22:00'),
  ('11111111-0000-0000-0000-000000000002', 'Sport Center B Tower', 'Jl. Gatot Subroto No. 45, Tower B', 'Jakarta', '021-5555678', true, '07:00', '23:00')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. COURTS
-- ============================================================
INSERT INTO courts (id, venue_id, name, description, court_number, price_morning, price_afternoon, price_evening, status, is_active)
VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Court A', 'Lapangan premium dengan lantai kayu maple, pencahayaan LED 6000 lux', 1, 60000, 80000, 110000, 'active', true),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Court B', 'Lapangan standar dengan AC dan pencahayaan full', 2, 55000, 75000, 100000, 'active', true),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Court C', 'Lapangan VIP dengan tribun penonton kapasitas 50 orang', 3, 80000, 100000, 130000, 'active', true),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Court 1', 'Lapangan standar internasional, BWF approved', 1, 50000, 70000, 95000, 'active', true),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Court 2', 'Lapangan dengan live score system digital', 2, 55000, 75000, 100000, 'maintenance', false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. INVENTORY
-- ============================================================
INSERT INTO inventory (id, venue_id, name, category, price_per_unit, stock_quantity, min_stock_alert, is_rentable, is_active)
VALUES
  ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Raket Yonex Voltric', 'equipment', 25000, 12, 5, true, true),
  ('33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Shuttlecock IST Grade A (12 pcs)', 'consumable', 35000, 3, 5, false, true),
  ('33333333-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Air Mineral 600ml', 'consumable', 5000, 48, 10, false, true),
  ('33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'Kaos SmashGo Official', 'merchandise', 85000, 20, 5, false, true),
  ('33333333-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Raket Victor DX-9X', 'equipment', 30000, 8, 5, true, true),
  ('33333333-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', 'Shuttlecock RSL Classic', 'consumable', 40000, 2, 5, false, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. REWARDS
-- ============================================================
INSERT INTO rewards (id, name, description, points_cost, reward_type, value, stock, min_tier, is_active)
VALUES
  ('44444444-0000-0000-0000-000000000001', 'Diskon Booking 15%', 'Diskon 15% untuk 1x booking lapangan manapun', 200, 'discount', 15, NULL, 'bronze', true),
  ('44444444-0000-0000-0000-000000000002', 'Shuttlecock Gratis 1 Tube', 'Satu tube shuttlecock IST Grade A gratis', 350, 'merchandise', NULL, 50, 'silver', true),
  ('44444444-0000-0000-0000-000000000003', 'Booking 1 Jam Gratis', 'Booking lapangan gratis untuk 1 jam (sesi pagi/siang)', 500, 'free_booking', 1, NULL, 'silver', true),
  ('44444444-0000-0000-0000-000000000004', 'Diskon Booking 30%', 'Diskon premium 30% untuk 1x booking lapangan VIP', 800, 'discount', 30, NULL, 'gold', true),
  ('44444444-0000-0000-0000-000000000005', 'Kaos SmashGo Official', 'Kaos eksklusif SmashGo premium, limited edition', 1200, 'merchandise', NULL, 20, 'gold', true),
  ('44444444-0000-0000-0000-000000000006', 'Booking Season Pass (1 Bulan)', 'Akses bebas booking pagi hari selama 30 hari', 3000, 'free_booking', 30, NULL, 'platinum', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. TOURNAMENTS (sample future tournaments)
-- ============================================================
-- Note: created_by will need a real user UUID — run this after creating your superadmin account
-- Uncomment and replace YOUR-ADMIN-UUID with your actual user ID from auth.users

-- INSERT INTO tournaments (id, venue_id, created_by, name, description, match_type, format, max_participants, registration_deadline, start_date, end_date, prize_description, entry_fee, status)
-- VALUES
--   ('55555555-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'YOUR-ADMIN-UUID',
--    'SmashGo Championship Q2 2026', 'Turnamen bulanan internal perusahaan. Format single elimination, hadiah menarik untuk top 3.',
--    'singles', 'single_elimination', 16,
--    NOW() + INTERVAL '7 days', NOW() + INTERVAL '14 days', NOW() + INTERVAL '15 days',
--    'Juara 1: Rp 1.000.000 + Trophy | Juara 2: Rp 500.000 | Juara 3: Merchandise Pack',
--    50000, 'open'),
--   ('55555555-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'YOUR-ADMIN-UUID',
--    'Doubles League April 2026', 'Turnamen ganda campuran, welcome bagi semua level. Registrasi gratis!',
--    'doubles', 'round_robin', 8,
--    NOW() + INTERVAL '3 days', NOW() + INTERVAL '10 days', NOW() + INTERVAL '12 days',
--    'Hadiah voucher booking + trophy kejuaraan tim',
--    0, 'open')
-- ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. FIX RLS: Allow admin to insert notifications (service role)
-- ============================================================
DROP POLICY IF EXISTS "Service role insert notifications" ON notifications;
CREATE POLICY "Service role insert notifications" ON notifications
  FOR INSERT WITH CHECK (true); -- Relaxed for webhook/api routes

-- Allow authenticated users to insert their own notifications context
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 7. FIX RLS: Service role needs full access for matchmaking
-- ============================================================
DROP POLICY IF EXISTS "Service role full access matchmaking" ON matchmaking_queue;
CREATE POLICY "Service role full access matchmaking" ON matchmaking_queue
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin sees matchmaking queue" ON matchmaking_queue;
CREATE POLICY "Admin sees matchmaking queue" ON matchmaking_queue
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- ============================================================
-- 8. FUNCTION: Set user as admin (run manually after registering)
-- Usage: SELECT set_user_as_admin('your-email@company.com');
-- ============================================================
CREATE OR REPLACE FUNCTION set_user_as_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  target_id UUID;
BEGIN
  SELECT id INTO target_id FROM public.users WHERE email = user_email;
  IF target_id IS NULL THEN
    RETURN 'User not found: ' || user_email;
  END IF;
  UPDATE public.users SET role = 'admin' WHERE id = target_id;
  RETURN 'Success: ' || user_email || ' is now admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 9. FUNCTION: Set user as superadmin
-- Usage: SELECT set_user_as_superadmin('your-email@company.com');
-- ============================================================
CREATE OR REPLACE FUNCTION set_user_as_superadmin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  target_id UUID;
BEGIN
  SELECT id INTO target_id FROM public.users WHERE email = user_email;
  IF target_id IS NULL THEN
    RETURN 'User not found: ' || user_email;
  END IF;
  UPDATE public.users SET role = 'superadmin' WHERE id = target_id;
  RETURN 'Success: ' || user_email || ' is now superadmin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- VERIFICATION QUERIES (run these to confirm data loaded)
-- ============================================================
-- SELECT COUNT(*) FROM venues;       -- Should return 2
-- SELECT COUNT(*) FROM courts;       -- Should return 5
-- SELECT COUNT(*) FROM inventory;    -- Should return 6
-- SELECT COUNT(*) FROM rewards;      -- Should return 6
