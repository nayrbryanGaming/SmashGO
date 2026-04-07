'use client'
// src/components/match/ScoreBoard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

interface Player {
  id: string
  full_name: string
  avatar_url?: string
  elo_rating: number
}

interface ScoreBoardProps {
  playerA: Player
  playerB: Player
  currentSet: number
  scores: { set: number; score_a: number; score_b: number }[]
  winnerId?: string
}

export function ScoreBoard({ playerA, playerB, currentSet, scores, winnerId }: ScoreBoardProps) {
  // Aggregate sets won
  let setsWonA = 0
  let setsWonB = 0
  
  scores.forEach((s) => {
    // Assuming a set is won when score reaches 21 (and difference >= 2), just basic calculation for display
    if (s.score_a > s.score_b && s.score_a >= 21) setsWonA++
    if (s.score_b > s.score_a && s.score_b >= 21) setsWonB++
  })

  // Current active set
  const activeScore = scores.find(s => s.set === currentSet) || { score_a: 0, score_b: 0 }

  return (
    <Card className="border-none shadow-2xl bg-slate-900 rounded-[2rem] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-emerald-900/50 z-0 opacity-50" />
      <CardContent className="p-8 relative z-10">
        <div className="flex justify-between items-center text-center">
          
          {/* Player A */}
          <div className="flex-1 space-y-4">
            <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-indigo-900/50 relative">
              {playerA.full_name?.charAt(0)}
              {winnerId === playerA.id && (
                <div className="absolute -top-3 -right-3 p-1.5 bg-amber-500 rounded-full text-white animate-bounce shadow-lg">
                  <Trophy className="h-5 w-5" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{playerA.full_name}</h3>
              <p className="text-xs font-bold text-indigo-400">ELO {playerA.elo_rating}</p>
            </div>
            <div className="text-6xl font-black text-white">{activeScore.score_a}</div>
            <div className="flex justify-center gap-1 text-slate-400 font-bold text-sm">
               Sets: <span className="text-white ml-2">{setsWonA}</span>
            </div>
          </div>

          {/* VS Divider */}
          <div className="px-6 flex flex-col items-center gap-4 text-slate-500">
            <div className="text-xs font-black tracking-widest bg-slate-800 px-3 py-1 rounded-full uppercase">Set {currentSet}</div>
            <div className="text-3xl font-black italic">VS</div>
          </div>

          {/* Player B */}
          <div className="flex-1 space-y-4">
            <div className="mx-auto w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-emerald-900/50 relative">
              {playerB.full_name?.charAt(0)}
              {winnerId === playerB.id && (
                <div className="absolute -top-3 -left-3 p-1.5 bg-amber-500 rounded-full text-white animate-bounce shadow-lg">
                  <Trophy className="h-5 w-5" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{playerB.full_name}</h3>
              <p className="text-xs font-bold text-emerald-400">ELO {playerB.elo_rating}</p>
            </div>
            <div className="text-6xl font-black text-white">{activeScore.score_b}</div>
            <div className="flex justify-center gap-1 text-slate-400 font-bold text-sm">
               Sets: <span className="text-white ml-2">{setsWonB}</span>
            </div>
          </div>

        </div>

        {/* History Sets */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center gap-6">
          {scores.map((setObj) => (
             <div key={setObj.set} className={`flex flex-col items-center gap-1 ${setObj.set === currentSet ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">S{setObj.set}</span>
                <div className="bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold text-sm text-white">
                   <span className={setObj.score_a > setObj.score_b ? 'text-indigo-400' : ''}>{setObj.score_a}</span>
                   <span className="text-slate-600">-</span>
                   <span className={setObj.score_b > setObj.score_a ? 'text-emerald-400' : ''}>{setObj.score_b}</span>
                </div>
             </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
