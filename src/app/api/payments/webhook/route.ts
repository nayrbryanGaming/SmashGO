// src/app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyMidtransSignature } from '@/lib/midtrans'
import { sendEmail } from '@/lib/resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // Service role untuk bypass RLS
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

  // Verifikasi signature Midtrans — WAJIB untuk keamanan
  const isValid = verifyMidtransSignature(order_id, status_code, gross_amount.toString(), signature_key)
  if (!isValid) {
    console.error('Invalid Midtrans signature for order:', order_id)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Cari payment berdasarkan order_id
  const { data: payment, error: fetchErr } = await supabase
    .from('payments')
    .select('*, bookings(*, users(email, full_name, fcm_token), courts(name))')
    .eq('midtrans_order_id', order_id)
    .single()

  if (fetchErr || !payment) {
    return NextResponse.json({ error: 'Payment tidak ditemukan' }, { status: 404 })
  }

  // Tentukan status baru berdasarkan respons Midtrans
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
    return NextResponse.json({ ok: true }) // Status tidak dikenali, abaikan
  }

  // Update status payment
  await supabase.from('payments').update({
    status: newPaymentStatus,
    payment_method: payment_type,
    midtrans_transaction_id: transaction_id,
    paid_at: newPaymentStatus === 'success' ? new Date().toISOString() : null,
    webhook_payload: payload,
  }).eq('id', payment.id)

  // Update status booking
  await supabase.from('bookings').update({
    status: newBookingStatus,
  }).eq('id', payment.booking_id)

  // Jika sukses: generate QR + tambah loyalty points + kirim email
  if (newPaymentStatus === 'success') {
    const { generateBookingQR } = await import('@/lib/qrcode')
    const qrToken = await generateBookingQR(payment.booking_id)
    
    await supabase.from('bookings').update({ qr_code: qrToken }).eq('id', payment.booking_id)

    // Tambah loyalty points via RPC yang sudah dibetulkan
    await supabase.rpc('add_loyalty_points', {
      p_user_id: payment.bookings.user_id,
      p_points: 10,
      p_description: `Pembayaran booking ${payment.bookings.courts.name} berhasil.`
    })

    // Kirim email konfirmasi
    await sendEmail({
      to: (payment.bookings.users as any).email,
      subject: `Booking Terkonfirmasi - ${payment.bookings.courts.name}`,
      template: 'booking_confirmed',
      data: {
        userName: (payment.bookings.users as any).full_name,
        courtName: (payment.bookings.courts as any).name,
        bookingDate: payment.bookings.booking_date,
        startTime: payment.bookings.start_time,
        duration: payment.bookings.duration_hours,
        qrToken
      }
    })

    // Notifikasi in-app
    await supabase.from('notifications').insert({
      user_id: payment.bookings.user_id,
      type: 'payment_success',
      title: 'Pembayaran Berhasil!',
      body: `Booking ${payment.bookings.courts.name} telah dikonfirmasi. Tunjukkan QR code saat check-in.`,
      data: { booking_id: payment.booking_id }
    })
  }

  return NextResponse.json({ ok: true })
}
