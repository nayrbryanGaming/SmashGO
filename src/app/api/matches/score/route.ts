// src/app/api/matches/score/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateEloAfterMatch } from '@/lib/matchmaking'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { match_id, scores } = await req.json()

  // Ambil match
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', match_id)
    .single()

  if (!match) return NextResponse.json({ error: 'Match tidak ditemukan' }, { status: 404 })

  // Hanya pemain di match ini yang bisa update skor
  if (user.id !== match.player_a_id && user.id !== match.player_b_id) {
    return NextResponse.json({ error: 'Foul! Bukan pemain match ini.' }, { status: 403 })
  }

  // Cek apakah match sudah selesai berdasarkan skor
  // Format scores: [{ set: 1, score_a: 21, score_b: 19 }, ...]
  const setsA = scores.filter((s: any) => s.score_a > s.score_b).length
  const setsB = scores.filter((s: any) => s.score_b > s.score_a).length
  
  let status = 'in_progress'
  let winner_id = null

  if (setsA >= 2) {
    status = 'completed'
    winner_id = match.player_a_id
  } else if (setsB >= 2) {
    status = 'completed'
    winner_id = match.player_b_id
  }

  // Update match status & scores
  const { error } = await supabase
    .from('matches')
    .update({
      scores,
      status,
      winner_id,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    })
    .eq('id', match_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Jika match selesai, update ELO & Stats secara asinkron
  if (status === 'completed') {
    // Jalankan update ELO (Service Role inside lib/matchmaking.ts)
    await updateEloAfterMatch(match_id)
    
    // Notifikasi in-app ke lawan
    const opponentId = user.id === match.player_a_id ? match.player_b_id : match.player_a_id
    await supabase.from('notifications').insert({
      user_id: opponentId,
      type: 'match_result',
      title: 'Match Selesai!',
      body: `Pertandingan melawan ${user.id === match.player_a_id ? 'pemain A' : 'pemain B'} telah berakhir. Cek ELO baru kamu!`,
      data: { match_id: match.id }
    })
  }

  return NextResponse.json({ success: true, status, winner_id })
}
