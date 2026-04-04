// src/app/(user)/match/[matchId]/result/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Trophy, Star, TrendingUp, ChevronRight, Share2, Medal, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MatchResultPage() {
  const { matchId } = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMatchResult() {
      const { data } = await supabase
        .from('matches')
        .select(`
          *,
          player_a:users!player_a_id(full_name, avatar_url),
          player_b:users!player_b_id(full_name, avatar_url)
        `)
        .eq('id', matchId)
        .single()
      
      if (data) setMatch(data)
      setIsLoading(false)
    }
    fetchMatchResult()
  }, [matchId, supabase])

  if (isLoading) return <div className="h-screen flex items-center justify-center text-indigo-400 font-black uppercase animate-pulse">Menyiapkan Hasil Pertandingan...</div>

  const isPlayerAWinner = match?.winner_id === match?.player_a_id
  const totalEloChangeA = (match?.player_a_elo_after || 0) - (match?.player_a_elo_before || 0)
  const totalEloChangeB = (match?.player_b_elo_after || 0) - (match?.player_b_elo_before || 0)

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-700 max-w-4xl mx-auto pb-24 pt-8">
      <div className="text-center space-y-4">
         <div className="w-20 h-20 bg-amber-500/20 rounded-[40px] mx-auto flex items-center justify-center text-amber-500 shadow-2xl shadow-amber-900/20 rotate-12 group hover:rotate-0 transition-transform duration-500 border border-amber-500/10">
            <Trophy className="h-10 w-10 fill-amber-500" />
         </div>
         <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase uppercase">HASIL PERTANDINGAN</h1>
         <p className="text-slate-400 font-medium tracking-tight">Match #{matchId.toString().slice(0, 8)} • {new Date(match?.completed_at || Date.now()).toLocaleDateString('id-ID')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Player A Card */}
         <Card className={`relative overflow-hidden border-2 transition-all duration-500 ${isPlayerAWinner ? 'bg-indigo-600/20 border-indigo-500/50 shadow-2xl shadow-indigo-900/30' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
            <CardContent className="p-8 flex flex-col items-center gap-6">
               <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-slate-900 ring-4 ring-indigo-500/20 shadow-2xl">
                     <AvatarImage src={match?.player_a?.avatar_url} />
                     <AvatarFallback className="bg-slate-800 text-indigo-400 font-black text-2xl">{match?.player_a?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isPlayerAWinner && <Medal className="absolute -bottom-2 -right-2 h-10 w-10 text-amber-500 fill-amber-500 filter drop-shadow-lg" />}
               </div>
               
               <div className="text-center">
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{match?.player_a?.full_name}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-1">ELO RATING: {match?.player_a_elo_before}</p>
               </div>

               <div className={`flex flex-col items-center gap-1 p-4 rounded-3xl w-full ${isPlayerAWinner ? 'bg-indigo-500 text-white' : 'bg-slate-950 text-slate-400'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">ELO UPDATE</p>
                  <p className="text-3xl font-black italic tracking-tighter tabular-nums flex items-center gap-2">
                     {totalEloChangeA > 0 ? '+' : ''}{totalEloChangeA} 
                     <TrendingUp className={`h-6 w-6 ${totalEloChangeA > 0 ? 'text-emerald-300' : 'text-rose-400'}`} />
                  </p>
               </div>
            </CardContent>
            {isPlayerAWinner && <Badge className="absolute top-4 right-4 bg-indigo-500 text-white italic font-black uppercase tracking-widest shadow-xl">WINNER</Badge>}
         </Card>

         {/* Player B Card */}
         <Card className={`relative overflow-hidden border-2 transition-all duration-500 ${!isPlayerAWinner ? 'bg-indigo-600/20 border-indigo-500/50 shadow-2xl shadow-indigo-900/30' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
            <CardContent className="p-8 flex flex-col items-center gap-6">
               <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-slate-900 ring-4 ring-indigo-500/20 shadow-2xl">
                     <AvatarImage src={match?.player_b?.avatar_url} />
                     <AvatarFallback className="bg-slate-800 text-indigo-400 font-black text-2xl">{match?.player_b?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {!isPlayerAWinner && <Medal className="absolute -bottom-2 -right-2 h-10 w-10 text-amber-500 fill-amber-500 filter drop-shadow-lg" />}
               </div>
               
               <div className="text-center">
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{match?.player_b?.full_name}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-1">ELO RATING: {match?.player_b_elo_before}</p>
               </div>

               <div className={`flex flex-col items-center gap-1 p-4 rounded-3xl w-full ${!isPlayerAWinner ? 'bg-indigo-500 text-white' : 'bg-slate-950 text-slate-400'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">ELO UPDATE</p>
                  <p className="text-3xl font-black italic tracking-tighter tabular-nums flex items-center gap-2">
                     {totalEloChangeB > 0 ? '+' : ''}{totalEloChangeB} 
                     <TrendingUp className={`h-6 w-6 ${totalEloChangeB > 0 ? 'text-emerald-300' : 'text-rose-400'}`} />
                  </p>
               </div>
            </CardContent>
            {!isPlayerAWinner && <Badge className="absolute top-4 right-4 bg-indigo-500 text-white italic font-black uppercase tracking-widest shadow-xl">WINNER</Badge>}
         </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden group">
         <CardHeader className="bg-slate-950/50 p-6 border-b border-slate-800">
            <CardTitle className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
               <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> Skor Akhir & Statistik Match
            </CardTitle>
         </CardHeader>
         <CardContent className="p-8 flex flex-col items-center gap-8">
            <div className="flex items-center gap-10 md:gap-20">
               <div className="text-center space-y-1">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">PLAYER A</p>
                  <p className="text-6xl font-black text-white italic tracking-tighter tabular-nums">{match?.scores?.length ? match.scores.reduce((acc: number, s: any) => acc + (s.score_a > s.score_b ? 1 : 0), 0) : 0}</p>
               </div>
               <div className="h-16 w-px bg-slate-800 rotate-12" />
               <div className="text-center space-y-1">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">PLAYER B</p>
                  <p className="text-6xl font-black text-white italic tracking-tighter tabular-nums">{match?.scores?.length ? match.scores.reduce((acc: number, s: any) => acc + (s.score_b > s.score_a ? 1 : 0), 0) : 0}</p>
               </div>
            </div>

            <div className="w-full max-w-sm space-y-3 pt-6 border-t border-slate-800/50 italic">
               {match?.scores?.map((set: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm px-4 py-2 bg-slate-950 rounded-xl">
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SET {i+1}</span>
                     <span className="font-bold text-white tabular-nums">{set.score_a} - {set.score_b}</span>
                  </div>
               ))}
            </div>
         </CardContent>
         <CardFooter className="p-6 bg-slate-950 flex flex-col md:flex-row gap-4 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            <Button variant="outline" className="flex-1 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 gap-2 font-bold uppercase text-[10px] tracking-widest h-12">
               <Share2 className="h-4 w-4" /> Share Match Result
            </Button>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-black italic tracking-widest text-[10px] uppercase h-12 shadow-xl shadow-indigo-900/20 group"
            >
               LANJUT KE DASHBOARD <Zap className="h-4 w-4 ml-2 group-hover:scale-125 transition-transform" />
            </Button>
         </CardFooter>
      </Card>
    </div>
  )
}
