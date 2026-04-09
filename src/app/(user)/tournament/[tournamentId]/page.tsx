// src/app/(user)/tournament/[tournamentId]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Trophy, Users, Calendar, MapPin, ChevronLeft, ArrowRight, Share2, Info, Star, Medal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export default function TournamentDetailPage() {
  const { tournamentId } = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTournament() {
      const { data } = await supabase
        .from('tournaments')
        .select('*, venues(name, address)')
        .eq('id', tournamentId)
        .single()
      
      if (data) setTournament(data)
      setIsLoading(false)
    }
    fetchTournament()
  }, [tournamentId, supabase])

  if (isLoading) return <div className="h-64 flex items-center justify-center text-indigo-400 font-bold uppercase animate-pulse">Memuat Detail Turnamen...</div>

  if (!tournament) return (
    <div className="h-64 flex flex-col items-center justify-center p-8 text-center gap-4 bg-slate-900 border border-slate-800 rounded-3xl animate-in zoom-in-95 duration-500">
       <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
          <Medal className="h-8 w-8" />
       </div>
       <h1 className="text-2xl font-black text-white">Oops! Turnamen Tidak Ditemukan</h1>
       <p className="text-slate-400">Pastikan link yang kamu buka sudah benar atau hubungi admin.</p>
       <Button onClick={() => router.push('/tournament')} variant="outline">Kembali ke Daftar</Button>
    </div>
  )

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-700 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-xl">
         <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white gap-2">
            <ChevronLeft className="h-4 w-4" /> Kembali
         </Button>
         <Button variant="ghost" className="text-slate-400 hover:text-indigo-400">
            <Share2 className="h-4 w-4" />
         </Button>
      </div>

      <div className="relative group overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
         <div className="h-64 md:h-80 w-full relative">
            {tournament.banner_url ? (
               <img src={tournament.banner_url} alt={tournament.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            ) : (
               <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 flex items-center justify-center text-indigo-500/10">
                  <Trophy className="h-40 w-40" />
               </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
         </div>
         
         <div className="absolute bottom-0 left-0 p-8 space-y-4">
            <Badge className="bg-amber-500 text-white font-black italic border-none px-4 py-1.5 shadow-xl shadow-amber-900/40">OPEN REGISTRATION</Badge>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">{tournament.name}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-300">
               <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-white/5 uppercase tracking-widest"><Calendar className="h-3.5 w-3.5 text-indigo-400" /> {new Date(tournament.start_date).toLocaleDateString('id-ID')}</span>
               <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-white/5 uppercase tracking-widest"><Users className="h-3.5 w-3.5 text-indigo-400" /> {tournament.match_type}</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-8">
            <Card className="bg-slate-900 border-slate-800 shadow-xl p-8">
               <h2 className="text-xl font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" /> Deskripsi Acara
               </h2>
               <div className="prose prose-invert max-w-none text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {tournament.description || "Turnamen eksklusif untuk seluruh karyawan. Persiapkan diri Anda untuk kompetisi yang sengit dan jadilah juara!"}
               </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 shadow-xl p-8">
               <h2 className="text-xl font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Medal className="h-5 w-5" /> Hadiah & Penghargaan
               </h2>
               <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-amber-100 font-bold text-lg flex items-center gap-4 italic italic">
                  <Star className="h-10 w-10 text-amber-500 fill-amber-500 shadow-2xl" />
                  {tournament.prize_description || "Raih trofi juara dan hadiah eksklusif lainnya!"}
               </div>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 shadow-xl border-t-4 border-t-indigo-500">
               <CardHeader>
                  <CardTitle className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Informasi Pendaftaran</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex flex-col gap-1">
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Biaya Pendaftaran</p>
                     <p className="text-2xl font-black text-white">{tournament.entry_fee > 0 ? formatCurrency(tournament.entry_fee) : 'GRATIS'}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Kapasitas Peserta</p>
                     <p className="text-lg font-bold text-white leading-none pt-1 uppercase italic tracking-tighter">{tournament.current_participants} / {tournament.max_participants} <span className="text-xs font-normal text-indigo-400">Akun Terdaftar</span></p>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${(tournament.current_participants / tournament.max_participants) * 100}%` }} 
                        />
                     </div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lokasi Venue</p>
                     <p className="text-sm font-bold text-white flex items-center gap-1.5 pt-1">
                        <MapPin className="h-4 w-4 text-indigo-400" /> {tournament.venues?.name}
                     </p>
                     <p className="text-[10px] text-slate-600 pl-5 leading-tight">{tournament.venues?.address}</p>
                  </div>
               </CardContent>
               <CardFooter>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 font-black shadow-xl shadow-indigo-900/20 group uppercase tracking-widest text-xs italic">
                     Daftar Sekarang <Medal className="h-4 w-4 ml-2 group-hover:rotate-12 transition-transform" />
                  </Button>
               </CardFooter>
            </Card>
         </div>
      </div>
    </div>
  )
}
