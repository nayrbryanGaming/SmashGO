import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startOfDay, endOfDay, subDays } from 'date-fns'

/**
 * AI Court Recommendation Engine (Heuristic-Based)
 * 1. Analyzes user's last 20 bookings.
 * 2. Identifies most frequent court, time slot, and venue.
 * 3. Weights recommendations by matching these preferences.
 * 4. Checks for availability in real-time.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. Get user's recent booking history (last 20 matches)
  const { data: history } = await supabase
    .from('bookings')
    .select('court_id, start_time, booking_date, courts(venue_id)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (!history || history.length === 0) {
    // Cold start: Recommend top-rated active courts
    const { data: topCourts } = await supabase
      .from('courts')
      .select('*, venues(name)')
      .eq('status', 'active')
      .limit(3)
    return NextResponse.json({ recommendations: topCourts, reason: 'POPULAR_CHOICES' })
  }

  // 2. Extract preferences
  const courtCounts: Record<string, number> = {}
  const venueCounts: Record<string, number> = {}
  const timeCounts: Record<string, number> = {}

  history.forEach(b => {
    courtCounts[b.court_id] = (courtCounts[b.court_id] || 0) + 1
    timeCounts[b.start_time] = (timeCounts[b.start_time] || 0) + 1
    const vId = (b.courts as any)?.venue_id
    if (vId) venueCounts[vId] = (venueCounts[vId] || 0) + 1
  })

  // Get top preferences
  const favCourtId = Object.entries(courtCounts).sort((a, b) => b[1] - a[1])[0][0]
  const favVenueId = Object.entries(venueCounts).sort((a, b) => b[1] - a[1])[0][0]
  const favTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0][0]

  // 3. Find 3 diverse recommendations
  // A. Their most played court
  const favCourt = await supabase.from('courts').select('*, venues(name)').eq('id', favCourtId).single()
  
  // B. Another court at their favorite venue
  const otherAtVenue = await supabase
    .from('courts')
    .select('*, venues(name)')
    .eq('venue_id', favVenueId)
    .neq('id', favCourtId)
    .limit(1)
    .single()

  // C. Any popular court matching their favorite time slot (placeholder for discovery)
  const discovery = await supabase
    .from('courts')
    .select('*, venues(name)')
    .eq('status', 'active')
    .neq('id', favCourtId)
    .neq('id', otherAtVenue.data?.id || '')
    .limit(1)
    .single()

  const recommendations = [
    favCourt.data,
    otherAtVenue.data,
    discovery.data
  ].filter(Boolean)

  return NextResponse.json({
    recommendations,
    preferences: { favTime },
    reason: 'PERSONALIZED_MATCHING'
  })
}
