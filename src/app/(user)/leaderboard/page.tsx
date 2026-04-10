// src/app/(user)/leaderboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Award, Zap, ChevronUp, ChevronDown, Minus, Medal } from 'lucide-react'
import { eloToSkillLevel } from '@/lib/elo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('elo')
  const supabase = createClient()

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      const { data } = await supabase
        .from('users')
        .select('*')
        .order(activeTab === 'elo' ? 'elo_rating' : 'loyalty_points', { ascending: false })
        .limit(50)
      
      setLeaderboard(data || [])
      setLoading(false)
    }
    fetchLeaderboard()
  }, [activeTab, supabase])

  if (loading) {
    return <div className="p-8 text-center animate-pulse py-20">Memuat Papan Peringkat...</div>
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto pb-24">
      <div className="space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">Leaderboard</h1>
        <p className="text-slate-500 font-medium">Jadilah yang terbaik di SmashGo Corporate.</p>
      </div>

      <Tabs defaultValue="elo" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 border-none grid grid-cols-2 mb-8">
          <TabsTrigger value="elo" className="rounded-xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            ELO RATING
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="rounded-xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            LOYALTY POINTS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elo" className="space-y-4">
           {leaderboard.map((player, index) => (
             <LeaderboardRow key={player.id} player={player} rank={index + 1} type="elo" />
           ))}
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
           {leaderboard.map((player, index) => (
             <LeaderboardRow key={player.id} player={player} rank={index + 1} type="loyalty" />
           ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LeaderboardRow({ player, rank, type }: { player: any, rank: number, type: 'elo' | 'loyalty' }) {
  const skill = eloToSkillLevel(player.elo_rating)
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="h-6 w-6 text-amber-400" />
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700" />
    return <span className="text-sm font-black text-slate-400">#{rank}</span>
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-white group">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 flex justify-center">
            {getRankBadge(rank)}
          </div>
          
          <Avatar className="h-12 w-12 border-2 border-slate-100">
            <AvatarImage src={player.avatar_url} />
            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">
              {player.full_name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 leading-none flex items-center gap-2">
              {player.full_name}
              {rank <= 3 && <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] h-4 font-black uppercase tracking-tighter border-slate-200 text-slate-400">
                {player.division || 'No Division'}
              </Badge>
              <span className={`text-[9px] font-bold uppercase ${skill.colorClass}`}>
                {skill.label}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="text-xl font-black text-slate-900 tracking-tighter">
            {type === 'elo' ? player.elo_rating : player.loyalty_points.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
             {rank === 1 ? <ChevronUp className="h-3 w-3 text-emerald-500" /> : <Minus className="h-3 w-3 text-slate-300" />}
             <span className="text-[10px] font-bold text-slate-400 uppercase">
               {type === 'elo' ? 'ELO' : 'PTS'}
             </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
