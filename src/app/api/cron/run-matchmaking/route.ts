import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { findMatch } from '@/lib/matchmaking'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Verify Cron Secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Get all active 'searching' queue entries
  const { data: queueEntries, error } = await supabase
    .from('matchmaking_queue')
    .select('id')
    .eq('status', 'searching')
    .gt('expires_at', new Date().toISOString())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = []
  
  // 2. Process each entry using the matchmaking logic
  for (const entry of queueEntries || []) {
    const result = await findMatch(entry.id)
    results.push({ id: entry.id, matched: result.found })
  }

  return NextResponse.json({
    processedCount: queueEntries?.length || 0,
    results
  })
}
