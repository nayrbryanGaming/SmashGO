// src/lib/matchmaking.ts
import { createClient } from '@supabase/supabase-js'
import { ELO_CONFIG } from './elo'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * FUNGSI UTAMA: Cari lawan yang sesuai untuk user yang masuk antrian
 */
export async function findMatch(queueEntryId: string): Promise<{
  found: boolean
  matchId?: string
  opponentId?: string
  message: string
}> {
  // 1. Ambil data user requester
  const { data: requester, error: reqError } = await supabase
    .from('matchmaking_queue')
    .select('*, users(full_name, fcm_token)')
    .eq('id', queueEntryId)
    .eq('status', 'searching')
    .single()

  if (reqError || !requester) {
    return { found: false, message: 'Antrian tidak ditemukan atau sudah matched' }
  }

  // 2. Query calon lawan
  const { data: candidates } = await supabase
    .from('matchmaking_queue')
    .select('*, users(full_name, fcm_token)')
    .eq('status', 'searching')
    .eq('match_type', requester.match_type)
    .neq('user_id', requester.user_id)           // Bukan diri sendiri
    .gte('user_elo', requester.user_elo - requester.current_elo_threshold)
    .lte('user_elo', requester.user_elo + requester.current_elo_threshold)
    .gt('expires_at', new Date().toISOString())   // Belum expired
    .order('created_at', { ascending: true })

  if (!candidates || candidates.length === 0) {
    // Expand threshold jika perlu
    const lastExpand = new Date(requester.threshold_expanded_at)
    const now = new Date()
    const msSinceExpand = now.getTime() - lastExpand.getTime()

    if (msSinceExpand >= ELO_CONFIG.THRESHOLD_EXPANSION_INTERVAL_MS) {
      const newThreshold = Math.min(
        requester.current_elo_threshold + ELO_CONFIG.THRESHOLD_EXPANSION_STEP,
        ELO_CONFIG.MAX_ELO_THRESHOLD
      )
      await supabase
        .from('matchmaking_queue')
        .update({
          current_elo_threshold: newThreshold,
          threshold_expanded_at: now.toISOString()
        })
        .eq('id', queueEntryId)
    }

    return { found: false, message: 'Belum ada lawan yang seimbang, masih mencari...' }
  }

  // 3. Ambil kandidat terbaik (terlama menunggu)
  const opponent = candidates[0]

  // 4. Buat record match
  const { data: newMatch, error: matchError } = await supabase
    .from('matches')
    .insert({
      player_a_id: requester.user_id,
      player_b_id: opponent.user_id,
      match_type: requester.match_type,
      source: 'matchmaking',
      player_a_elo_before: requester.user_elo,
      player_b_elo_before: opponent.user_elo,
      status: 'scheduled'
    })
    .select()
    .single()

  if (matchError || !newMatch) {
    return { found: false, message: 'Gagal membuat match' }
  }

  // 5. Update status queue
  await Promise.all([
    supabase.from('matchmaking_queue').update({
      status: 'matched',
      matched_with: opponent.user_id,
      match_id: newMatch.id
    }).eq('id', queueEntryId),
    
    supabase.from('matchmaking_queue').update({
      status: 'matched',
      matched_with: requester.user_id,
      match_id: newMatch.id
    }).eq('id', opponent.id)
  ])

  // 6. Buat notifikasi (Trigger FCM akan dihandle via edge function/webhook)
  await supabase.from('notifications').insert([
    {
      user_id: requester.user_id,
      type: 'match_found',
      title: 'Lawan Ditemukan!',
      body: `Kamu akan bertanding melawan ${opponent.users.full_name}`,
      data: { match_id: newMatch.id }
    },
    {
      user_id: opponent.user_id,
      type: 'match_found',
      title: 'Lawan Ditemukan!',
      body: `Kamu akan bertanding melawan ${requester.users.full_name}`,
      data: { match_id: newMatch.id }
    }
  ])

  return {
    found: true,
    matchId: newMatch.id,
    opponentId: opponent.user_id,
    message: 'Match ditemukan!'
  }
}
