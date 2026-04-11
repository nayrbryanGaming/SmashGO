import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { findMatch } from '@/lib/matchmaking'

export const dynamic = 'force-dynamic'

/**
 * CRON JOB: Process matchmaking queue
 * This should be called every 30-60 seconds via Vercel Cron or GitHub Actions.
 */
export async function GET(req: Request) {
  // Verify Cron Secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Ambil semua antrian yang masih 'searching'
  const { data: queueItems, error } = await supabase
    .from('matchmaking_queue')
    .select('id')
    .eq('status', 'searching')
    .order('created_at', { ascending: true })

  if (error || !queueItems) {
    return NextResponse.json({ success: false, error: error?.message })
  }

  const results = []

  // 2. Loop dan coba cari lawan untuk setiap entry
  for (const item of queueItems) {
    const result = await findMatch(item.id)
    if (result.found) {
      results.push({ queueId: item.id, status: 'matched', matchId: result.matchId })
    }
  }

  return NextResponse.json({
    success: true,
    processed: queueItems.length,
    matches_found: results.length,
    details: results
  })
}
