// src/app/api/matchmaking/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { queue_id } = await req.json()

  const { error } = await supabase
    .from('matchmaking_queue')
    .update({ status: 'cancelled' })
    .eq('id', queue_id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, message: 'Matchmaking dibatalkan' })
}
