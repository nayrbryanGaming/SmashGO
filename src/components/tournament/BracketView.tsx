'use client'
// src/components/tournament/BracketView.tsx
import { Fragment } from 'react'
import { Card } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

interface MatchParticipant {
  id: string
  name: string
  score?: number
  isWinner?: boolean
}

interface MatchNode {
  id: string
  name?: string
  nextMatchId: string | null
  tournamentRoundText: string
  startTime: string
  state: 'DONE' | 'NO_PARTY' | 'WALK_OVER' | 'IN_PLAY' | 'SCHEDULED'
  participants: MatchParticipant[]
}

interface BracketViewProps {
  matches: MatchNode[]
}

// Simple layout just for demonstration of an elimination bracket
export function BracketView({ matches }: BracketViewProps) {
  // A robust tree-view layout would require a library like react-tournament-bracket.
  // For standard presentation without extra heavy deps, we do a simple linear flow or grouped column flow here.
  const rounds = Array.from(new Set(matches.map(m => m.tournamentRoundText)))

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="flex gap-8 min-w-max p-4">
        {rounds.map((roundName, roundIndex) => {
          const roundMatches = matches.filter(m => m.tournamentRoundText === roundName)
          
          return (
            <div key={roundName} className="flex flex-col gap-8 justify-around" style={{ minWidth: 280 }}>
              <h3 className="text-center font-black text-slate-800 uppercase tracking-widest text-sm mb-4">
                 {roundName}
              </h3>
              
              <div className="flex flex-col gap-6 h-full justify-around">
                {roundMatches.map(match => (
                  <Card key={match.id} className="border-none shadow-xl bg-white rounded-2xl overflow-hidden relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                    
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs">
                       <span className="font-bold text-slate-400">{match.id}</span>
                       <span className={`font-bold ${match.state === 'IN_PLAY' ? 'text-amber-500 animate-pulse' : 'text-slate-500'}`}>
                          {match.state}
                       </span>
                    </div>

                    <div className="p-0">
                      {match.participants.map((p, i) => (
                        <Fragment key={p.id || `empty-${i}`}>
                          <div className={`p-4 flex justify-between items-center transition-colors ${p.isWinner ? 'bg-indigo-50/50' : ''}`}>
                            <div className="flex items-center gap-3">
                               <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${p.isWinner ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                  {p.isWinner ? <Trophy className="w-3 h-3" /> : (i + 1)}
                               </div>
                               <span className={`font-bold ${p.isWinner ? 'text-indigo-900' : 'text-slate-700'}`}>
                                 {p.name || 'TBD'}
                               </span>
                            </div>
                            <span className="font-black text-lg text-slate-900">{p.score ?? '-'}</span>
                          </div>
                          {i === 0 && <div className="h-px bg-slate-100 w-full" />}
                        </Fragment>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
