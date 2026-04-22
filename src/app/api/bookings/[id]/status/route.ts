import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { BookingService } from "@/lib/services/bookingService";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const body = await request.json();
    const result = await BookingService.updateStatus(
      supabase, 
      params.id, 
      body.status, 
      profile?.role || "user"
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[BOOKING_STATUS_PATCH]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui status booking." },
      { status: 500 }
    );
  }
}
