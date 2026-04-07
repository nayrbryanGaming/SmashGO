// src/app/(user)/leaderboard/page.tsx
'use client'
import { useLeaderboard, useMyRank } from '@/hooks/useLeaderboard'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Medal, MoveUp, MoveDown, Minus } from 'lucide-react'

export default function LeaderboardPage() {
  const { profile } = useAuth()
  const { data: leaderboard, isLoading } = useLeaderboard(50)
  const { data: myRank } = useMyRank(profile?.id)

  if (isLoading) return <div className="p-8 text-center animate-pulse tracking-widest text-[10px] font-black uppercase text-indigo-500">Memuat Klasemen...</div>

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy className="w-48 h-48" />
         </div>
         <div className="relative z-10 space-y-2">
            <Badge variant="outline" className="text-[10px] font-black border-indigo-500/30 text-indigo-300 uppercase tracking-widest mb-4">Peringkat Global</Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">LEADERBOARD</h1>
            <p className="text-slate-400 font-medium max-w-md mx-auto">Bersainglah dan raih ranking ELO tertinggi di perusahaan.</p>
         </div>
      </div>

      {/* My Rank Highlight */}
      {profile && myRank && (
        <Card className="border-2 border-indigo-500/30 bg-indigo-900/10 shadow-xl overflow-hidden rounded-[2rem]">
          <CardContent className="p-0 flex items-center">
             <div className="bg-indigo-600 text-white w-24 flex flex-col items-center justify-center p-6 self-stretch">
                <p className="text-[10px] font-black tracking-widest uppercase opacity-80">Rank</p>
                <p className="text-4xl font-black">#{myRank}</p>
             </div>
             <div className="p-6 flex-1 flex justify-between items-center">
                <div>
                   <h3 className="text-xl font-bold">{profile.full_name} <span className="text-xs text-indigo-500 ml-2">(KAMU)</span></h3>
                   <div className="flex gap-4 mt-2">
                      <p className="text-sm text-slate-500 font-bold"><span className="text-slate-900">{profile.elo_rating}</span> ELO</p>
                      <p className="text-sm text-slate-500 font-bold"><span className="text-emerald-600">{profile.total_wins}</span> Win</p>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-2 md:gap-6 pt-12 pb-8 px-4">
           {/* Rank 2 */}
           <Podium user={leaderboard[1]} rank={2} height="h-40" bg="bg-slate-300" />
           {/* Rank 1 */}
           <Podium user={leaderboard[0]} rank={1} height="h-48" bg="bg-amber-400" isCenter />
           {/* Rank 3 */}
           <Podium user={leaderboard[2]} rank={3} height="h-32" bg="bg-amber-700" />
        </div>
      )}

      {/* The Rest of the List */}
      <div className="space-y-3 px-2">
         {leaderboard?.slice(3).map((user, index) => {
            const actualRank = index + 4
            const isMe = user.id === profile?.id
            return (
              <div 
                 key={user.id} 
                 className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isMe ? 'bg-indigo-50 border border-indigo-200 shadow-md' : 'bg-white hover:bg-slate-50 border border-slate-100'}`}
              >
                 <div className="w-8 text-center text-slate-400 font-black">
                    {actualRank}
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                    {user.full_name?.charAt(0)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{user.full_name} {isMe && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full ml-2">KAMU</span>}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{user.skill_level}</p>
                 </div>
                 <div className="text-right shrink-0">
                    <p className="text-lg font-black text-indigo-900">{user.elo_rating}</p>
                    <p className="text-[10px] font-bold text-slate-400">Win Rate: {user.total_matches ? Math.round((user.total_wins / user.total_matches) * 100) : 0}%</p>
                 </div>
              </div>
            )
         })}
      </div>
    </div>
  )
}

function Podium({ user, rank, height, bg, isCenter = false }: { user: any, rank: number, height: string, bg: string, isCenter?: boolean }) {
   if (!user) return null
   return (
      <div className="flex flex-col items-center group">
         <div className="relative mb-4">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-xl ${bg} ring-4 ring-white z-10 relative group-hover:-translate-y-2 transition-transform`}>
               {user.full_name?.charAt(0)}
               {isCenter && <Trophy className="absolute -top-6 w-8 h-8 text-amber-500" />}
            </div>
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white border-2 border-white ${bg} z-20 shadow-lg`}>
               {rank}
            </div>
         </div>
         <p className="font-bold text-slate-900 text-center w-24 truncate text-sm">{user.full_name}</p>
         <p className="text-xs text-slate-500 font-bold">{user.elo_rating} ELO</p>
         
         <div className={`w-20 md:w-28 mt-4 rounded-t-xl ${bg} ${height} opacity-80 backdrop-blur flex justify-center pt-4 shadow-inner`} />
      </div>
   )
}

function Badge({ children, className }: any) {
  return <span className={`px-2 py-1 rounded inline-block ${className}`}>{children}</span>
}
