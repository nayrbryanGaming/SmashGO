// src/components/layout/BottomNav.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, Trophy, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { icon: Home, label: 'HOME', href: '/dashboard' },
  { icon: Calendar, label: 'BOOKING', href: '/booking' },
  { icon: Users, label: 'MABAR', href: '/matchmaking' },
  { icon: Trophy, label: 'RANK', href: '/leaderboard' },
  { icon: User, label: 'PROFIL', href: '/profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-slate-900 bg-slate-950/80 backdrop-blur-2xl md:hidden pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center justify-center gap-1 w-full h-full group"
          >
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  layoutId="active-nav-glow"
                  className="absolute inset-0 bg-indigo-600/10 blur-xl rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                />
              )}
            </AnimatePresence>
            
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={cn(
                "p-2 rounded-2xl transition-all duration-300 relative z-10",
                isActive ? "text-indigo-400 bg-indigo-600/10" : "text-slate-600 group-hover:text-slate-400"
              )}
            >
              <item.icon className="h-6 w-6" />
            </motion.div>
            
            <span className={cn(
              "text-[8px] font-black italic tracking-widest transition-all duration-300 mb-2 relative z-10 uppercase",
              isActive ? "text-white scale-110" : "text-slate-700"
            )}>
              {item.label}
            </span>

            {isActive && (
              <motion.div 
                layoutId="active-dot"
                className="absolute bottom-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,1)]"
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
