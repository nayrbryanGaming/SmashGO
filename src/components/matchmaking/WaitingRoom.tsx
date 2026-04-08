'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Users, Timer, XCircle, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface WaitingRoomProps {
  queueId: string
  userElo?: number
}

export function WaitingRoom({ queueId, userElo }: WaitingRoomProps) {
  const [status, setStatus] = useState<'searching' | 'matched' | 'confirmed' | 'cancelled' | 'expired'>('searching')
  const [opponent, setOpponent] = useState<any>(null)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // 1. Subscribe to Realtime update for this queue entry
    const channel = supabase
      .channel(`queue-${queueId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matchmaking_queue',
          filter: `id=eq.${queueId}`
        },
        (payload) => {
          const newData = payload.new as any
          setStatus(newData.status)
          if (newData.status === 'matched') {
            setMatchId(newData.match_id)
            fetchOpponentData(newData.matched_with)
          }
        }
      )
      .subscribe()

    // 2. Timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [queueId])

  const fetchOpponentData = async (opponentId: string) => {
    const { data } = await supabase
      .from('users')
      .select('full_name, avatar_url, elo_rating')
      .eq('id', opponentId)
      .single()
    setOpponent(data)
    toast({
      title: 'Lawan Ditemukan!',
      description: `Kamu akan bertanding melawan ${data?.full_name}`,
    })
  }

  const handleCancel = async () => {
    const { error } = await supabase
      .from('matchmaking_queue')
      .update({ status: 'cancelled' })
      .eq('id', queueId)
    
    if (!error) {
      router.push('/matchmaking')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse" />
        
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-indigo-600/10">
            {status === 'searching' ? (
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-black italic tracking-tighter uppercase">
            {status === 'searching' ? 'MENCARI LAWAN...' : 'LAWAN DITEMUKAN!'}
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium">
            {status === 'searching' 
              ? 'Sistem sedang mencarikan lawan yang seimbang untukmu.' 
              : 'Harap konfirmasi pertandinganmu segera.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="flex justify-around items-center py-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Waktu Tunggu</p>
              <p className="text-xl font-mono font-bold text-indigo-400 flex items-center justify-center gap-2">
                <Timer className="h-4 w-4" /> {formatTime(timer)}
              </p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pemain Aktif</p>
              <p className="text-xl font-mono font-bold text-indigo-400 flex items-center justify-center gap-2">
                <Users className="h-4 w-4" /> 24
              </p>
            </div>
          </div>

          {status === 'matched' && opponent && (
            <div className="animate-in fade-in zoom-in duration-500">
               <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-600/20 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-xl uppercase">
                     {opponent.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">{opponent.full_name}</p>
                    <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase">ELO: {opponent.elo_rating}</p>
                  </div>
               </div>
               <Button 
                onClick={() => router.push(`/match/${matchId}`)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 font-black italic uppercase italic tracking-widest py-6"
               >
                 MASUK KE PERTANDINGAN
               </Button>
            </div>
          )}

          {status === 'searching' && (
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              className="w-full bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white font-bold h-12"
            >
              BATALKAN PENCARIAN
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Tips Pro SmashGo</p>
         <p className="text-xs text-slate-400 max-w-xs mx-auto italic">"Fokus pada footwork dan penempatan bola daripada sekadar power smash."</p>
      </div>
    </div>
  )
}
