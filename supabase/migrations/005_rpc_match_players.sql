-- SmashGo: Atomic Matchmaking RPC
-- Ensures only one match can be made at a time per user, 
-- preventing race conditions and double-pairing.

CREATE OR REPLACE FUNCTION fn_match_players(v_entry_id UUID)
RETURNS JSONB AS $$
DECLARE
    r_self RECORD;
    r_match RECORD;
    v_score NUMERIC;
    v_skill_diff INTEGER;
    v_overlap_minutes NUMERIC;
    v_overlap_start TIME;
    v_overlap_end TIME;
    v_result JSONB;
BEGIN
    -- 1. Get current entry details with lock
    SELECT * INTO r_self 
    FROM matchmaking 
    WHERE id = v_entry_id AND status = 'searching'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Entry not found or already matched');
    END IF;

    -- 2. Find Candidates with scoring (SQL logic)
    FOR r_match IN (
        SELECT m.*, u.name as user_name
        FROM matchmaking m
        JOIN users u ON m.user_id = u.id
        WHERE m.status = 'searching' 
          AND m.user_id != r_self.user_id
          AND ABS(m.skill_level - r_self.skill_level) <= 1
          -- Check for time overlap (simplified for PG times)
          AND (
            GREATEST(m.start_time, r_self.start_time) < LEAST(m.end_time, r_self.end_time)
          )
        FOR UPDATE SKIP LOCKED
        LIMIT 5 -- Take best candidates
    ) LOOP
        -- Calculate Overlap
        v_overlap_start := GREATEST(r_match.start_time, r_self.start_time);
        v_overlap_end := LEAST(r_match.end_time, r_self.end_time);
        
        v_overlap_minutes := EXTRACT(EPOCH FROM (v_overlap_end - v_overlap_start)) / 60;

        IF v_overlap_minutes >= 30 THEN
            -- Calculate Score: (Skill Match ? 2 : 1) + (Overlap / 60)
            v_skill_diff := ABS(r_match.skill_level - r_self.skill_level);
            v_score := (CASE WHEN v_skill_diff = 0 THEN 2 ELSE 1 END) + (v_overlap_minutes / 60.0);

            -- Successful Match Found!
            -- ATOMIC UPDATE
            UPDATE matchmaking SET status = 'matched', matched_user_id = r_self.user_id WHERE id = r_match.id;
            UPDATE matchmaking SET status = 'matched', matched_user_id = r_match.user_id WHERE id = r_self.id;

            -- Return details
            RETURN jsonb_build_object(
                'success', true,
                'match_id', r_match.id,
                'partner_name', r_match.user_name,
                'overlap_start', v_overlap_start,
                'overlap_end', v_overlap_end
            );
        END IF;
    END LOOP;

    -- No match found
    RETURN jsonb_build_object('success', false, 'message', 'No suitable match found');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
