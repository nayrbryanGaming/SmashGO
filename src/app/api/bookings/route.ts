// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const bookingSchema = z.object({
  court_id: z.string().uuid(),
  booking_date: z.string().date(),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  duration_hours: z.number().min(1).max(5),
})

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  let query = supabase
    .from('bookings')
    .select('*, courts(name, venues(name))')
    .order('booking_date', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = bookingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { court_id, booking_date, start_time, duration_hours } = parsed.data

  // Hitung end_time
  const [h, m] = start_time.split(':').map(Number)
  const endH = h + Math.floor(duration_hours)
  const endM = m + (duration_hours % 1) * 60
  const end_time = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`

  // Cek harga lapangan
  const { data: court } = await supabase
    .from('courts')
    .select('*')
    .eq('id', court_id)
    .single()

  if (!court) {
    return NextResponse.json({ error: 'Lapangan tidak ditemukan' }, { status: 404 })
  }

  // Logika harga sederhana berdasarkan waktu
  let hourlyPrice = court.price_morning
  if (h >= 12 && h < 18) hourlyPrice = court.price_afternoon
  if (h >= 18) hourlyPrice = court.price_evening

  const total_price = hourlyPrice * duration_hours

  // Insert booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      court_id,
      booking_date,
      start_time,
      end_time,
      duration_hours,
      total_price,
      status: 'pending_payment'
    })
    .select()
    .single()

  if (bookingError) {
    // Biasanya ini karena constraint GIST (bentrok jadwal)
    if (bookingError.code === '23P01') {
      return NextResponse.json({ error: 'Jadwal ini sudah dibooking. Silakan pilih waktu lain.' }, { status: 409 })
    }
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  // 4. Create Midtrans Payment Automatically
  try {
    const { createMidtransPayment } = await import('@/lib/midtrans')
    
    // Generate Order ID for Midtrans
    const midtrans = await createMidtransPayment({
      bookingId: booking.id,
      userId: user.id,
      userEmail: user.email!,
      userName: user.user_metadata?.full_name || 'Pelanggan SmashGo',
      amount: total_price,
      courtName: court.name,
      bookingDate,
      startTime: start_time,
      duration: duration_hours
    })

    // Insert into payments table
    await supabase.from('payments').insert({
      booking_id: booking.id,
      user_id: user.id,
      midtrans_order_id: midtrans.order_id,
      snap_token: midtrans.token,
      payment_url: midtrans.redirect_url,
      amount: total_price,
      status: 'pending'
    })

    return NextResponse.json({
      ...booking,
      payment: {
        token: midtrans.token,
        redirect_url: midtrans.redirect_url,
        order_id: midtrans.order_id
      }
    })
  } catch (paymentError: any) {
    console.error('Payment creation error:', paymentError)
    // Return booking even if payment fails to be created (user can retry payment later)
    return NextResponse.json(booking)
  }
}
