import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

  // 1. Expire pending bookings that haven't been paid
  const { data: expiredBookings, error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'expired' })
    .eq('status', 'pending_payment')
    .lt('created_at', oneHourAgo)
    .select('id')

  // 2. Expire old queue entries
  const thirtyMinsAgo = new Date(Date.now() - 1800000).toISOString()
  const { data: expiredQueue, error: queueError } = await supabase
    .from('matchmaking_queue')
    .update({ status: 'expired' })
    .eq('status', 'searching')
    .lt('created_at', thirtyMinsAgo)
    .select('id')

  if (bookingError || queueError) {
    return NextResponse.json({ error: 'Failed to expire some records' }, { status: 500 })
  }

  return NextResponse.json({
    expiredBookingsCount: expiredBookings?.length || 0,
    expiredQueueCount: expiredQueue?.length || 0
  })
}
