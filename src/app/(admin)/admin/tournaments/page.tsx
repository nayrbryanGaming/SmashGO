'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trophy, Users, Calendar, Medal, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function AdminTournamentsPage() {
  const supabase = createClient()
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTournaments() {
      const { data } = await supabase
        .from('tournaments')
        .select('*, venues(name)')
        .order('start_date', { ascending: false })
      
      if (data) setTournaments(data)
      setLoading(false)
    }

    fetchTournaments()
  }, [])

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black">Turnamen & Event</h1>
          <p className="text-muted-foreground font-medium">Buat dan kelola kompetisi badminton perusahaan.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" /> Buat Turnamen
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 animate-pulse text-muted-foreground">Memuat data turnamen...</p>
        ) : tournaments.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed flex flex-col items-center gap-4">
            <Trophy className="h-16 w-16 text-muted-foreground opacity-10" />
            <p className="text-muted-foreground font-medium">Belum ada turnamen yang dibuat.</p>
            <Button variant="outline" className="font-bold">Mulai Buat Turnamen Pertama</Button>
          </div>
        ) : (
          tournaments.map((t) => (
            <Card key={t.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[21/9] bg-indigo-600 relative overflow-hidden">
                {t.banner_url ? (
                  <img src={t.banner_url} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="h-20 w-20 text-white/20" />
                  </div>
                )}
                <Badge className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border-none text-white uppercase font-black text-[10px] tracking-widest">
                  {t.match_type}
                </Badge>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black">{t.name}</CardTitle>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tight">
                      <Medal className="h-3 w-3" /> {t.format.replace('_', ' ')}
                    </div>
                  </div>
                  <Badge className={`${t.status === 'open' ? 'bg-green-500' : 'bg-muted text-muted-foreground'} border-none shadow-lg px-3 py-1 font-black tracking-widest text-[10px] uppercase`}>
                    {t.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">Mulai</span>
                    </div>
                    <p className="text-sm font-bold">{format(new Date(t.start_date), "dd MMM yyyy", { locale: id })}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">Peserta</span>
                    </div>
                    <p className="text-sm font-bold">{t.current_participants} / {t.max_participants}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 font-bold gap-2">
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                  <Button variant="outline" className="flex-1 font-bold gap-2">
                     Kelola Bracket
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
