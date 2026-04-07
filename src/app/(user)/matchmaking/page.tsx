// src/app/(user)/matchmaking/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Zap, Users, MapPin, Calendar, ArrowRight, Loader2, Info, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ELOBadge } from '@/components/matchmaking/ELOBadge'

export default function MatchmakingPage() {
  const [matchType, setMatchType] = useState<'singles' | 'doubles'>('singles')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleStartSearch = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/matchmaking/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_type: matchType })
      })
      const data = await res.json()

      if (res.ok) {
        toast({ title: 'Antrian Dimulai', description: 'Mencari lawan yang seimbang...' })
        router.push(`/matchmaking/waiting?queueId=${data.queue_id}`)
      } else {
        toast({ title: 'Gagal', description: data.error || 'Terjadi kesalahan', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Gagal terhubung ke server', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col gap-2 pt-4">
         <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl shadow-amber-900/10 mb-2 rotate-3 transform hover:rotate-0 transition-transform">
            <Zap className="h-7 w-7 fill-amber-500" />
         </div>
         <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">SMART MATCHMAKING</h1>
         <p className="text-slate-400 font-medium">Temukan lawan latih tanding yang seimbang berdasarkan ELO Rating-mu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Singles Option */}
               <Card 
                 onClick={() => setMatchType('singles')}
                 className={`cursor-pointer transition-all duration-300 overflow-hidden border-2 relative group ${
                   matchType === 'singles' ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-900/20' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                 }`}
               >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-2xl ${
                       matchType === 'singles' ? 'bg-white text-indigo-600' : 'bg-slate-950 text-slate-600 group-hover:text-indigo-400'
                     }`}>
                        <Users className="h-8 w-8" />
                     </div>
                     <div className="space-y-1">
                        <h3 className={`text-xl font-black italic tracking-tighter uppercase transition-colors ${matchType === 'singles' ? 'text-white' : 'text-slate-300'}`}>1 VS 1</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest leading-none pt-1 ${matchType === 'singles' ? 'text-indigo-100' : 'text-slate-500'}`}>SINGLES MATCH</p>
                     </div>
                     {matchType === 'singles' && <Badge className="absolute top-3 right-3 bg-white text-indigo-600 border-none font-black italic shadow-lg">AKTIF</Badge>}
                  </CardContent>
               </Card>

               {/* Doubles Option */}
               <Card 
                 onClick={() => setMatchType('doubles')}
                 className={`cursor-pointer transition-all duration-300 overflow-hidden border-2 relative group ${
                   matchType === 'doubles' ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-900/20' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                 }`}
               >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-2xl ${
                       matchType === 'doubles' ? 'bg-white text-indigo-600' : 'bg-slate-950 text-slate-600 group-hover:text-indigo-400'
                     }`}>
                        <div className="flex -space-x-4">
                           <Users className="h-8 w-8" />
                           <Users className="h-8 w-8 opacity-50" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <h3 className={`text-xl font-black italic tracking-tighter uppercase transition-colors ${matchType === 'doubles' ? 'text-white' : 'text-slate-300'}`}>2 VS 2</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest leading-none pt-1 ${matchType === 'doubles' ? 'text-indigo-100' : 'text-slate-500'}`}>DOUBLES MATCH</p>
                     </div>
                     {matchType === 'doubles' && <Badge className="absolute top-3 right-3 bg-white text-indigo-600 border-none font-black italic shadow-lg">AKTIF</Badge>}
                  </CardContent>
               </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                  <Info className="h-24 w-24" />
               </div>
               <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Info className="h-4 w-4 text-indigo-400" /> Informasi Pencarian
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6 bg-slate-950/50 space-y-4">
                  <div className="space-y-3">
                     <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400"><Star className="h-4 w-4" /></div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase italic tracking-widest mb-1">Fair Play</p>
                           <p className="text-[10px] text-slate-400 leading-relaxed">Sistem akan memprioritaskan lawan dengan selisih rating maksimal ±150 ELO.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400"><Calendar className="h-4 w-4" /></div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase italic tracking-widest mb-1">Jadwal Flexible</p>
                           <p className="text-[10px] text-slate-400 leading-relaxed">Kamu bisa menentukan preferensi hari dan jam jika sedang tidak ingin langsung bermain.</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="p-4 bg-slate-900 border-t border-slate-800">
                  <Button 
                    onClick={handleStartSearch}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-16 font-black italic tracking-widest text-xs uppercase shadow-xl shadow-indigo-900/40 group transition-all"
                  >
                     {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                        <>CARI LAWAN SEKARANG <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                     )}
                  </Button>
               </CardFooter>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden border-t-4 border-t-amber-500">
               <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">RATING KAMU</CardTitle>
               </CardHeader>
               <CardContent className="flex flex-col items-center py-6 gap-4">
                  <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl shadow-2xl relative group">
                     {/* Temporary Emoji for user */}
                     🔥
                     <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 group-hover:rotate-180 transition-transform duration-1000 border-dashed" />
                  </div>
                  <div className="text-center">
                     <p className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">1,240</p>
                     <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest pt-2">RANK: BEYOND MASTER</p>
                  </div>
               </CardContent>
               <CardFooter className="bg-slate-950 p-4 border-t border-slate-800">
                  <div className="w-full flex justify-between text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                     <span>WIN RATE: 64%</span>
                     <span>MATCHES: 124</span>
                  </div>
               </CardFooter>
            </Card>
         </div>
      </div>
    </div>
  )
}
