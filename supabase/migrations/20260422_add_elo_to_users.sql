-- Add ELO and Stats to Users
ALTER TABLE users ADD COLUMN IF NOT EXISTS elo_rating INTEGER DEFAULT 1200;
ALTER TABLE users ADD COLUMN IF NOT EXISTS matches_played INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS win_rate NUMERIC DEFAULT 0;

-- Update RLS for transparency
CREATE POLICY "Users can view stats" ON users FOR SELECT USING (true);
