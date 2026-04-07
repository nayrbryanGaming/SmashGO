'use client'
// src/components/match/MatchResultCard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, TrendingUp, TrendingDown, Swords } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface MatchResultCardProps {
  playerName: string
  isWinner: boolean
  oldElo: number
  newElo: number
  loyaltyPointsEarned?: number
  matchType?: string
}

export function MatchResultCard({ playerName, isWinner, oldElo, newElo, loyaltyPointsEarned = 5, matchType = 'Singles' }: MatchResultCardProps) {
  const eloDiff = newElo - oldElo
  const isPositive = eloDiff >= 0

  return (
    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative">
      <div className={`absolute inset-0 z-0 opacity-20 ${isWinner ? 'bg-gradient-to-br from-amber-500 to-rose-500' : 'bg-slate-500'}`} />
      
      <CardContent className="p-8 relative z-10 flex flex-col items-center text-center space-y-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${isWinner ? 'bg-amber-400 text-white shadow-amber-500/50' : 'bg-slate-200 text-slate-500'}`}>
           {isWinner ? <Trophy className="w-12 h-12" /> : <Swords className="w-12 h-12" />}
        </div>

        <div className="space-y-1">
          <Badge variant="outline" className={`font-black uppercase tracking-widest text-[10px] border-2 ${isWinner ? 'border-amber-400 text-amber-500' : 'border-slate-400 text-slate-500'}`}>
            {isWinner ? 'PEMENANG' : 'PERTANDINGAN SELESAI'}
          </Badge>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter pt-2">{playerName}</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Match {matchType}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
           <div className={`p-4 rounded-3xl ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Perubahan ELO</p>
              <div className={`flex items-center justify-center gap-2 text-3xl font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                 {isPositive ? '+' : ''}{eloDiff}
              </div>
              <p className="text-xs font-bold text-slate-400 mt-1">Sisa {newElo}</p>
           </div>
           <div className="p-4 rounded-3xl bg-indigo-50 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Loyalty Points</p>
              <div className="text-3xl font-black text-indigo-600">
                 +{loyaltyPointsEarned} <span className="text-sm">pts</span>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}
