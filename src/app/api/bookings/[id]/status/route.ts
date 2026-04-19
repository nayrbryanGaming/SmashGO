import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { BookingService } from "@/lib/services/bookingService";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check user role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "User profile not found." },
        { status: 404 }
      );
    }

    const { status } = await request.json();
    const result = await BookingService.updateStatus(
      supabase,
      id,
      status,
      profile.role
    );

    return NextResponse.json({
      success: true,
      message: `Status booking diperbarui menjadi ${status}.`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui status booking." },
      { status: 500 }
    );
  }
}
