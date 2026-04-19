-- SmashGo: Atomic Booking Creation RPC
-- Guarantees no race condition for simultaneous bookings on the same court/time.

CREATE OR REPLACE FUNCTION fn_create_booking(
    v_user_id UUID,
    v_court_id UUID,
    v_date DATE,
    v_start_time TIME,
    v_end_time TIME
)
RETURNS JSONB AS $$
DECLARE
    v_overlap_exists BOOLEAN;
    v_booking_id UUID;
BEGIN
    -- 1. Perform atomic check with a lock on the specific court/date slot
    -- We use a selective lock strategy to prevent blocking other dates/courts
    PERFORM id FROM bookings 
    WHERE court_id = v_court_id AND date = v_date
    FOR UPDATE;

    -- 2. Explicit overlap check (double-safe against GIST)
    SELECT EXISTS (
        SELECT 1 FROM bookings
        WHERE court_id = v_court_id
          AND date = v_date
          AND status NOT IN ('cancelled', 'expired')
          AND (
            (start_time, end_time) OVERLAPS (v_start_time, v_end_time)
          )
    ) INTO v_overlap_exists;

    IF v_overlap_exists THEN
        RETURN jsonb_build_object('success', false, 'message', 'Slot lapangan sudah terisi (Overlap)');
    END IF;

    -- 3. Insert the booking
    INSERT INTO bookings (
        user_id,
        court_id,
        date,
        start_time,
        end_time,
        status
    ) VALUES (
        v_user_id,
        v_court_id,
        v_date,
        v_start_time,
        v_end_time,
        'waiting_admin' -- Require admin validation for production
    )
    RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'message', 'Booking berhasil dibuat. Menunggu konfirmasi admin.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
