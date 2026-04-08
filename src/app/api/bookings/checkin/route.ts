import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * API for Admin to check-in user using QR token
 */
export async function POST(req: NextRequest) {
  const supabase = createClient()
  
  // Verify Admin session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin' && userData?.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only admins can perform check-in' }, { status: 0 })
  }

  const { qr_token } = await req.json()
  if (!qr_token) {
    return NextResponse.json({ error: 'QR Token is required' }, { status: 400 })
  }

  // Find booking by qr_token
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, courts(name)')
    .eq('qr_code', qr_token)
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Invalid QR Tiket' }, { status: 404 })
  }

  if (booking.status === 'checked_in') {
    return NextResponse.json({ error: 'User sudah check-in sebelumnya' }, { status: 400 })
  }

  if (booking.status !== 'confirmed') {
    return NextResponse.json({ error: `Status booking tidak valid untuk check-in: ${booking.status}` }, { status: 400 })
  }

  // Update status to checked_in
  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      status: 'checked_in',
      checked_in_at: new Date().toISOString(),
      checked_in_by: user.id
    })
    .eq('id', booking.id)

  if (updateError) {
    return NextResponse.json({ error: 'Gagal melakukan check-in' }, { status: 500 })
  }

  // In-app notification for user
  await supabase.from('notifications').insert({
    user_id: booking.user_id,
    type: 'system',
    title: 'Check-in Berhasil',
    body: `Kamu telah berhasil check-in di ${booking.courts.name}. Selamat bermain!`,
    data: { booking_id: booking.id }
  })

  return NextResponse.json({
    success: true,
    message: 'Check-in berhasil',
    booking: {
      user_id: booking.user_id,
      court_name: booking.courts.name,
      start_time: booking.start_time
    }
  })
}
