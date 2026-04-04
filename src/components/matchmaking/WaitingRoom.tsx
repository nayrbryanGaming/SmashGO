// src/components/matchmaking/WaitingRoom.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, XCircle, ShieldCheck, Timer } from 'lucide-react'

interface WaitingRoomProps {
  queueId: string
  userElo: number
}

export function WaitingRoom({ queueId, userElo }: WaitingRoomProps) {
  const supabase = createClient()
  const router = useRouter()
  const [waitTime, setWaitTime] = useState(0)
  const [threshold, setThreshold] = useState(150)
  const [status, setStatus] = useState<'searching' | 'matched' | 'expired' | 'cancelled'>('searching')
  const [matchId, setMatchId] = useState<string | null>(null)

  useEffect(() => {
    // Timer: hitung lama menunggu
    const timer = setInterval(() => setWaitTime(t => t + 1), 1000)

    // Subscribe ke Supabase Realtime
    const channel = supabase
      .channel(`queue:${queueId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matchmaking_queue',
          filter: `id=eq.${queueId}`
        },
        (payload) => {
          const newRow = payload.new as any
          
          if (newRow.current_elo_threshold !== threshold) {
            setThreshold(newRow.current_elo_threshold)
          }
          
          if (newRow.status === 'matched') {
            setStatus('matched')
            setMatchId(newRow.match_id)
            // Redirect ke halaman konfirmasi match
            setTimeout(() => router.push(`/match/${newRow.match_id}`), 1500)
          }
          
          if (newRow.status === 'expired') setStatus('expired')
          if (newRow.status === 'cancelled') setStatus('cancelled')
        }
      )
      .subscribe()

    // Backup Polling
    const pollInterval = setInterval(async () => {
      const { data } = await supabase
        .from('matchmaking_queue')
        .select('status, match_id, current_elo_threshold')
        .eq('id', queueId)
        .single()

      if (data?.status === 'matched' && data.match_id) {
        clearInterval(pollInterval)
        router.push(`/match/${data.match_id}`)
      }
    }, 5000)

    return () => {
      clearInterval(timer)
      clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [queueId, router, threshold, supabase])

  const formatWaitTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const cancelSearch = async () => {
    const res = await fetch('/api/matchmaking/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queue_id: queueId })
    })
    if (res.ok) router.push('/matchmaking')
  }

  if (status === 'matched') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-emerald-200 animate-bounce">
          🎉
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Lawan Ditemukan!</h2>
          <p className="text-slate-500 font-medium italic">Mempersiapkan lapangan untukmu...</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
           <Loader2 className="h-4 w-4 animate-spin" /> Redirecting...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-8 max-w-lg mx-auto overflow-hidden">
      {/* Visual Animation */}
      <div className="relative w-48 h-48 flex items-center justify-center">
         <div className="absolute inset-0 border-[3px] border-indigo-600/10 rounded-full animate-[ping_3s_linear_infinite]" />
         <div className="absolute inset-4 border-[3px] border-indigo-600/20 rounded-full animate-[ping_2s_linear_infinite]" />
         <div className="absolute inset-8 border-[3px] border-indigo-600/30 rounded-full animate-[ping_1.5s_linear_infinite]" />
         <div className="w-24 h-24 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-200 flex items-center justify-center z-10 rotate-12 animate-pulse">
            <span className="text-4xl">🏸</span>
         </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mencari Lawan Seimbang...</h2>
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold tracking-widest text-sm uppercase">
          <Timer className="h-4 w-4" /> {formatWaitTime(waitTime)}
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">ELO Kamu</span>
            <Badge className="bg-indigo-600 text-white font-black px-4 py-1 rounded-full text-lg shadow-lg shadow-indigo-100">{userElo}</Badge>
          </div>
          
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Rentang Pencarian</span>
                <span className="font-black text-slate-900">{userElo - threshold} – {userElo + threshold}</span>
             </div>
             
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000 w-[60%] animate-pulse" />
             </div>
             
             <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-2xl border border-amber-100">
                <ShieldCheck className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-[10px] text-amber-800 font-bold leading-tight uppercase tracking-tight">
                  Sistem akan otomatis memperluas jangkauan ELO setiap 2 menit agar kamu cepat mendapatkan lawan.
                </p>
             </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={cancelSearch} 
          className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black tracking-widest text-xs h-12 rounded-2xl uppercase transition-all flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" /> Batalkan Antrian
        </Button>
      </div>
    </div>
  )
}
