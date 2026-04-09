// src/lib/elo.ts
// ============================================================
// ALGORITMA ELO RATING SYSTEM UNTUK SMASHGO BADMINTON
// Berdasarkan sistem rating catur FIDE, dimodifikasi untuk badminton
// ============================================================

export const ELO_CONFIG = {
  INITIAL_RATING: 1000,           // Rating awal semua pemain baru
  K_FACTOR_BEGINNER: 40,          // K-factor untuk <30 pertandingan (lebih dinamis)
  K_FACTOR_INTERMEDIATE: 32,      // K-factor untuk 30–100 pertandingan (standar)
  K_FACTOR_EXPERIENCED: 24,       // K-factor untuk >100 pertandingan (lebih stabil)
  K_FACTOR_MASTER: 10,            // K-factor untuk level Master
  
  MIN_RATING: 100,                // Rating minimum (tidak bisa di bawah ini)
  MAX_RATING: 3000,               // Rating maksimum teoritis
  
  // Matchmaking thresholds
  INITIAL_ELO_THRESHOLD: 150,     // Selisih ELO maks saat pertama cari lawan
  THRESHOLD_EXPANSION_STEP: 50,   // Penambahan threshold tiap 2 menit tidak dapat lawan
  THRESHOLD_EXPANSION_INTERVAL_MS: 120000, // 2 menit dalam ms
  MAX_ELO_THRESHOLD: 400,         // Selisih ELO maks absolut
  MATCHMAKING_TIMEOUT_MS: 1800000, // 30 menit timeout antrian
  
  // Loyalty points reward setelah match
  POINTS_WIN: 5,
  POINTS_LOSE: 2,
  POINTS_WIN_TOURNAMENT: 50,
  POINTS_BOOKING: 10,
}

export interface PlayerRating {
  userId: string
  elo: number
  totalMatches: number
}

export interface EloCalculationResult {
  playerANewElo: number
  playerBNewElo: number
  playerAEloChange: number
  playerBEloChange: number
  playerAExpected: number    // Probabilitas A menang (0-1)
  playerBExpected: number    // Probabilitas B menang (0-1)
}

/**
 * Hitung expected score (probabilitas menang) menggunakan rumus ELO standar
 * Expected(A) = 1 / (1 + 10^((ELO_B - ELO_A) / 400))
 */
export function calculateExpectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400))
}

/**
 * Tentukan K-factor berdasarkan jumlah pertandingan pemain
 */
export function getKFactor(totalMatches: number, elo: number): number {
  if (elo >= 2400) return ELO_CONFIG.K_FACTOR_MASTER
  if (totalMatches < 30) return ELO_CONFIG.K_FACTOR_BEGINNER
  if (totalMatches < 100) return ELO_CONFIG.K_FACTOR_INTERMEDIATE
  return ELO_CONFIG.K_FACTOR_EXPERIENCED
}

/**
 * Hitung ELO baru setelah pertandingan selesai
 */
export function calculateNewElo(
  playerA: PlayerRating,
  playerB: PlayerRating,
  winnerId: 'A' | 'B' | 'DRAW'
): EloCalculationResult {
  const expectedA = calculateExpectedScore(playerA.elo, playerB.elo)
  const expectedB = 1 - expectedA
  
  const kA = getKFactor(playerA.totalMatches, playerA.elo)
  const kB = getKFactor(playerB.totalMatches, playerB.elo)
  
  const actualA = winnerId === 'A' ? 1 : (winnerId === 'DRAW' ? 0.5 : 0)
  const actualB = winnerId === 'B' ? 1 : (winnerId === 'DRAW' ? 0.5 : 0)
  
  const eloChangeA = Math.round(kA * (actualA - expectedA))
  const eloChangeB = Math.round(kB * (actualB - expectedB))
  
  const newEloA = Math.max(ELO_CONFIG.MIN_RATING, Math.min(ELO_CONFIG.MAX_RATING, playerA.elo + eloChangeA))
  const newEloB = Math.max(ELO_CONFIG.MIN_RATING, Math.min(ELO_CONFIG.MAX_RATING, playerB.elo + eloChangeB))
  
  return {
    playerANewElo: newEloA,
    playerBNewElo: newEloB,
    playerAEloChange: newEloA - playerA.elo,
    playerBEloChange: newEloB - playerB.elo,
    playerAExpected: expectedA,
    playerBExpected: expectedB,
  }
}

/**
 * Konversi ELO ke level skill Indonesia
 */
export function eloToSkillLevel(elo: number): string {
  if (elo < 1000) return 'pemula'
  if (elo < 1500) return 'menengah'
  if (elo < 2000) return 'mahir'
  return 'master'
}
/**
 * Tentukan tier loyalty berdasarkan total poin
 */
export function getLoyaltyTier(points: number): {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  label: string
  nextTierPoints: number | null
  progress: number  // 0-100
} {
  if (points >= 5000) return { tier: 'platinum', label: 'Platinum', nextTierPoints: null, progress: 100 }
  if (points >= 2000) return { tier: 'gold',     label: 'Gold',     nextTierPoints: 5000, progress: Math.round(((points - 2000) / 3000) * 100) }
  if (points >= 500)  return { tier: 'silver',   label: 'Silver',   nextTierPoints: 2000, progress: Math.round(((points - 500)  / 1500) * 100) }
  return                     { tier: 'bronze',   label: 'Bronze',   nextTierPoints: 500,  progress: Math.round((points / 500) * 100) }
}
