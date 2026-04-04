// src/components/booking/BookingQRTicket.tsx
'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { generateQRCodeImage } from '@/lib/qrcode'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

interface BookingQRTicketProps {
  bookingId: string
  qrToken: string
  courtName: string
  venueName: string
  date: string
  time: string
}

export function BookingQRTicket({ qrToken, courtName, venueName, date, time }: BookingQRTicketProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getQr() {
      try {
        const url = await generateQRCodeImage(qrToken)
        setQrUrl(url)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    getQr()
  }, [qrToken])

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden border-none shadow-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <CardHeader className="text-center border-b border-white/10 pb-6">
        <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
           <span className="text-xl font-bold">🏸</span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">E-Ticket SmashGo</CardTitle>
        <CardDescription className="text-indigo-100 text-xs">Tunjukkan QR ke Admin Lapangan</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6 flex flex-col items-center">
        <div className="bg-white p-3 rounded-2xl shadow-xl w-48 h-48 flex items-center justify-center">
           {isLoading ? (
             <Skeleton className="w-full h-full rounded-lg bg-indigo-50" />
           ) : qrUrl ? (
             <Image src={qrUrl} alt="Booking QR" width={180} height={180} className="rounded-lg" />
           ) : (
             <p className="text-destructive text-[10px]">Error Generating QR</p>
           )}
        </div>

        <div className="w-full space-y-3 pt-4 border-t border-white/10">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-[10px] text-indigo-200 uppercase font-bold">Venue & Lapangan</p>
               <p className="text-sm font-semibold">{venueName}</p>
               <p className="text-xs text-indigo-100">{courtName}</p>
             </div>
             <div className="text-right">
               <p className="text-[10px] text-indigo-200 uppercase font-bold">Waktu</p>
               <p className="text-sm font-semibold">{date}</p>
               <p className="text-xs text-indigo-100">{time}</p>
             </div>
           </div>
        </div>
      </CardContent>
      <div className="bg-indigo-900/50 p-4 text-center">
         <p className="text-[10px] font-mono tracking-wider opacity-60">ID: {qrToken.split('-')[0].toUpperCase()}</p>
      </div>
    </Card>
  )
}
