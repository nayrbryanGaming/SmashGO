-- Seed initial data for SmashGo
-- 002_seed_data.sql

-- Insert Venues
INSERT INTO venues (id, name, address, city, phone, open_time, close_time)
VALUES 
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'SmashGo Arena Jakarta', 'Jl. Gatot Subroto No. 123', 'Jakarta Selatan', '021-5550123', '06:00:00', '23:00:00')
ON CONFLICT (id) DO NOTHING;

-- Insert Courts
INSERT INTO courts (id, venue_id, name, court_number, price_morning, price_afternoon, price_evening)
VALUES 
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Lapangan A (Premium)', 1, 60000, 80000, 120000),
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Lapangan B (Standard)', 2, 50000, 70000, 100000)
ON CONFLICT (id) DO NOTHING;

-- Insert Rewards (Loyalty System)
INSERT INTO rewards (id, name, description, points_cost, reward_type, value, stock, min_tier)
VALUES 
  ('r1r1r1r1-r1r1-r1r1-r1r1-r1r1r1r1r1r1', 'Shuttlecock Yonex AS-30', '1 Tabung isi 12 shuttlecock kualitas turnamen.', 100, 'merchandise', NULL, 50, 'bronze'),
  ('r2r2r2r2-r2r2-r2r2-r2r2-r2r2r2r2r2r2', 'Voucher Diskon 50%', 'Potongan 50% untuk satu kali booking lapangan.', 500, 'discount', 50, NULL, 'silver'),
  ('r3r3r3r3-r3r3-r3r3-r3r3-r3r3r3r3r3r3', 'Jersey SmashGo Pro', 'Jersey eksklusif SmashGo dengan bahan breathable.', 1000, 'merchandise', NULL, 20, 'gold')
ON CONFLICT (id) DO NOTHING;

-- Insert Inventory
INSERT INTO inventory (venue_id, name, category, price_per_unit, stock_quantity, min_stock_alert, is_rentable)
VALUES 
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Raket Yonex NanoRay', 'equipment', 25000, 10, 2, true),
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Shuttlecock IST', 'consumable', 5000, 100, 20, false),
  ('a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 'Air Mineral 600ml', 'consumable', 5000, 48, 12, false)
ON CONFLICT (name, venue_id) DO NOTHING;
