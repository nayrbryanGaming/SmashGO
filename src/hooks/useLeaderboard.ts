// src/hooks/useLeaderboard.ts
'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useLeaderboard(limit = 50) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, elo_rating, skill_level, total_matches, total_wins, win_streak, loyalty_tier')
        .eq('is_active', true)
        .order('elo_rating', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000, // 1 minute
  })
}

export function useMyRank(userId: string | undefined) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['my-rank', userId],
    queryFn: async () => {
      if (!userId) return null
      // Get user's ELO
      const { data: myData } = await supabase
        .from('users')
        .select('elo_rating')
        .eq('id', userId)
        .single()

      if (!myData) return null

      // Count users with higher ELO
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gt('elo_rating', myData.elo_rating)
        .eq('is_active', true)

      return (count ?? 0) + 1
    },
    enabled: !!userId,
    staleTime: 60_000,
  })
}
