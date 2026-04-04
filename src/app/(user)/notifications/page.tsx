'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, CheckCircle2, MessageSquare, AlertCircle, Calendar, Trophy } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default function NotificationsPage() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (data) setNotifications(data)
      setLoading(false)
    }

    fetchNotifications()

    // Realtime subscription
    const channel = supabase
      .channel('notif-page')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_success': return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'match_found': return <Trophy className="h-5 w-5 text-yellow-500" />
      case 'booking_confirmed': return <Calendar className="h-5 w-5 text-blue-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container max-w-2xl py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black flex items-center gap-2">
          <Bell className="h-8 w-8 text-primary" /> Notifikasi
        </h1>
        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-muted-foreground hover:text-primary">
          Tandai semua dibaca
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground animate-pulse py-20">Memuat notifikasi...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 space-y-3 bg-muted/30 rounded-3xl border-2 border-dashed">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
            <p className="text-muted-foreground font-medium">Belum ada notifikasi untukmu.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Card key={notif.id} className={`border-none shadow-sm transition-all hover:shadow-md ${!notif.is_read ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}>
              <CardContent className="p-4 flex gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${!notif.is_read ? 'bg-primary/10' : 'bg-muted'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm ${!notif.is_read ? 'font-bold' : 'font-semibold'}`}>{notif.title}</p>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.body}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
