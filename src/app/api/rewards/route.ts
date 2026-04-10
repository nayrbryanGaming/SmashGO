import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get active rewards
  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('is_active', true)
    .order('points_cost', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get user's current loyalty points
  const { data: userData } = await supabase
    .from('users')
    .select('loyalty_points, loyalty_tier')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    rewards,
    userPoints: userData?.loyalty_points || 0,
    userTier: userData?.loyalty_tier || 'bronze'
  })
}
