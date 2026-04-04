// src/app/api/courts/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(req.url)
  const courtId = searchParams.get('courtId')
  const date = searchParams.get('date')

  if (!courtId || !date) {
    return NextResponse.json({ error: 'Missing courtId or date' }, { status: 400 })
  }

  // Ambil semua booking untuk lapangan tersebut pada tanggal tersebut
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('start_time, end_time, status')
    .eq('court_id', courtId)
    .eq('booking_date', date)
    .not('status', 'in', '("cancelled", "expired")')

  if (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Gagal mengecek ketersediaan' }, { status: 500 })
  }

  // Default slots: 06:00 - 23:00 (1 jam per slot)
  const slots = []
  for (let h = 6; h < 23; h++) {
    const startTime = `${h.toString().padStart(2, '0')}:00:00`
    const isBooked = bookings.some(b => b.start_time === startTime)
    slots.push({
      time: startTime,
      isAvailable: !isBooked
    })
  }

  return NextResponse.json({ success: true, slots })
}
