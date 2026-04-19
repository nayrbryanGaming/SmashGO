import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { MatchmakingService } from "@/lib/services/matchmakingService";

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID Matchmaking diperlukan." },
        { status: 400 }
      );
    }

    await MatchmakingService.cancelQueue(supabase, id, user.id);

    return NextResponse.json({
      success: true,
      message: "Berhasil membatalkan antrian."
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membatalkan antrian." },
      { status: 500 }
    );
  }
}
