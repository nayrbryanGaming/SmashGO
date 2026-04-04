import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Route protection rules
  const publicRoutes = ['/', '/login', '/register', '/verify']
  const adminRoutes = ['/admin']
  // const userRoutes = ['/dashboard', '/booking', '/matchmaking', '/match', '/tournament', '/leaderboard', '/rewards', '/profile', '/notifications']

  // Redirect ke login jika belum auth dan bukan public route
  if (!user && !publicRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Cek role untuk admin routes
  if (adminRoutes.some(r => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || !['admin', 'superadmin'].includes(userData.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect ke dashboard jika sudah login tapi akses halaman auth
  if (user && ['/login', '/register', '/verify'].includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|api/payments/webhook).*)'],
}
