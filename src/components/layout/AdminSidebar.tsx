// src/components/layout/AdminSidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  CalendarCheck, 
  ScanQrCode, 
  Package, 
  Trophy, 
  BarChart3, 
  LogOut,
  Settings,
  ShieldAlert,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const adminNavItems = [
  { icon: LayoutDashboard, label: 'DASHBOARD', href: '/admin/dashboard' },
  { icon: MapPin, label: 'KELOLA LAPANGAN', href: '/admin/courts' },
  { icon: CalendarCheck, label: 'SEMUA BOOKING', href: '/admin/bookings' },
  { icon: ScanQrCode, label: 'CHECK-IN (SCAN)', href: '/admin/checkin' },
  { icon: Package, label: 'INVENTARIS', href: '/admin/inventory' },
  { icon: Trophy, label: 'TURNAMEN', href: '/admin/tournaments' },
  { icon: Users, label: 'MANAJEMEN STAFF', href: '/admin/staff' },
  { icon: BarChart3, label: 'LAPORAN KEUANGAN', href: '/admin/reports' },
]

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className={cn("hidden lg:flex flex-col h-screen w-72 p-6 bg-slate-950 border-r border-red-900/20 sticky top-0 shadow-2xl z-50", className)}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 rotate-3 transition-transform">
          <ShieldAlert className="text-white h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">SmashGo</span>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] pt-1 italic">ADMIN CONSOLE</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4 px-4 italic">Management Control</p>
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-red-600/10 text-white shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]" 
                  : "text-slate-500 hover:text-white hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-red-500" : "text-slate-600 group-hover:text-red-500")} />
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </div>
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
              )}
              <ChevronRight className={cn("h-4 w-4 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2", isActive ? "opacity-100 text-red-500" : "text-slate-700")} />
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-slate-900">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
           <div className="flex items-center justify-between text-[10px] font-black italic uppercase text-slate-500 mb-2">
              <span>Server Status</span>
              <span className="flex items-center gap-1 text-green-500">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> ONLINE
              </span>
           </div>
           <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-full opacity-50" />
           </div>
        </div>

        <div className="space-y-1">
          <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-900 w-full text-xs font-bold uppercase tracking-widest transition-all group">
            <Settings className="h-5 w-5 text-slate-600 group-hover:text-red-500 group-hover:rotate-45 transition-transform" />
            <span>Pengaturan Sistem</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 w-full text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Keluar Admin</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
