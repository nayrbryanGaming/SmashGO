// src/app/api/payments/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMidtransPayment } from '@/lib/midtrans'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { booking_id } = await req.json()

  // Ambil detail booking
  const { data: booking, error: bookingErr } = await supabase
    .from('bookings')
    .select('*, users(full_name, email), courts(name)')
    .eq('id', booking_id)
    .eq('user_id', user.id)
    .single()

  if (bookingErr || !booking) {
    return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 })
  }

  try {
    // Generate Midtrans transaction
    const paymentData = await createMidtransPayment({
      bookingId: booking.id,
      userId: user.id,
      userEmail: (booking.users as any).email,
      userName: (booking.users as any).full_name,
      amount: booking.total_price,
      courtName: (booking.courts as any).name,
      bookingDate: booking.booking_date,
      startTime: booking.start_time,
      duration: booking.duration_hours,
    })

    // Simpan ke tabel payments
    const { data: payment, error: paymentErr } = await supabase
      .from('payments')
      .insert({
        booking_id: booking.id,
        user_id: user.id,
        midtrans_order_id: paymentData.order_id,
        snap_token: paymentData.token,
        payment_url: paymentData.redirect_url,
        amount: booking.total_price,
        status: 'pending'
      })
      .select()
      .single()

    if (paymentErr) {
      return NextResponse.json({ error: paymentErr.message }, { status: 500 })
    }

    return NextResponse.json({ 
      token: paymentData.token, 
      redirect_url: paymentData.redirect_url,
      payment_id: payment.id 
    })
  } catch (error: any) {
    console.error('Error creating payment', error)
    return NextResponse.json({ error: error.message || 'Gagal membuat pembayaran' }, { status: 500 })
  }
}
