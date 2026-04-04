// src/app/(user)/payment/success/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BookingQRTicket } from '@/components/booking/BookingQRTicket'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, ChevronLeft } from 'lucide-react'

export default function PaymentSuccessPage() {
  const [booking, setBooking] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLatestBooking() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('bookings')
          .select('*, courts(name, venues(name))')
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        
        if (data) setBooking(data)
      }
    }
    fetchLatestBooking()
  }, [supabase])

  return (
    <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8 max-w-2xl mx-auto flex flex-col items-center">
      <div className="text-center space-y-4">
         <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 animate-in zoom-in duration-500" />
         </div>
         <h1 className="text-3xl font-bold tracking-tight">Pembayaran Berhasil!</h1>
         <p className="text-muted-foreground">Booking lapangan kamu telah dikonfirmasi.</p>
      </div>

      {booking ? (
        <BookingQRTicket
          bookingId={booking.id}
          qrToken={booking.qr_code || booking.id}
          courtName={booking.courts?.name}
          venueName={booking.courts?.venues?.name}
          date={booking.booking_date}
          time={booking.start_time.slice(0, 5)}
        />
      ) : (
        <div className="h-64 flex items-center justify-center opacity-50">Memuat tiket...</div>
      )}

      <div className="w-full flex flex-col gap-3">
         <Link href="/dashboard" className="w-full">
            <Button className="w-full h-12 font-bold shadow-lg shadow-primary/20">
               Kembali ke Dashboard
            </Button>
         </Link>
         <Link href="/booking" className="w-full">
            <Button variant="outline" className="w-full h-12 font-medium">
               <ChevronLeft className="mr-2 h-4 w-4" /> Pesan Lapangan Lagi
            </Button>
         </Link>
      </div>
    </div>
  )
}
