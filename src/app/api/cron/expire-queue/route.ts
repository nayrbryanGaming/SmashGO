import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  // 1. Mark expired matchmaking queue entries
  const { data, error, count } = await supabase
    .from('matchmaking_queue')
    .update({ 
      status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('status', 'searching')
    .lt('expires_at', new Date().toISOString())
    .select('id', { count: 'exact' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    expiredCount: count || 0,
    timestamp: new Date().toISOString()
  })
}
