'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Medal, Rocket, Users, Target, ArrowUpRight, Star } from 'lucide-react'
import { eloToSkillLevel } from '@/lib/elo'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function LeaderboardPage() {
  const supabase = createClient()

  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('elo_rating', { ascending: false })
        .limit(20)
      return data
    }
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 mb-4 rotate-3">
           <Trophy className="text-white h-8 w-8" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">RANKING PEMAIN</h1>
        <p className="text-slate-500 font-medium">Jadilah yang terbaik di perusahaan and raih hadiah menarik.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
         {leaders?.slice(0, 3).map((player, index) => (
           <Card key={player.id} className={`bg-slate-900 border-slate-800 text-white relative overflow-hidden ${index === 0 ? 'scale-110 z-10 border-indigo-500/50' : 'scale-100'}`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-600'}`} />
              <CardContent className="pt-6 pb-8 text-center space-y-4">
                 <div className="relative inline-block">
                    <Avatar className={`w-16 h-16 border-4 mx-auto ${index === 0 ? 'border-indigo-500' : 'border-slate-800'}`}>
                       <AvatarImage src={player.avatar_url} />
                       <AvatarFallback className="bg-slate-800">{player.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[10px] font-black italic">
                       #{index + 1}
                    </div>
                 </div>
                 <div>
                    <p className="text-sm font-bold uppercase tracking-tight truncate">{player.full_name}</p>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{eloToSkillLevel(player.elo_rating)}</p>
                 </div>
                 <p className="text-2xl font-black italic tracking-tighter text-indigo-100">{player.elo_rating}</p>
              </CardContent>
           </Card>
         ))}
      </div>

      <Card className="bg-white border-slate-100 shadow-xl rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemain</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ELO</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rekor</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaders?.map((player, index) => (
                  <tr key={player.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4 font-black italic text-slate-300">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-slate-100 text-[10px] font-bold">{player.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{player.full_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{player.division || 'Umum'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 font-black italic text-[10px] px-2">
                          {player.elo_rating}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {player.total_wins}W - {player.total_matches - player.total_wins}L
                       </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
