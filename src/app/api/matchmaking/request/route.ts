// src/app/api/matchmaking/request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { findMatch } from '@/lib/matchmaking'
import { z } from 'zod'

const requestSchema = z.object({
  match_type: z.enum(['singles', 'doubles', 'mixed_doubles']).default('singles'),
  preferred_date: z.string().date().optional(),
  preferred_time_start: z.string().optional(),
  preferred_time_end: z.string().optional(),
  venue_id: z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Cek apakah user sudah ada di antrian
  const { data: existingQueue } = await supabase
    .from('matchmaking_queue')
    .select('id, status')
    .eq('user_id', user.id)
    .in('status', ['searching', 'matched'])
    .single()

  if (existingQueue) {
    return NextResponse.json(
      { error: 'Kamu sudah ada di antrian matchmaking', queue_id: existingQueue.id },
      { status: 409 }
    )
  }

  const body = await req.json()
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Ambil ELO user terkini
  const { data: userData } = await supabase
    .from('users')
    .select('elo_rating, skill_level')
    .eq('id', user.id)
    .single()

  if (!userData) {
    return NextResponse.json({ error: 'Profil user tidak ditemukan' }, { status: 404 })
  }

  // Masukkan ke antrian
  const { data: queueEntry, error } = await supabase
    .from('matchmaking_queue')
    .insert({
      user_id: user.id,
      user_elo: userData.elo_rating,
      user_skill_level: userData.skill_level,
      match_type: parsed.data.match_type,
      preferred_date: parsed.data.preferred_date,
      preferred_time_start: parsed.data.preferred_time_start,
      preferred_time_end: parsed.data.preferred_time_end,
      venue_id: parsed.data.venue_id,
      current_elo_threshold: 150,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Gagal masuk antrian' }, { status: 500 })
  }

  // Langsung coba cari lawan
  const result = await findMatch(queueEntry.id)

  return NextResponse.json({
    success: true,
    queue_id: queueEntry.id,
    match_found: result.found,
    match_id: result.matchId,
    message: result.message
  })
}
