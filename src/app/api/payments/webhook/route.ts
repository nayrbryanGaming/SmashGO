// src/app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyMidtransSignature } from '@/lib/midtrans'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const payload = await req.json()
  
  const {
    order_id,
    transaction_status,
    fraud_status,
    status_code,
    gross_amount,
    signature_key,
    payment_type,
    transaction_id
  } = payload

  // 1. Verifikasi signature Midtrans
  const isValid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 2. Cari payment
  const { data: payment } = await supabase
    .from('payments')
    .select('*, bookings(*)')
    .eq('midtrans_order_id', order_id)
    .single()

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  // 3. Tentukan status
  let newPaymentStatus: string
  let newBookingStatus: string

  if (transaction_status === 'capture' || transaction_status === 'settlement') {
    if (fraud_status === 'accept' || !fraud_status) {
      newPaymentStatus = 'success'
      newBookingStatus = 'confirmed'
    } else {
      newPaymentStatus = 'failed'
      newBookingStatus = 'cancelled'
    }
  } else if (transaction_status === 'pending') {
    newPaymentStatus = 'pending'
    newBookingStatus = 'pending_payment'
  } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
    newPaymentStatus = transaction_status === 'expire' ? 'expired' : 'failed'
    newBookingStatus = 'cancelled'
  } else {
    return NextResponse.json({ ok: true })
  }

  // 4. Update DB
  await Promise.all([
    supabase.from('payments').update({
      status: newPaymentStatus,
      payment_method: payment_type,
      midtrans_transaction_id: transaction_id,
      paid_at: newPaymentStatus === 'success' ? new Date().toISOString() : null,
      webhook_payload: payload,
    }).eq('id', payment.id),
    
    supabase.from('bookings').update({
      status: newBookingStatus,
    }).eq('id', payment.booking_id)
  ])

  // 5. Success actions (Notif/QR)
  if (newPaymentStatus === 'success') {
    // Loyalty points
    await supabase.rpc('add_loyalty_points', {
      p_user_id: payment.user_id,
      p_points: 10
    })

    // In-app notification
    await supabase.from('notifications').insert({
      user_id: payment.user_id,
      type: 'payment_success',
      title: 'Pembayaran Berhasil!',
      body: `Booking kamu telah dikonfirmasi. Tunjukkan QR code saat check-in.`,
      data: { booking_id: payment.booking_id }
    })
  }

  return NextResponse.json({ ok: true })
}
