// src/components/layout/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, Trophy, User, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Calendar, label: 'Booking Lapangan', href: '/booking' },
  { icon: Users, label: 'Matchmaking', href: '/matchmaking' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  { icon: User, label: 'Profil Saya', href: '/profile' },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className={cn("hidden md:flex flex-col h-screen p-6 bg-card border-r sticky top-0 shadow-sm", className)}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-xl font-bold tracking-tight">SmashGo</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-primary")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-2 pt-6 border-t font-medium">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted w-full text-sm transition-colors group">
          <Settings className="h-5 w-5 group-hover:text-primary" />
          <span>Pengaturan</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 w-full text-sm transition-colors group"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
