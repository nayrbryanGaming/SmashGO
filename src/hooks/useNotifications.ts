// src/hooks/useNotifications.ts
'use client'
import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useNotificationStore } from '@/stores'

export function useNotifications() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { setUnreadCount } = useNotificationStore()

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data ?? []
    },
  })

  // Update unread count in Zustand
  useEffect(() => {
    if (query.data) {
      const unread = query.data.filter((n: any) => !n.is_read).length
      setUnreadCount(unread)
    }
  }, [query.data, setUnreadCount])

  // Realtime subscription for new notifications
  useEffect(() => {
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) return

      const channel = supabase
        .channel(`notifications-${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    })

    return () => authSub.unsubscribe()
  }, [supabase, queryClient])

  return query
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all_read: true }),
      })
      if (!res.ok) throw new Error('Gagal menandai semua notifikasi')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
