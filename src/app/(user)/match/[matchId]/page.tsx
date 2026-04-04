// src/app/(user)/match/[matchId]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { ScoreBoard } from '@/components/match/ScoreBoard'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ELOBadge } from '@/components/matchmaking/ELOBadge'

export default async function MatchPage({ params }: { params: { matchId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: match } = await supabase
    .from('matches')
    .select('*, player_a:users!matches_player_a_id_fkey(*), player_b:users!matches_player_b_id_fkey(*)')
    .eq('id', params.matchId)
    .single()

  if (!match) return <div className="p-8 text-center">Match tidak ditemukan.</div>

  return (
    <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
         <h1 className="text-3xl font-bold tracking-tight">Live Score</h1>
         <p className="text-muted-foreground">Pertandingan {match.match_type.replace('_', ' ')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
         {/* Detail Pemain A */}
         <Card className="border-none shadow-lg bg-card/50">
            <CardHeader className="text-center pb-2">
               <CardTitle className="text-lg">{match.player_a?.full_name}</CardTitle>
               <ELOBadge elo={match.player_a_elo_before} className="justify-center" />
            </CardHeader>
         </Card>
         
         {/* Detail Pemain B */}
         <Card className="border-none shadow-lg bg-card/50">
            <CardHeader className="text-center pb-2">
               <CardTitle className="text-lg">{match.player_b?.full_name}</CardTitle>
               <ELOBadge elo={match.player_b_elo_before} className="justify-center" />
            </CardHeader>
         </Card>
      </div>

      <Card className="border-none shadow-2xl bg-card overflow-hidden">
         <ScoreBoard 
           matchId={match.id}
           playerAName={match.player_a?.full_name}
           playerBName={match.player_b?.full_name}
           currentUserId={user.id}
           playerAId={match.player_a_id}
         />
      </Card>
    </div>
  )
}
