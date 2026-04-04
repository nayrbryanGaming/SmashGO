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
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: MapPin, label: 'Kelola Lapangan', href: '/admin/courts' },
  { icon: CalendarCheck, label: 'Semua Booking', href: '/admin/bookings' },
  { icon: ScanQrCode, label: 'Check-in (Scan)', href: '/admin/checkin' },
  { icon: Package, label: 'Inventaris', href: '/admin/inventory' },
  { icon: Trophy, label: 'Turnamen', href: '/admin/tournaments' },
  { icon: Users, label: 'Manajemen Staff', href: '/admin/staff' },
  { icon: BarChart3, label: 'Laporan Keuangan', href: '/admin/reports' },
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
    <aside className={cn("hidden lg:flex flex-col h-screen p-6 bg-slate-900 text-slate-300 border-r border-slate-800 sticky top-0", className)}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold">S</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-white leading-tight">SmashGo</span>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-1 pt-6 border-t border-slate-800 font-medium">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white w-full text-sm transition-colors group">
          <Settings className="h-5 w-5 text-slate-500 group-hover:text-indigo-400" />
          <span>Pengaturan Sistem</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 w-full text-sm transition-colors group"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar Admin</span>
        </button>
      </div>
    </aside>
  )
}
