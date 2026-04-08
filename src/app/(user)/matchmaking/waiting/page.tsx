// src/app/(user)/matchmaking/waiting/page.tsx
'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { WaitingRoom } from '@/components/matchmaking/WaitingRoom'
import { useAuth } from '@/hooks/useAuth'

function WaitingRoomContent() {
  const searchParams = useSearchParams()
  const queueId = searchParams.get('queueId')
  const { profile, loading: authLoading } = useAuth()

  if (authLoading) return <div className="h-64 flex items-center justify-center text-indigo-400 font-black italic animate-pulse">MEMUAT DATA PROFIL...</div>
  if (!queueId) return <div className="h-64 flex items-center justify-center text-rose-500 font-black italic">ERROR: QUEUE ID TIDAK DITEMUKAN</div>

  return (
    <div className="max-w-2xl mx-auto pt-10 pb-24">
      <div className="text-center mb-10 space-y-4">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest italic animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" /> Mencari Lawan Bertanding...
         </div>
         <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">WAITING ROOM</h1>
         <p className="text-slate-400 font-medium">Santai sejenak, sistem sedang mencarikan lawan yang seimbang dengan rating-mu.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
         <WaitingRoom queueId={queueId} userElo={profile?.elo_rating || 1000} />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none pt-1">Tips Pertandingan</p>
            <p className="text-sm font-bold text-slate-300 italic">"Pemanasan adalah kunci performa maksimal dan pencegahan cedera."</p>
         </div>
         <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none pt-1">Threshold Rating</p>
            <p className="text-sm font-bold text-slate-300 italic">"Pencarian akan diperluas ±50 ELO setiap 2 menit jika lawan belum ditemukan."</p>
         </div>
      </div>
    </div>
  )
}

export default function MatchmakingWaitingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-indigo-400 font-black uppercase animate-pulse">Mempersiapkan Antrian...</div>}>
      <WaitingRoomContent />
    </Suspense>
  )
}
