// src/app/(user)/match/[matchId]/result/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Trophy, CheckCircle2, Loader2 } from 'lucide-react'

export default function MatchResultPage() {
  const { matchId } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  const [scores, setScores] = useState([
    { set: 1, score_a: '', score_b: '' },
    { set: 2, score_a: '', score_b: '' },
    { set: 3, score_a: '', score_b: '' },
  ])

  const handleScoreChange = (setIndex: number, player: 'a' | 'b', value: string) => {
    const newScores = [...scores]
    if (player === 'a') newScores[setIndex].score_a = value
    else newScores[setIndex].score_b = value
    setScores(newScores)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      // Basic validation
      const validScores = scores.filter(s => s.score_a !== '' && s.score_b !== '')
      if (validScores.length < 2) {
        throw new Error('Minimal masukkan skor untuk 2 set.')
      }

      // Calculate winner (this should also be done server-side for security)
      let winsA = 0
      let winsB = 0
      validScores.forEach(s => {
        if (parseInt(s.score_a) > parseInt(s.score_b)) winsA++
        else winsB++
      })

      const { data: match } = await supabase.from('matches').select('*').eq('id', matchId).single()
      const winnerId = winsA > winsB ? match.player_a_id : match.player_b_id

      const { error } = await supabase
        .from('matches')
        .update({
          status: 'completed',
          scores: validScores,
          winner_id: winnerId,
          completed_at: new Date().toISOString()
        })
        .eq('id', matchId)

      if (error) throw error

      // ELO updates normally handled via Supabase Function or API hook updateEloAfterMatch
      // For now, we manually trigger or assume the hook will handle it
      await fetch(`/api/matches/score`, {
        method: 'POST',
        body: JSON.stringify({ matchId })
      })

      toast({ title: 'Berhasil', description: 'Skor pertandingan telah diinput.' })
      router.push(`/match/${matchId}`)
    } catch (err: any) {
      toast({ title: 'Gagal', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 pb-24">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Input Hasil</h1>
        <p className="text-slate-500 font-medium">Masukkan skor tiap set untuk update ELO Rating.</p>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-900 text-white p-8">
           <CardTitle className="text-center font-black italic uppercase tracking-widest text-sm opacity-60">Papan Skor Pertandingan</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           {scores.map((set, i) => (
             <div key={i} className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400">Player A</Label>
                   <Input 
                      type="number" 
                      placeholder="0" 
                      value={set.score_a} 
                      onChange={(e) => handleScoreChange(i, 'a', e.target.value)}
                      className="h-14 rounded-2xl text-center text-xl font-black bg-indigo-50 border-none focus-visible:ring-indigo-500"
                   />
                </div>
                <div className="text-2xl font-black text-slate-300 italic">VS</div>
                <div className="flex-1 space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400">Player B</Label>
                   <Input 
                      type="number" 
                      placeholder="0" 
                      value={set.score_b} 
                      onChange={(e) => handleScoreChange(i, 'b', e.target.value)}
                      className="h-14 rounded-2xl text-center text-xl font-black bg-slate-100 border-none focus-visible:ring-slate-900"
                   />
                </div>
             </div>
           ))}

           <Button 
             onClick={handleSubmit} 
             disabled={loading}
             className="w-full h-16 rounded-3xl bg-indigo-600 hover:bg-slate-900 text-lg font-black italic uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all"
           >
             {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
               <><CheckCircle2 className="mr-2 h-6 w-6" /> SELESAIKAN PERTANDINGAN</>
             )}
           </Button>
        </CardContent>
      </Card>
    </div>
  )
}
