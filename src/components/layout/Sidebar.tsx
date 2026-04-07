// src/components/layout/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  Users, 
  Trophy, 
  User, 
  LogOut, 
  Settings, 
  Gift, 
  ChevronRight,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NotificationBell } from './NotificationBell'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Calendar, label: 'Booking Lapangan', href: '/booking' },
  { icon: Users, label: 'Matchmaking', href: '/matchmaking' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  { icon: Gift, label: 'Hadiah & Loyalty', href: '/rewards' },
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
    <aside className={cn("hidden md:flex flex-col h-screen w-72 p-6 bg-slate-950 border-r border-slate-900 sticky top-0 shadow-2xl z-50", className)}>
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 rotate-3 group-hover:rotate-0 transition-transform">
            <Zap className="text-white h-6 w-6 fill-white" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white">SmashGo</span>
        </div>
        <NotificationBell />
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 px-4 italic">Menu Utama</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-indigo-600/10 text-white shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]" 
                  : "text-slate-500 hover:text-white hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-indigo-400")} />
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </div>
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
              )}
              <ChevronRight className={cn("h-4 w-4 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2", isActive ? "opacity-100 text-indigo-400" : "text-slate-700")} />
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-slate-900">
        <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 p-4 rounded-2xl border border-indigo-500/20 relative overflow-hidden group hover:from-indigo-600/30 hover:to-blue-600/30 transition-all cursor-default">
           <div className="relative z-10">
              <p className="text-[10px] font-black italic uppercase text-indigo-400 tracking-widest mb-1">Status Keanggotaan</p>
              <h4 className="text-sm font-black italic uppercase text-white tracking-tighter">PLATINUM TIER</h4>
              <div className="mt-2 h-1 bg-slate-950 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 w-3/4 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
              </div>
           </div>
           <Zap className="absolute -right-4 -bottom-4 h-24 w-24 text-indigo-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>

        <div className="space-y-1">
          <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-900 w-full text-xs font-bold uppercase tracking-widest transition-all group">
            <Settings className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 group-hover:rotate-45 transition-transform" />
            <span>Pengaturan</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 w-full text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
