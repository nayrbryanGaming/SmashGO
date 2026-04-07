// src/hooks/useBookings.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useMyBookings(status?: string[]) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['bookings', 'mine', status],
    queryFn: async () => {
      let q = supabase
        .from('bookings')
        .select('*, courts(name, venue_id, venues(name, city))')
        .order('booking_date', { ascending: false })

      if (status && status.length > 0) {
        q = q.in('status', status)
      }

      const { data, error } = await q
      if (error) throw error
      return data ?? []
    },
  })
}

export function useBooking(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['bookings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, courts(*, venues(*))')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCourtAvailability(courtId: string, date: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['availability', courtId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_time, end_time, status')
        .eq('court_id', courtId)
        .eq('booking_date', date)
        .not('status', 'in', '("cancelled","expired")')
      if (error) throw error
      return data ?? []
    },
    enabled: !!courtId && !!date,
    staleTime: 30_000, // 30 seconds cache
  })
}

export function useCourts(venueId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['courts', venueId],
    queryFn: async () => {
      let q = supabase.from('courts').select('*, venues(name, city)').eq('is_active', true)
      if (venueId) q = q.eq('venue_id', venueId)
      const { data, error } = await q
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      court_id: string
      booking_date: string
      start_time: string
      end_time: string
      duration_hours: number
      total_price: number
    }) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat booking')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['availability'] })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (!res.ok) throw new Error('Gagal membatalkan booking')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useAllBookings(filters?: { status?: string[]; venueId?: string }) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['bookings', 'all', filters],
    queryFn: async () => {
      let q = supabase
        .from('bookings')
        .select(`
          *,
          courts (
            name, 
            venue_id, 
            venues (name, city)
          ),
          users (
            full_name, 
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.status && filters.status.length > 0) {
        q = q.in('status', filters.status)
      }
      if (filters?.venueId) {
        q = q.eq('courts.venue_id', filters.venueId)
      }

      const { data, error } = await q
      if (error) throw error
      return data ?? []
    },
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
