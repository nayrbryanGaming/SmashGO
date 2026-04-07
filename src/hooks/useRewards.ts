// src/hooks/useRewards.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useRewards() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost', { ascending: true })
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60_000,
  })
}

export function useMyRedemptions() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['redemptions', 'mine'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('redemptions')
        .select('*, rewards(name, description, reward_type)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useRedeemReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (rewardId: string) => {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reward_id: rewardId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal redeem hadiah')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] })
      queryClient.invalidateQueries({ queryKey: ['rewards'] })
    },
  })
}
