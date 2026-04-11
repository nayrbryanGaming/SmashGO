import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyMidtransSignature, getPaymentStatus } from '@/lib/midtrans'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await req.json()
    console.log('Midtrans Webhook Received:', body)

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
    } = body

    // 1. Verify Signature
    const isVerified = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key)
    if (!isVerified) {
      console.error('Invalid Midtrans Signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // 2. Identify transaction status
    const paymentStatus = getPaymentStatus(body)
    
    // Extract booking ID from order_id (Format: SMASHGO-{booking_id}-{timestamp})
    const bookingId = order_id.split('-')[1]

    // 3. Update Payments & Bookings
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        midtrans_transaction_id: body.transaction_id,
        payment_method: body.payment_type,
        paid_at: paymentStatus === 'success' ? new Date().toISOString() : null,
        webhook_payload: body
      })
      .eq('midtrans_order_id', order_id)

    if (paymentError) throw paymentError

    // If success, update booking status and generate QR token
    if (paymentStatus === 'success') {
      const qrToken = `SG-${bookingId.substring(0, 8)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase()
      
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          qr_code: qrToken
        })
        .eq('id', bookingId)
      
      if (bookingError) throw bookingError

      // 4. Send notification
      const { data: booking } = await supabase.from('bookings').select('user_id').eq('id', bookingId).single()
      if (booking) {
        await supabase.from('notifications').insert({
          user_id: booking.user_id,
          type: 'payment_success',
          title: 'Pembayaran Berhasil!',
          body: 'Booking lapangan kamu telah dikonfirmasi. Tunjukkan QR Code saat check-in.',
          data: { booking_id: bookingId, qr_code: qrToken }
        })
      }
    } else if (paymentStatus === 'failed' || paymentStatus === 'expired') {
      await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancellation_reason: 'Payment failed/expired' })
        .eq('id', bookingId)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Webhook Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
