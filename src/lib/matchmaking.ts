// src/lib/matchmaking.ts
import { createClient } from '@supabase/supabase-js'
import { ELO_CONFIG } from './elo'
// import { sendMatchFoundNotification } from './fcm' // Assuming this is available or will be

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
  // Ambil data user yang sedang request
  const { data: requester, error: reqError } = await supabase
    .from('matchmaking_queue')
    .select('*, users(full_name, fcm_token)')
    .eq('id', queueEntryId)
    .eq('status', 'searching')
    .single()

  if (reqError || !requester) {
    return { found: false, message: 'Entry antrian tidak ditemukan atau sudah tidak aktif' }
  }

  // Cek apakah antrian sudah expired
  if (new Date(requester.expires_at) < new Date()) {
    await supabase
      .from('matchmaking_queue')
      .update({ status: 'expired' })
      .eq('id', queueEntryId)
    return { found: false, message: 'Antrian matchmaking sudah kadaluwarsa' }
  }

  // Query cari lawan yang cocok
  const { data: candidates } = await supabase
    .from('matchmaking_queue')
    .select('*, users(full_name, fcm_token)')
    .eq('status', 'searching')
    .eq('match_type', requester.match_type)
    .neq('user_id', requester.user_id)           // Bukan diri sendiri
    .gte('user_elo', requester.user_elo - requester.current_elo_threshold)
    .lte('user_elo', requester.user_elo + requester.current_elo_threshold)
    .gt('expires_at', new Date().toISOString())   // Belum expired
    .order('created_at', { ascending: true })     // Terlama menunggu duluan

  if (!candidates || candidates.length === 0) {
    // Expand threshold jika sudah > 2 menit sejak terakhir expand
    const lastExpand = new Date(requester.threshold_expanded_at)
    const now = new Date()
    const msSinceExpand = now.getTime() - lastExpand.getTime()

    if (
      msSinceExpand >= ELO_CONFIG.THRESHOLD_EXPANSION_INTERVAL_MS &&
      requester.current_elo_threshold < ELO_CONFIG.MAX_ELO_THRESHOLD
    ) {
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

    return { found: false, message: 'Belum ada lawan yang sesuai, masih mencari...' }
  }

  // Filter tambahan: preferensi waktu (jika ada)
  let bestCandidate = candidates[0]
  if (requester.preferred_date) {
    const timeMatches = candidates.filter(c => {
      if (!c.preferred_date) return true // Fleksibel → bisa kapan saja
      return c.preferred_date === requester.preferred_date
    })
    if (timeMatches.length > 0) {
      // Sort berdasarkan selisih ELO terkecil
      bestCandidate = timeMatches.sort((a, b) =>
        Math.abs(a.user_elo - requester.user_elo) - Math.abs(b.user_elo - requester.user_elo)
      )[0]
    }
  }

  // Buat record match baru
  const { data: newMatch, error: matchError } = await supabase
    .from('matches')
    .insert({
      player_a_id: requester.user_id,
      player_b_id: bestCandidate.user_id,
      match_type: requester.match_type,
      source: 'matchmaking',
      player_a_elo_before: requester.user_elo,
      player_b_elo_before: bestCandidate.user_elo,
      status: 'scheduled',
      scheduled_at: requester.preferred_date
        ? `${requester.preferred_date}T${requester.preferred_time_start || '08:00'}:00`
        : new Date(Date.now() + 3600000).toISOString() // Default: 1 jam dari sekarang
    })
    .select()
    .single()

  if (matchError || !newMatch) {
    return { found: false, message: 'Gagal membuat match, coba lagi' }
  }

  // Update kedua entry di antrian menjadi 'matched'
  await Promise.all([
    supabase.from('matchmaking_queue').update({
      status: 'matched',
      matched_with: bestCandidate.user_id,
      match_id: newMatch.id
    }).eq('id', queueEntryId),
    
    supabase.from('matchmaking_queue').update({
      status: 'matched',
      matched_with: requester.user_id,
      match_id: newMatch.id
    }).eq('user_id', bestCandidate.user_id).eq('status', 'searching')
  ])

  // Simpan notifikasi ke database (in-app)
  await Promise.all([
    supabase.from('notifications').insert({
      user_id: requester.user_id,
      type: 'match_found',
      title: 'Lawan Ditemukan!',
      body: `Kamu akan bertanding melawan ${bestCandidate.users?.full_name}. ELO mereka: ${bestCandidate.user_elo}. Konfirmasi sekarang!`,
      data: { match_id: newMatch.id, opponent_id: bestCandidate.user_id }
    }),
    supabase.from('notifications').insert({
      user_id: bestCandidate.user_id,
      type: 'match_found',
      title: 'Lawan Ditemukan!',
      body: `Kamu akan bertanding melawan ${requester.users?.full_name}. ELO mereka: ${requester.user_elo}. Konfirmasi sekarang!`,
      data: { match_id: newMatch.id, opponent_id: requester.user_id }
    })
  ])

  return {
    found: true,
    matchId: newMatch.id,
    opponentId: bestCandidate.user_id,
    message: 'Lawan ditemukan!'
  }
}

/**
 * Update ELO kedua pemain setelah match selesai
 * Dipanggil dari API PATCH /api/matches/score setelah match completed
 */
export async function updateEloAfterMatch(matchId: string): Promise<void> {
  const { data: match } = await supabase
    .from('matches')
    .select('*, player_a:users!matches_player_a_id_fkey(id, elo_rating, total_matches, loyalty_points, total_wins), player_b:users!matches_player_b_id_fkey(id, elo_rating, total_matches, loyalty_points, total_wins)')
    .eq('id', matchId)
    .eq('status', 'completed')
    .single()

  if (!match || !match.winner_id) return

  const { calculateNewElo, ELO_CONFIG: cfg } = await import('./elo')

  const isAWinner = match.winner_id === match.player_a_id
  const result = calculateNewElo(
    { userId: match.player_a_id, elo: match.player_a_elo_before!, totalMatches: match.player_a.total_matches },
    { userId: match.player_b_id, elo: match.player_b_elo_before!, totalMatches: match.player_b.total_matches },
    isAWinner ? 'A' : (match.winner_id === 'DRAW' ? 'DRAW' : 'B')
  )

  // Update ELO kedua pemain
  await Promise.all([
    supabase.from('users').update({
      elo_rating: result.playerANewElo,
      total_matches: match.player_a.total_matches + 1,
      total_wins: isAWinner ? match.player_a.total_wins + 1 : match.player_a.total_wins,
      loyalty_points: (match.player_a.loyalty_points || 0) + (isAWinner ? cfg.POINTS_WIN : (match.winner_id === 'DRAW' ? Math.floor(cfg.POINTS_WIN/2) : cfg.POINTS_LOSE))
    }).eq('id', match.player_a_id),
    
    supabase.from('users').update({
      elo_rating: result.playerBNewElo,
      total_matches: match.player_b.total_matches + 1,
      total_wins: match.winner_id === match.player_b_id ? match.player_b.total_wins + 1 : match.player_b.total_wins,
      loyalty_points: (match.player_b.loyalty_points || 0) + (match.winner_id === match.player_b_id ? cfg.POINTS_WIN : (match.winner_id === 'DRAW' ? Math.floor(cfg.POINTS_WIN/2) : cfg.POINTS_LOSE))
    }).eq('id', match.player_b_id),

    // Update match dengan ELO after
    supabase.from('matches').update({
      player_a_elo_after: result.playerANewElo,
      player_b_elo_after: result.playerBNewElo
    }).eq('id', matchId)
  ])
}
