// @ts-expect-error: midtrans-client lacks type definitions
import midtransClient from 'midtrans-client'

let _midtransSnap: any = null
let _midtransCoreApi: any = null

export function getMidtransSnap() {
  if (!_midtransSnap) {
    _midtransSnap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    })
  }
  return _midtransSnap
}

export function getMidtransCoreApi() {
  if (!_midtransCoreApi) {
    _midtransCoreApi = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    })
  }
  return _midtransCoreApi
}

export interface CreatePaymentParams {
  bookingId: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  courtName: string
  bookingDate: string
  startTime: string
  duration: number
}

export async function createMidtransPayment(params: CreatePaymentParams) {
  const orderId = `SMASHGO-${params.bookingId}-${Date.now()}`
  
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: params.amount,
    },
    credit_card: {
      secure: true,
    },
    item_details: [
      {
        id: params.bookingId,
        price: params.amount,
        quantity: 1,
        name: `Booking ${params.courtName} - ${params.bookingDate} ${params.startTime} (${params.duration} jam)`,
      }
    ],
    customer_details: {
      first_name: params.userName,
      email: params.userEmail,
    },
    enabled_payments: [
      'credit_card',
      'mandiri_clickpay',
      'cimb_clicks',
      'bca_klikbca',
      'bca_klikpay',
      'bri_epay',
      'echannel',
      'permata_va',
      'bca_va',
      'bni_va',
      'bri_va',
      'other_va',
      'gopay',
      'shopeepay',
      'indomaret',
      'alfamart',
      'qris',
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      error: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/${params.bookingId}`,
    },
    expiry: {
      unit: 'hour',
      duration: 1,
    },
  }

  const transaction = await getMidtransSnap().createTransaction(parameter)
  return { token: transaction.token, redirect_url: transaction.redirect_url, order_id: orderId }
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const crypto = require('crypto')
  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const data = orderId + statusCode + grossAmount + serverKey
  const hash = crypto.createHash('sha512').update(data).digest('hex')
  return hash === signatureKey
}

export function getPaymentStatus(notification: any): 'pending' | 'success' | 'failed' | 'expired' | 'refunded' {
  const status = notification.transaction_status
  const fraud = notification.fraud_status

  if (status === 'capture') {
    if (fraud === 'challenge') return 'pending'
    return 'success'
  }
  if (status === 'settlement') return 'success'
  if (status === 'deny' || status === 'expire' || status === 'cancel') return 'failed'
  if (status === 'pending') return 'pending'
  if (status === 'refund') return 'refunded'
  
  return 'pending'
}
