// src/app/(admin)/admin/layout.tsx
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { UserNav } from '@/components/layout/UserNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar className="w-64" />
      <div className="flex-1 flex flex-col">
        {/* Header Admin */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dashboard</h2>
            <p className="text-sm font-medium text-white">Selamat Datang, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserNav />
          </div>
        </header>

        {/* Content Admin */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
