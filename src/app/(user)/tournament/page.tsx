'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar, Users, ArrowRight, Zap, Target, Medal } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { motion } from 'framer-motion'

export default function TournamentListPage() {
  const supabase = createClient()

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true })
      if (error) throw error
      return data
    }
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 pb-32 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Turnamen SmashGo</h1>
        </div>
        <p className="text-slate-500 font-medium ml-1">Ikuti kompetisi bergengsi dan buktikan dominasimu di lapangan!</p>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 w-full bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : tournaments?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-10 w-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Belum Ada Turnamen Aktif</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Siapkan raketmu! Jadwal turnamen terbaru akan segera muncul di sini.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          {tournaments?.map((tournament) => (
            <motion.div key={tournament.id} variants={item}>
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white rounded-3xl group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img 
                    src={tournament.banner_url || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop"} 
                    alt={tournament.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <Badge className="bg-indigo-600 text-white border-none font-bold px-3 py-1 rounded-lg">
                      {tournament.match_type.toUpperCase().replace('_', ' ')}
                    </Badge>
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 font-bold px-3 py-1 rounded-lg">
                      {tournament.format.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-6 z-20">
                     <h3 className="text-2xl font-black text-white leading-tight">{tournament.name}</h3>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                  <p className="text-slate-500 font-medium text-sm line-clamp-2">
                    {tournament.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TANGGAL MAIN</p>
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                        <span>{format(new Date(tournament.start_date), 'd MMM yyyy', { locale: id })}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLOT PESERTA</p>
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Users className="h-4 w-4 text-indigo-600" />
                        <span>{tournament.current_participants} / {tournament.max_participants}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-50 flex gap-3">
                    <Link href={`/tournament/${tournament.id}`} className="flex-1">
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                        Detail
                      </Button>
                    </Link>
                    {tournament.status === 'open' && (
                      <Link href={`/tournament/register?id=${tournament.id}`} className="flex-1">
                        <Button className="w-full h-12 rounded-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 gap-2 overflow-hidden group">
                          DAFTAR <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
