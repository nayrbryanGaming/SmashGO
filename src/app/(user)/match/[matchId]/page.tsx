// src/app/(user)/match/[matchId]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Timer, ArrowRight, Zap, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function MatchDetailPage() {
  const { matchId } = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMatch() {
      const { data } = await supabase
        .from('matches')
        .select('*, player_a:users!player_a_id(full_name, avatar_url, elo_rating), player_b:users!player_b_id(full_name, avatar_url, elo_rating)')
        .eq('id', matchId)
        .single()
      
      setMatch(data)
      setLoading(false)
    }
    fetchMatch()
  }, [matchId, supabase])

  if (loading || !match) return <div className="p-20 text-center animate-pulse">Memuat Pertandingan...</div>

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Match Detail</h1>
        <Badge className={match.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}>
          {match.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
         {/* Player A */}
         <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2rem]">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
               <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center p-1 border-4 border-white/10">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-indigo-600 font-black text-2xl">
                     {match.player_a?.full_name?.substring(0, 2).toUpperCase()}
                  </div>
               </div>
               <div>
                  <h2 className="text-2xl font-black">{match.player_a?.full_name}</h2>
                  <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">ELO: {match.player_a?.elo_rating}</p>
               </div>
               {match.winner_id === match.player_a_id && (
                 <Badge className="bg-amber-400 text-indigo-900 font-black italic border-none h-8 px-4">WINNER 🏆</Badge>
               )}
            </CardContent>
         </Card>

         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-2xl border-8 border-slate-50 font-black text-2xl italic text-slate-300">
            VS
         </div>

         {/* Player B */}
         <Card className="border-none shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-[2rem]">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
               <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center p-1 border-4 border-white/5">
                  <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center text-white font-black text-2xl">
                     {match.player_b?.full_name?.substring(0, 2).toUpperCase()}
                  </div>
               </div>
               <div>
                  <h2 className="text-2xl font-black">{match.player_b?.full_name}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">ELO: {match.player_b?.elo_rating}</p>
               </div>
               {match.winner_id === match.player_b_id && (
                 <Badge className="bg-amber-400 text-slate-900 font-black italic border-none h-8 px-4">WINNER 🏆</Badge>
               )}
            </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-xl bg-white rounded-[2rem]">
         <CardHeader>
            <CardTitle className="text-xl font-black italic uppercase tracking-tight">Match Info</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  <span className="font-bold text-slate-600">Match Type</span>
               </div>
               <span className="font-black uppercase text-indigo-600">{match.match_type}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="font-bold text-slate-600">Source</span>
               </div>
               <span className="font-black uppercase text-indigo-600">{match.source}</span>
            </div>
         </CardContent>
      </Card>

      {match.status === 'scheduled' && (
        <Button 
          className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-black uppercase italic tracking-widest shadow-xl shadow-indigo-100"
          onClick={() => router.push(`/match/${matchId}/result`)}
        >
          Input Hasil Pertandingan <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
