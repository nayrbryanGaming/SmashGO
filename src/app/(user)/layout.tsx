// src/app/(user)/layout.tsx
import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden md:flex w-64 border-r bg-card h-screen sticky top-0" />
      <main className="flex-1 overflow-y-auto">
        {children}
        <BottomNav />
      </main>
    </div>
  )
}
