import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const redeemSchema = z.object({
  reward_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = redeemSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Check reward cost and user points
  const { data: reward } = await supabase
    .from('rewards')
    .select('*')
    .eq('id', parsed.data.reward_id)
    .single()

  if (!reward) return NextResponse.json({ error: 'Reward tidak ditemukan' }, { status: 404 })

  const { data: userData } = await supabase
    .from('users')
    .select('loyalty_points')
    .eq('id', user.id)
    .single()

  if (!userData || userData.loyalty_points < reward.points_cost) {
    return NextResponse.json({ error: 'Poin tidak mencukupi' }, { status: 400 })
  }

  // Create redemption record (Points subtraction is handled by a trigger or should be done here)
  // Let's do it manually if no trigger exists.
  const { error: redeemError } = await supabase
    .from('redemptions')
    .insert({
      user_id: user.id,
      reward_id: reward.id,
      points_spent: reward.points_cost,
      status: 'active',
      voucher_code: `SG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    })

  if (redeemError) return NextResponse.json({ error: redeemError.message }, { status: 500 })

  // Subtract points
  await supabase
    .from('users')
    .update({ loyalty_points: userData.loyalty_points - reward.points_cost })
    .eq('id', user.id)

  return NextResponse.json({ success: true, message: 'Reward berhasil di-redeem!' })
}
