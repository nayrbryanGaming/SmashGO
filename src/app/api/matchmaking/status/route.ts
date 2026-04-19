import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { MatchmakingService } from '@/lib/services/matchmakingService';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);
  const queueId = searchParams.get('queue_id');

  if (!queueId) {
    return NextResponse.json({ success: false, message: 'Queue ID is required' }, { status: 400 });
  }

  // Lazy cleanup of searching entries older than 15 minutes
  await MatchmakingService.cleanupExpiredQueue(supabase);

  const { data: queue, error } = await supabase
    .from('matchmaking')
    .select('*, matched_user:matched_user_id(name, phone)')
    .eq('id', queueId)
    .single();

  if (error || !queue) {
    return NextResponse.json({ success: false, message: 'Antrian tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: queue
  });
}
