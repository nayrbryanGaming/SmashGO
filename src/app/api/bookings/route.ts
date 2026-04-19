


import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { BookingService } from "@/lib/services/bookingService";
import { BookingSchema } from "@/lib/validators";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const booking = await BookingService.createBooking(supabase, user.id, body);

    return NextResponse.json({
      success: true,
      data: booking,
      message: "Booking berhasil dibuat. Menunggu konfirmasi admin."
    });
  } catch (error: any) {
    console.error("[BOOKING_POST]", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuat booking." },
      { status: error.message?.includes("overlap") ? 409 : 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Lazy cleanup of expired entries
    await BookingService.cleanupExpiredBookings(supabase);

    const { data, error } = await supabase
      .from("bookings")
      .select("*, courts(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil data booking." },
      { status: 500 }
    );
  }
}
