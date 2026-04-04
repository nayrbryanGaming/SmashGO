// src/app/(user)/booking/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { MapPin, Calendar, Users, ArrowRight, Star, Clock, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UserBookingPage() {
  const [venues, setVenues] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchVenues() {
      const { data } = await supabase
        .from('venues')
        .select('*, courts(id, status)')
        .eq('is_active', true)
      
      if (data) setVenues(data)
      setIsLoading(false)
    }
    fetchVenues()
  }, [supabase])

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col gap-2 pt-4">
         <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-900/10 mb-2">
            <MapPin className="h-6 w-6" />
         </div>
         <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">PILIH VENUE PERUSAHAAN</h1>
         <p className="text-slate-400 font-medium">Temukan lokasi lapangan terdekat untuk jadwal bermainmu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 animate-pulse h-64" />
          ))
        ) : venues.length > 0 ? (
          venues.map((v) => (
            <Card key={v.id} className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 flex flex-col">
               <div className="h-48 relative bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                  <img 
                    src={`https://images.unsplash.com/photo-1626224580193-41584c316279?q=80&w=2070&auto=format&fit=crop`} 
                    alt={v.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute top-4 left-4 z-20">
                     <Badge className="bg-emerald-500 text-white font-black border-none px-3 py-1 text-[10px] italic shadow-lg">BUKA 24/7</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1">
                     <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{v.name}</h2>
                     <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium"><MapPin className="h-3 w-3 text-indigo-400" /> {v.city}</p>
                  </div>
               </div>
               
               <CardContent className="p-6 flex-1 space-y-6">
                  <div className="flex justify-between items-center py-3 border-y border-slate-800/50">
                     <div className="flex flex-col gap-0.5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Total Lapangan</p>
                        <p className="text-lg font-black text-white pt-1">{v.courts?.length || 0} <span className="text-[10px] text-indigo-400 font-bold italic">UNIT</span></p>
                     </div>
                     <div className="w-[1px] h-8 bg-slate-800" />
                     <div className="flex flex-col gap-0.5 text-right">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Jam Operasional</p>
                        <p className="text-sm font-bold text-slate-300 pt-1">{v.open_time.slice(0,5)} - {v.close_time.slice(0,5)}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                           <Clock className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-medium text-slate-400 leading-tight">Parkir Luas & Gratis untuk Pegawai</p>
                     </div>
                     <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                           <Info className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-medium text-slate-400 leading-tight">Fasilitas KM/WC & Dispenser</p>
                     </div>
                  </div>
               </CardContent>

               <CardFooter className="p-4 bg-slate-950/50 border-t border-slate-800 group-hover:bg-slate-900 transition-colors">
                  <Link href={`/booking/venue/${v.id}`} className="w-full">
                     <Button className="w-full bg-slate-800 hover:bg-indigo-600 font-black italic tracking-widest text-xs uppercase group-hover:shadow-xl group-hover:shadow-indigo-900/20 transition-all">
                        LIHAT LAPANGAN <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </Link>
               </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-3xl text-slate-700">
             <MapPin className="h-12 w-12 opacity-20" />
             <p className="font-bold uppercase tracking-widest text-xs">Belum Ada Venue Aktif</p>
          </div>
        )}
      </div>
    </div>
  )
}
