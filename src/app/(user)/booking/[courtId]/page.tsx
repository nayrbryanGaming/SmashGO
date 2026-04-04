// src/app/(user)/booking/[courtId]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Calendar, Clock, ChevronLeft, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { format, addDays, isSameDay } from 'date-fns'
import { id } from 'date-fns/locale'

export default function CourtBookingPage() {
  const { courtId } = useParams()
  const router = useRouter()
  const [court, setCourt] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Generate slots from 06:00 to 23:00 (1 hour each)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6
    return `${hour.toString().padStart(2, '0')}:00`
  })

  useEffect(() => {
    async function fetchCourtAndBookings() {
      const { data: courtData } = await supabase
        .from('courts')
        .select('*, venues(name, address)')
        .eq('id', courtId)
        .single()
      
      if (courtData) setCourt(courtData)

      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const { data: bookings } = await supabase
        .from('bookings')
        .select('start_time')
        .eq('court_id', courtId)
        .eq('booking_date', dateStr)
        .in('status', ['confirmed', 'pending_payment', 'checked_in'])
      
      if (bookings) setBookedSlots(bookings.map(b => b.start_time.slice(0, 5)))
      setIsLoading(false)
    }
    fetchCourtAndBookings()
  }, [courtId, selectedDate, supabase])

  const handleBooking = () => {
    if (!selectedSlot) return
    // Store in session/state and navigate to confirm
    router.push(`/booking/confirm?courtId=${courtId}&date=${format(selectedDate, 'yyyy-MM-dd')}&time=${selectedSlot}`)
  }

  if (isLoading) return <div className="h-64 flex items-center justify-center text-indigo-400 font-bold uppercase animate-pulse pt-20">Menyiapkan Lapangan...</div>

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-700 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-xl">
         <Button variant="ghost" onClick={() => router.push('/booking')} className="text-slate-400 hover:text-white gap-2 font-bold uppercase tracking-widest text-[10px]">
            <ChevronLeft className="h-4 w-4" /> Kembali ke Venue
         </Button>
         <Badge className="bg-indigo-500/10 text-indigo-400 border-none font-black italic">{court?.venues?.name}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="relative h-64 rounded-3xl overflow-hidden border border-slate-800 group shadow-2xl">
               <img 
                 src={court?.photo_url || `https://images.unsplash.com/photo-1626224580193-41584c316279?q=80&w=2070&auto=format&fit=crop`} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
               <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                  <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">{court?.name}</h1>
                  <p className="text-xs text-slate-400 font-medium">{court?.venues?.address}</p>
               </div>
            </div>

            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
               <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-indigo-400" /> Pilih Tanggal Bermain
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-0 border-t border-slate-800/50">
                  <div className="flex overflow-x-auto p-4 gap-3 no-scrollbar scroll-smooth">
                     {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                        const date = addDays(new Date(), offset)
                        const isSelected = isSameDay(date, selectedDate)
                        return (
                           <button
                             key={offset}
                             onClick={() => setSelectedDate(date)}
                             className={`min-w-[80px] h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
                               isSelected ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                             }`}
                           >
                              <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-60">
                                 {format(date, 'EEE', { locale: id })}
                              </span>
                              <span className="text-lg font-black leading-none">{format(date, 'dd')}</span>
                           </button>
                        )
                     })}
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-4">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-400" /> Slot Waktu Tersedia
               </h3>
               <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => {
                     const isBooked = bookedSlots.includes(time)
                     const isSelected = selectedSlot === time
                     return (
                        <button
                          key={time}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(time)}
                          className={`h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all border ${
                            isBooked 
                              ? 'bg-slate-900 border-slate-800/50 text-slate-700 cursor-not-allowed grayscale' 
                              : isSelected 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-900/40 scale-105' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-indigo-500/50 hover:text-white'
                          }`}
                        >
                           {time}
                        </button>
                     )
                  })}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 shadow-2xl border-t-4 border-t-indigo-500 sticky top-24">
               <CardHeader className="pb-4">
                  <CardTitle className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none pt-2">Ringkasan Reservasi</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-4">
                     <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Jadwal</p>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                           <Calendar className="h-3.5 w-3.5 text-indigo-400" /> {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                        </p>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                           <Clock className="h-3.5 w-3.5 text-indigo-400" /> {selectedSlot || '--:--'} (1 Jam)
                        </p>
                     </div>
                     <div className="h-px bg-slate-800/50" />
                     <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Harga</p>
                           <p className="text-xl font-black text-white italic tracking-tighter">
                              {formatCurrency(court?.price_morning || 0)}
                              <span className="text-[10px] font-normal text-slate-500 not-italic ml-1">/ JAM</span>
                           </p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black uppercase tracking-widest mb-1">PROMO PEGAWAI</Badge>
                     </div>
                  </div>

                  <div className="pt-4 space-y-4">
                     <div className="p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-2">
                        <p className="text-[10px] text-indigo-400 font-bold flex items-center gap-1.5 leading-none">
                           <ShieldCheck className="h-3 w-3" /> JAMINAN SMASHGO
                        </p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Slot dikunci selama 30 menit setelah checkout untuk pembayaran.</p>
                     </div>
                     <Button 
                       onClick={handleBooking}
                       disabled={!selectedSlot}
                       className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 font-black italic tracking-widest text-xs uppercase shadow-xl shadow-indigo-900/20 group"
                     >
                        CHECKOUT SEKARANG <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>
               </CardContent>
               <CardFooter className="bg-slate-950/50 p-4 flex justify-center gap-2 border-t border-slate-800">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">+10 LOYALTY POINTS</p>
               </CardFooter>
            </Card>
         </div>
      </div>
    </div>
  )
}
