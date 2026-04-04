import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

const tournamentSchema = z.object({
  venue_id: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().optional(),
  match_type: z.enum(['singles', 'doubles', 'mixed_doubles']),
  format: z.enum(['single_elimination', 'double_elimination', 'round_robin']),
  max_participants: z.number().int().positive(),
  registration_deadline: z.string(),
  start_date: z.string(),
  entry_fee: z.number().int().nonnegative().default(0),
})

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Admin and Superadmin check
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || !['admin', 'superadmin'].includes(userData.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = tournamentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error } = await supabase
    .from('tournaments')
    .insert({
      ...parsed.data,
      created_by: user.id,
      status: 'open'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
