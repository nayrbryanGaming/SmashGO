// src/app/api/auth/logout/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  // Ambil user untuk memastikan sudah logout
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/login`, {
    status: 302,
  })
}
