// src/app/api/matchmaking/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { match_id } = await req.json()

  // Update status match menjadi 'in_progress' jika semua pemain confirm
  // (Logika sederhana: set match ke in_progress langsung di sini untuk MVP)
  const { error } = await supabase
    .from('matches')
    .update({ status: 'in_progress', started_at: new Date().toISOString() })
    .eq('id', match_id)
    .or(`player_a_id.eq.${user.id},player_b_id.eq.${user.id}`)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, message: 'Match terkonfirmasi!' })
}
