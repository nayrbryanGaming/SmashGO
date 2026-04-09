// src/app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status
  } = body

  // 1. Verify Signature Key (Security)
  // signature_key = hash(order_id + status_code + gross_amount + server_key)
  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const hash = crypto.createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest('hex')

  if (hash !== signature_key) {
    console.error('INVALID_SIGNATURE_KEY', { hash, signature_key })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  const supabase = await createClient()
  const bookingId = order_id.split('-')[1] // Extract bookingId from SMASHGO-{bookingId}-{timestamp}

  console.log(`Processing Webhook for Order ID: ${order_id}, Status: ${transaction_status}`)

  // 2. Map Midtrans status to SmashGo status
  let smashStatus = 'pending_payment'
  if (transaction_status === 'capture' || transaction_status === 'settlement') {
    if (transaction_status === 'capture' && fraud_status === 'challenge') {
       smashStatus = 'pending_payment' // Challenged by Midtrans fraud detect
    } else {
       smashStatus = 'confirmed'
    }
  } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
    smashStatus = 'expired'
  } else if (transaction_status === 'pending') {
    smashStatus = 'pending_payment'
  }

  // 3. Update Booking & Payment in DB
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: smashStatus })
    .eq('id', bookingId)

  const { error: paymentError } = await supabase
    .from('payments')
    .update({ 
      status: transaction_status === 'settlement' || transaction_status === 'capture' ? 'success' : 
              (transaction_status === 'pending' ? 'pending' : 'failed'),
      webhook_payload: body,
      paid_at: smashStatus === 'confirmed' ? new Date().toISOString() : null
    })
    .eq('midtrans_order_id', order_id)

  if (bookingError || paymentError) {
    console.error('DATABASE_UPDATE_ERROR', { bookingError, paymentError })
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
  }

  // 4. Send Notification if Confirmed
  if (smashStatus === 'confirmed') {
    // We could trigger a helper function/edge function here to send FCM/Email
    // For now, it will be visible in the user's notification list next time they load
  }

  return NextResponse.json({ success: true, status: smashStatus })
}
