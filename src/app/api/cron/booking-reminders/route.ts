import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/resend'
import { addDays, format, startOfDay, endOfDay } from 'date-fns'
import { id } from 'date-fns/locale'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Verify Cron Secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tomorrow = addDays(new Date(), 1)
  const tomorrowStr = format(tomorrow, 'yyyy-MM-dd')

  // 1. Get all confirmed bookings for tomorrow
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_date,
      start_time,
      users (
        email,
        full_name,
        fcm_token
      ),
      courts (
        name,
        venues (
          name
        )
      )
    `)
    .eq('booking_date', tomorrowStr)
    .eq('status', 'confirmed')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = []

  // 2. Send reminders
  for (const b of bookings || []) {
    try {
      // Send Email via Resend
      await sendEmail({
        to: (b.users as any).email,
        subject: `Pengingat: Jadwal Main Besok di ${ (b.courts as any).venues.name }`,
        template: 'booking_reminder',
        data: {
          userName: (b.users as any).full_name,
          courtName: (b.courts as any).name,
          venueName: (b.courts as any).venues.name,
          bookingDate: format(new Date(b.booking_date), 'EEEE, d MMMM yyyy', { locale: id }),
          startTime: b.start_time.slice(0, 5),
        }
      })

      // TODO: Send Push Notification via FCM if token exists
      // if ((b.users as any).fcm_token) { ... }

      results.push({ id: b.id, status: 'sent' })
    } catch (e) {
      results.push({ id: b.id, status: 'failed', error: String(e) })
    }
  }

  return NextResponse.json({
    date: tomorrowStr,
    remindersSent: results.length,
    results
  })
}
