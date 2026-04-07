// src/hooks/useMatchScore.ts
'use client'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface SetScore {
  set: number
  score_a: number
  score_b: number
}

export function useMatch(matchId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          player_a:users!matches_player_a_id_fkey(id, full_name, elo_rating, avatar_url),
          player_b:users!matches_player_b_id_fkey(id, full_name, elo_rating, avatar_url)
        `)
        .eq('id', matchId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!matchId,
  })
}

export function useRealtimeMatchScore(matchId: string | null) {
  const [liveMatch, setLiveMatch] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!matchId) return

    // Initial fetch
    supabase
      .from('matches')
      .select(`
        *,
        player_a:users!matches_player_a_id_fkey(id, full_name, elo_rating, avatar_url),
        player_b:users!matches_player_b_id_fkey(id, full_name, elo_rating, avatar_url)
      `)
      .eq('id', matchId)
      .single()
      .then(({ data }) => { if (data) setLiveMatch(data) })

    // Realtime subscription
    const channel = supabase
      .channel(`match-live-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          setLiveMatch((prev: any) => ({ ...prev, ...payload.new }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, supabase])

  return liveMatch
}

export function useUpdateScore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      matchId: string
      scores: SetScore[]
      winner_id?: string
      status?: string
    }) => {
      const res = await fetch('/api/matches/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal update skor')
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match', variables.matchId] })
    },
  })
}
