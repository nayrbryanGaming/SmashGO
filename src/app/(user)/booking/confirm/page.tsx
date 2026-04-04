// src/app/(user)/booking/confirm/page.tsx
'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { ShoppingCart, ShoppingBag, Plus, Minus, CreditCard, ChevronLeft, MapPin, Calendar, Clock, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

function BookingConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const courtId = searchParams.get('courtId')
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  const [court, setCourt] = useState<any>(null)
  const [inventory, setInventory] = useState<any[]>([])
  const [preorder, setPreorder] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!courtId) return
    async function fetchData() {
      const { data: courtData } = await supabase
        .from('courts')
        .select('*, venues(id, name)')
        .eq('id', courtId)
        .single()
      
      if (courtData) {
        setCourt(courtData)
        const { data: items } = await supabase
          .from('inventory')
          .select('*')
          .eq('venue_id', courtData.venues.id)
          .eq('is_active', true)
        
        if (items) setInventory(items)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [courtId, supabase])

  const updateQty = (id: string, delta: number) => {
    setPreorder(prev => {
      const current = prev[id] || 0
      const next = Math.max(0, current + delta)
      return { ...prev, [id]: next }
    })
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    try {
      // 1. Create Booking
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          court_id: courtId,
          booking_date: date,
          start_time: time,
          end_time: `${(parseInt(time!.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
          duration_hours: 1,
          total_price: court.price_morning, // Simplifying logic for demo
          status: 'pending_payment'
        })
        .select()
        .single()

      if (bookingErr) throw bookingErr

      // 2. Create Preorders if any
      const preorderItems = inventory
        .filter(item => preorder[item.id] > 0)
        .map(item => ({
          item_id: item.id,
          name: item.name,
          qty: preorder[item.id],
          price: item.price_per_unit
        }))

      if (preorderItems.length > 0) {
        const totalPreorder = preorderItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0)
        await supabase.from('preorders').insert({
          booking_id: booking.id,
          user_id: user.id,
          items: preorderItems,
          total_price: totalPreorder,
          status: 'pending'
        })
      }

      toast({ title: 'Booking Berhasil', description: 'Silakan lakukan pembayaran.' })
      router.push(`/payment/${booking.id}`)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPreorderPrice = inventory.reduce((acc, item) => acc + (item.price_per_unit * (preorder[item.id] || 0)), 0)
  const grandTotal = (court?.price_morning || 0) + totalPreorderPrice

  if (isLoading) return <div className="h-64 flex items-center justify-center text-indigo-400 font-black uppercase animate-pulse pt-20">Memproses Data...</div>

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-700 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-xl">
         <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white gap-2 font-bold uppercase text-[10px] tracking-widest">
            <ChevronLeft className="h-4 w-4" /> Kembali
         </Button>
         <CardTitle className="text-white text-lg font-black italic tracking-tighter uppercase">KONFIRMASI BOOKING</CardTitle>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden group">
               <CardHeader className="bg-indigo-600 p-6 flex flex-row items-center justify-between">
                  <div>
                     <CardTitle className="text-xl text-white font-black italic uppercase tracking-tighter leading-none mb-1">{court?.name}</CardTitle>
                     <CardDescription className="text-indigo-100 font-medium text-[10px] uppercase tracking-widest leading-none pt-2">{court?.venues?.name}</CardDescription>
                  </div>
                  <Badge className="bg-white/20 text-white font-black border-none px-3 py-1 text-[10px] uppercase italic tracking-widest shadow-lg">PEGAWAI</Badge>
               </CardHeader>
               <CardContent className="p-6 grid grid-cols-2 gap-6 bg-slate-900">
                  <div className="flex flex-col gap-1 hover:translate-x-1 transition-transform">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Tanggal</p>
                     <p className="text-sm font-bold text-white flex items-center gap-2"><Calendar className="h-4 w-4 text-indigo-400" /> {date}</p>
                  </div>
                  <div className="flex flex-col gap-1 hover:translate-x-1 transition-transform">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pukul</p>
                     <p className="text-sm font-bold text-white flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-400" /> {time} (1 Jam)</p>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-white italic tracking-widest uppercase flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-indigo-400" /> Pre-order Alat & Minuman
                  </h3>
                  <Badge variant="outline" className="text-slate-500 border-slate-800 text-[9px] uppercase font-bold tracking-widest">Opsional</Badge>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inventory.map((item) => (
                    <Card key={item.id} className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden hover:border-indigo-500/50 transition-colors">
                       <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-indigo-500 shadow-xl">
                             <ShoppingCart className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                             <p className="text-sm font-bold text-white leading-tight uppercase italic">{item.name}</p>
                             <p className="text-xs font-black text-indigo-400 pt-1 italic tracking-tighter">{formatCurrency(item.price_per_unit)}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                             <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-rose-500 text-slate-500 transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                             <span className="text-sm font-black text-white tabular-nums min-w-[12px] text-center">{preorder[item.id] || 0}</span>
                             <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-indigo-400 text-slate-500 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                       </CardContent>
                    </Card>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 shadow-2xl border-t-4 border-t-emerald-500 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                  <CreditCard className="h-24 w-24" />
               </div>
               <CardHeader className="pb-4">
                  <CardTitle className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none pt-2">Estimasi Pembayaran</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-3">
                     <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-widest italic">Sewa Lapangan</span>
                        <span className="text-white font-bold">{formatCurrency(court?.price_morning || 0)}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-widest italic">Total Pre-order</span>
                        <span className="text-white font-bold">{formatCurrency(totalPreorderPrice)}</span>
                     </div>
                     <div className="h-px bg-slate-800/50 mt-4" />
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none pt-1">Grand Total</span>
                        <span className="text-2xl font-black text-white italic tracking-tighter">{formatCurrency(grandTotal)}</span>
                     </div>
                  </div>
                  
                  <div className="pt-4">
                     <Button 
                       onClick={handleConfirm}
                       disabled={isSubmitting}
                       className="w-full bg-indigo-600 hover:bg-indigo-700 h-16 font-black italic tracking-widest text-xs uppercase shadow-xl shadow-indigo-900/40 group transition-all"
                     >
                        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                           <>LANJUT KE PEMBAYARAN <CreditCard className="h-4 w-4 ml-2 group-hover:rotate-12 transition-transform" /></>
                        )}
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-indigo-400 font-black uppercase animate-pulse">Memuat Transaksi...</div>}>
      <BookingConfirmContent />
    </Suspense>
  )
}
