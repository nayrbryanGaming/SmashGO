import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'elo' // 'elo' or 'loyalty'

  let query = supabase.from('users').select('id, full_name, avatar_url, elo_rating, skill_level, loyalty_points, loyalty_tier, division')

  if (type === 'elo') {
    query = query.order('elo_rating', { ascending: false })
  } else {
    query = query.order('loyalty_points', { ascending: false })
  }

  const { data, error } = await query.limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
