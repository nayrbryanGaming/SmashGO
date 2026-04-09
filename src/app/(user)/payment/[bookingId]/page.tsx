// src/app/(user)/payment/[bookingId]/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { CreditCard, Wallet, Smartphone, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = React.use(params)
  const [booking, setBooking] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchBooking() {
      const { data } = await supabase
        .from('bookings')
        .select('*, courts(name, venues(name))')
        .eq('id', bookingId)
        .single()
      
      if (data) {
        setBooking(data)
      }
      setIsLoading(false)
    }
    fetchBooking()
  }, [params.bookingId, supabase])

  const handlePayment = async () => {
    // Generate Midtrans Token via API
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    })
    const { snapToken } = await res.json()

    if (snapToken) {
       (window as any).snap.pay(snapToken, {
          onSuccess: (result: any) => {
             router.push('/payment/success')
          },
          onPending: (result: any) => {
             console.log('pending', result)
          },
          onError: (result: any) => {
             console.log('error', result)
          }
       })
    }
  }

  if (isLoading) return <div className="p-8 text-center">Memuat detail pembayaran...</div>

  return (
    <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8 max-w-2xl mx-auto">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
      />

      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-bold tracking-tight">Pembayaran</h1>
         <p className="text-muted-foreground">Selesaikan pembayaran untuk mengonfirmasi pesananmu.</p>
      </div>

      <Card className="border-none shadow-xl bg-card">
         <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-lg">Detail Pesanan</CardTitle>
         </CardHeader>
         <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
               <div>
                  <p className="font-bold text-lg">{booking?.courts?.venues?.name}</p>
                  <p className="text-sm text-primary">{booking?.courts?.name}</p>
               </div>
               <div className="text-right">
                  <p className="text-sm text-muted-foreground">{booking?.booking_date}</p>
                  <p className="text-sm font-medium">{booking?.start_time.slice(0, 5)} - {booking?.end_time.slice(0, 5)}</p>
               </div>
            </div>
            
            <div className="pt-4 border-t space-y-2">
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Lapangan</span>
                  <span className="font-medium">Rp {booking?.total_price?.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Layanan</span>
                  <span className="font-medium">Rp 2.000</span>
               </div>
               <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total Bayar</span>
                  <span className="text-primary">Rp {(booking?.total_price + 2000)?.toLocaleString()}</span>
               </div>
            </div>
         </CardContent>
         <CardFooter className="p-6 bg-muted/30 border-t flex flex-col gap-4">
            <div className="w-full space-y-3">
               <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">Metode Tersedia</p>
               <div className="flex justify-center gap-6 opacity-40 grayscale scale-75">
                  <CreditCard className="h-6 w-6" />
                  <Wallet className="h-6 w-6" />
                  <Smartphone className="h-6 w-6" />
               </div>
            </div>
            <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20" onClick={handlePayment}>
               Bayar Sekarang
            </Button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
               <ShieldCheck className="h-3 w-3 text-green-500" /> Aman & Terenkripsi oleh Midtrans
            </div>
         </CardFooter>
      </Card>
    </div>
  )
}
