// src/components/layout/NotificationBell.tsx
'use client'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useNotifications, useMarkNotificationRead } from '@/hooks/useNotifications'
import { useNotificationStore } from '@/stores'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export function NotificationBell() {
  const { data: notifications, isLoading } = useNotifications()
  const { unreadCount } = useNotificationStore()
  const { mutate: markRead } = useMarkNotificationRead()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group hover:bg-slate-800/50 rounded-xl transition-all">
          <Bell className="h-5 w-5 text-slate-400 group-hover:text-indigo-400" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 bg-red-500 border-2 border-slate-950 text-[10px] font-bold animate-in zoom-in duration-300"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] bg-slate-900 border-slate-800 p-0 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
           <h3 className="font-black italic text-sm tracking-tighter uppercase text-white">Notifikasi</h3>
           {unreadCount > 0 && (
             <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{unreadCount} Belum Dibaca</span>
           )}
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-8 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase animate-pulse">Memuat...</span>
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <Bell className="h-8 w-8 text-slate-800" />
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <DropdownMenuItem 
                  key={n.id} 
                  className={`flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-slate-800/50 border-b border-slate-800/50 last:border-0 ${!n.is_read ? 'bg-indigo-500/5' : ''}`}
                  onClick={() => !n.is_read && markRead(n.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${!n.is_read ? 'text-indigo-400' : 'text-slate-500'}`}>
                      {n.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-medium text-slate-600">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: id })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{n.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{n.body}</p>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator className="bg-slate-800" />
        <Link href="/notifications" className="block p-3 text-center text-[10px] font-black italic uppercase tracking-widest text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50 transition-colors">
          Lihat Semua Notifikasi
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
