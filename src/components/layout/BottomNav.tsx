'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, Trophy, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { icon: Home, label: 'Beranda', href: '/dashboard' },
  { icon: Calendar, label: 'Booking', href: '/booking' },
  { icon: Users, label: 'Mabar', href: '/matchmaking' },
  { icon: Trophy, label: 'Ranking', href: '/leaderboard' },
  { icon: User, label: 'Profil', href: '/profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-slate-100 bg-white/80 backdrop-blur-2xl md:hidden pb-safe">
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
                  layoutId="active-indicator"
                  className="absolute bottom-1 w-12 h-1 bg-indigo-600 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                />
              )}
            </AnimatePresence>
            
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
              )}
            >
              <item.icon className="h-6 w-6" />
            </motion.div>
            
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest transition-all duration-300 mb-2",
              isActive ? "text-indigo-600 scale-105" : "text-slate-400"
            )}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
