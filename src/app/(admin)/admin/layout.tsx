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
      <AdminSidebar className="w-72" />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Admin */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
          {/* Spacer for mobile hamburger button */}
          <div className="flex flex-col pl-12 lg:pl-0">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Console</h2>
            <p className="text-sm font-medium text-white">SmashGo Management</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserNav />
          </div>
        </header>

        {/* Content Admin */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
