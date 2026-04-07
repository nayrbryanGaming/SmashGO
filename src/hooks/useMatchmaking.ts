// src/hooks/useMatchmaking.ts
'use client'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useMatchmakingStatus() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['matchmaking', 'status'],
    queryFn: async () => {
      const res = await fetch('/api/matchmaking/status')
      if (!res.ok) return null
      return res.json()
    },
    refetchInterval: 5000,
  })
}

export function useRequestMatchmaking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      match_type: 'singles' | 'doubles' | 'mixed_doubles'
      preferred_date?: string
      preferred_time_start?: string
      preferred_time_end?: string
      venue_id?: string
    }) => {
      const res = await fetch('/api/matchmaking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal masuk antrian')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchmaking'] })
    },
  })
}

export function useCancelMatchmaking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (queueId: string) => {
      const res = await fetch('/api/matchmaking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queue_id: queueId }),
      })
      if (!res.ok) throw new Error('Gagal membatalkan')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchmaking'] })
    },
  })
}

export function useRealtimeQueue(queueId: string | null) {
  const [queueData, setQueueData] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!queueId) return

    const channel = supabase
      .channel(`queue-realtime-${queueId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matchmaking_queue',
          filter: `id=eq.${queueId}`,
        },
        (payload) => {
          setQueueData(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queueId, supabase])

  return queueData
}
