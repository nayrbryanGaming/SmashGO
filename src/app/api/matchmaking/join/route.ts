import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { MatchmakingService } from "@/lib/services/matchmakingService";
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
    const match = await MatchmakingService.joinQueue(supabase, user.id, body);

    return NextResponse.json({
      success: true,
      data: match,
      message: match ? "Lawan ditemukan! Segera koordinasi melalui WhatsApp." : "Mencari lawan... Mohon tunggu sebentar."
    });
  } catch (error: any) {
    console.error("[MATCHMAKING_JOIN]", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Gagal masuk antrian matchmaking." },
      { status: 500 }
    );
  }
}
