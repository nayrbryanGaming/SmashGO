import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const queueId = searchParams.get('queue_id')

  if (!queueId) {
    return NextResponse.json({ error: 'Queue ID is required' }, { status: 400 })
  }

  const { data: queue, error } = await supabase
    .from('matchmaking_queue')
    .select('*, matches(*)')
    .eq('id', queueId)
    .single()

  if (error || !queue) {
    return NextResponse.json({ error: 'Antrian tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json({
    status: queue.status,
    matched_with: queue.matched_with,
    match_id: queue.match_id,
    match_details: queue.matches
  })
}
