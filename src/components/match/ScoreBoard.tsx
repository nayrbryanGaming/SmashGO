// src/components/match/ScoreBoard.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Users, Wifi, WifiOff, RotateCcw, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ScoreBoardProps {
  matchId: string
  playerAName: string
  playerBName: string
  currentUserId: string
  playerAId: string
  playerBId: string
}

interface SetScore { set: number; score_a: number; score_b: number }

export function ScoreBoard({ matchId, playerAName, playerBName, currentUserId, playerAId, playerBId }: ScoreBoardProps) {
  const supabase = createClient()
  const isPlayerA = currentUserId === playerAId
  const isPlayerB = currentUserId === playerBId
  const canUpdate = isPlayerA || isPlayerB

  const [scores, setScores] = useState<SetScore[]>([])
  const [currentSet, setCurrentSet] = useState(1)
  const [isOnline, setIsOnline] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load initial score and subscribe
  useEffect(() => {
    async function loadInitial() {
      const { data } = await supabase.from('matches').select('scores').eq('id', matchId).single()
      if (data?.scores) {
        setScores(data.scores as SetScore[])
        setCurrentSet(data.scores.length || 1)
      }
    }
    loadInitial()

    const channel = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes', {
        event: 'UPDATE', 
        schema: 'public', 
        table: 'matches', 
        filter: `id=eq.${matchId}`
      }, (payload) => {
        const newScores = (payload.new as any).scores || []
        setScores(newScores)
        setCurrentSet(newScores.length || 1)
      })
      .subscribe((status) => {
        setIsOnline(status === 'SUBSCRIBED')
      })

    return () => { supabase.removeChannel(channel) }
  }, [matchId, supabase])

  const updateScoreOnServer = async (newScores: SetScore[]) => {
    setSaving(true)
    const res = await fetch(`/api/matches/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match_id: matchId, scores: newScores })
    })
    setSaving(false)
    return res.ok
  }

  const addPoint = async (scoringPlayer: 'A' | 'B') => {
    if (!canUpdate) return

    const currentSetScore = scores.find(s => s.set === currentSet) || { set: currentSet, score_a: 0, score_b: 0 }
    const newScores = [...scores.filter(s => s.set !== currentSet)]
    
    newScores.push({
      ...currentSetScore,
      score_a: scoringPlayer === 'A' ? currentSetScore.score_a + 1 : currentSetScore.score_a,
      score_b: scoringPlayer === 'B' ? currentSetScore.score_b + 1 : currentSetScore.score_b,
    })
    
    newScores.sort((a, b) => a.set - b.set)
    setScores(newScores) // Optimistic UI
    await updateScoreOnServer(newScores)
  }

  const nextSet = async () => {
    if (!canUpdate) return
    const newSetNum = currentSet + 1
    const newScores = [...scores, { set: newSetNum, score_a: 0, score_b: 0 }]
    setScores(newScores)
    setCurrentSet(newSetNum)
    await updateScoreOnServer(newScores)
  }

  const currentSetScore = scores.find(s => s.set === currentSet) || { score_a: 0, score_b: 0 }
  
  // Hitung jumlah set yang dimenangkan
  const setsA = scores.filter(s => s.score_a > s.score_b).length
  const setsB = scores.filter(s => s.score_b > s.score_a).length

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-rose-500" />}
          <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isOnline ? 'Live Connection' : 'Offline'}
          </span>
        </div>
        {saving && (
           <Badge className="bg-indigo-600 animate-pulse text-[10px] font-black uppercase tracking-widest">
             <Save className="h-3 w-3 mr-1" /> Syncing...
           </Badge>
        )}
      </div>

      <Card className="border-none shadow-2xl bg-indigo-950 text-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          {/* Header Match Info */}
          <div className="bg-white/5 p-6 flex justify-between items-center border-b border-white/10">
             <div className="flex flex-col items-start">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pemain A</span>
                <span className="text-xl font-black truncate max-w-[120px]">{playerAName}</span>
             </div>
             <div className="flex flex-col items-center">
                <Badge variant="outline" className="text-white border-white/20 font-black text-lg px-4 py-1 rounded-full">
                  {setsA} : {setsB}
                </Badge>
                <span className="text-[10px] font-bold text-indigo-300/60 mt-1 uppercase tracking-tighter">Set Stats</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pemain B</span>
                <span className="text-xl font-black truncate max-w-[120px]">{playerBName}</span>
             </div>
          </div>

          {/* Main Score Area */}
          <div className="p-10 flex flex-col items-center gap-6">
             <div className="flex items-center justify-center gap-10">
                <div className="flex flex-col items-center gap-4">
                   <div className={`text-8xl font-black tabular-nums tracking-tighter transition-all duration-300 ${isPlayerA ? 'scale-110 text-white' : 'text-white/40'}`}>
                      {currentSetScore.score_a}
                   </div>
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                </div>
                
                <div className="text-4xl font-black text-indigo-500 opacity-50">:</div>

                <div className="flex flex-col items-center gap-4">
                   <div className={`text-8xl font-black tabular-nums tracking-tighter transition-all duration-300 ${isPlayerB ? 'scale-110 text-white' : 'text-white/40'}`}>
                      {currentSetScore.score_b}
                   </div>
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
             </div>

             <div className="bg-indigo-600/20 px-8 py-2 rounded-full border border-indigo-500/30">
                <span className="text-sm font-black italic tracking-widest text-indigo-300">SET {currentSet}</span>
             </div>
          </div>

          {/* History Sets */}
          {scores.length > 1 && (
            <div className="bg-black/20 p-4 flex gap-4 justify-center items-center border-t border-white/5">
               {scores.map(s => (
                 <div key={s.set} className={`flex flex-col items-center px-3 py-1 rounded-xl border ${s.set === currentSet ? 'bg-indigo-600 border-indigo-400' : 'bg-transparent border-white/10 opacity-30'}`}>
                    <span className="text-[10px] font-black">{s.score_a}-{s.score_b}</span>
                 </div>
               ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Control Buttons */}
      {canUpdate && (
        <div className="grid gap-4">
           <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-24 rounded-3xl bg-white text-indigo-900 hover:bg-slate-50 border-none shadow-xl transition-all active:scale-95 group overflow-hidden relative"
                onClick={() => addPoint('A')}
              >
                <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><Trophy className="h-10 w-10" /></div>
                <div className="flex flex-col items-center z-10">
                   <span className="text-xs font-black uppercase mb-1">{playerAName}</span>
                   <span className="text-3xl font-black">+1 POIN</span>
                </div>
              </Button>
              <Button 
                className="h-24 rounded-3xl bg-white text-indigo-900 hover:bg-slate-50 border-none shadow-xl transition-all active:scale-95 group overflow-hidden relative"
                onClick={() => addPoint('B')}
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform"><Trophy className="h-10 w-10" /></div>
                <div className="flex flex-col items-center z-10">
                   <span className="text-xs font-black uppercase mb-1">{playerBName}</span>
                   <span className="text-3xl font-black">+1 POIN</span>
                </div>
              </Button>
           </div>
           
           <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 h-16 rounded-2xl border-indigo-200 text-indigo-600 font-black tracking-widest hover:bg-indigo-50"
                onClick={nextSet}
              >
                MASUK KE SET BERIKUTNYA
              </Button>
              <Button 
                variant="ghost" 
                className="h-16 w-16 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                onClick={() => { if(confirm('Reset skor set ini?')) setScores(scores.map(s => s.set === currentSet ? {...s, score_a: 0, score_b: 0} : s)) }}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
           </div>
        </div>
      )}

      {!canUpdate && (
        <div className="p-6 bg-slate-900/5 rounded-3xl border border-slate-900/10 text-center animate-pulse">
           <p className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Users className="h-4 w-4" /> Kamu Sedang Menonton Mode Live Spectator
           </p>
        </div>
      )}
    </div>
  )
}
