// src/app/(admin)/admin/checkin/page.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { QrCode, Camera, XCircle, CheckCircle2, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import jsQR from 'jsqr'
import { validateBookingQR } from '@/lib/qrcode'

export default function AdminCheckinPage() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null) // { success: boolean, message: string, bookingId?: string }
  const [loading, setLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = createClient()

  const startScan = async () => {
    setScanning(true)
    setResult(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true') // help iOS
        videoRef.current.play()
        requestAnimationFrame(tick)
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      setResult({ success: false, message: 'Akses kamera ditolak. Berikan izin di pengaturan browser.' })
      setScanning(false)
    }
  }

  const stopScan = () => {
    setScanning(false)
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
    }
  }

  const tick = () => {
    if (videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA && canvasRef.current && scanning) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.height = video.videoHeight
      canvas.width = video.videoWidth
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        })

        if (code) {
          processQR(code.data)
          return // Stop further frames
        }
      }
    }
    if (scanning) requestAnimationFrame(tick)
  }

  const processQR = async (data: string) => {
    stopScan()
    setLoading(true)
    
    // 1. Validasi format QR via lib
    const valid = validateBookingQR(data)
    if (!valid.isValid) {
      setResult({ success: false, message: valid.message })
      setLoading(false)
      return
    }

    // 2. Kirim ke API internal untuk verifikasi status di DB (checked in atau belum)
    try {
      const { data: { user: adminUser } } = await supabase.auth.getUser()
      const { data: booking, error: fetchErr } = await supabase
        .from('bookings')
        .select('*, users(full_name), courts(name)')
        .eq('id', valid.bookingId)
        .eq('qr_code', data)
        .single()

      if (fetchErr || !booking) {
        setResult({ success: false, message: 'Tiket tidak ditemukan di database.' })
      } else if (booking.status === 'checked_in' || booking.status === 'completed') {
        setResult({ success: false, message: `Oops! Tiket ini sudah di-scan pada ${new Date(booking.checked_in_at).toLocaleTimeString()}.` })
      } else if (booking.status !== 'confirmed') {
        setResult({ success: false, message: `Status tiket: ${booking.status.toUpperCase()}. Belum bisa check-in.` })
      } else {
        // 3. Update status ke checked_in
        const { error: updateErr } = await supabase
          .from('bookings')
          .update({
            status: 'checked_in',
            checked_in_at: new Date().toISOString(),
            checked_in_by: adminUser?.id
          })
          .eq('id', booking.id)

        if (updateErr) throw updateErr
        setResult({ 
          success: true, 
          message: `Check-in BERHASIL untuk ${booking.users.full_name}`,
          details: `Lapangan: ${booking.courts.name} | Jam: ${booking.start_time.slice(0,5)}`
        })
      }
    } catch (err) {
      console.error('Check-in error:', err)
      setResult({ success: false, message: 'Gagal memproses check-in. Periksa koneksi internet.' })
    }
    setLoading(false)
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-12 w-12 hover:bg-slate-100 transition-all">
            <ArrowLeft className="h-6 w-6 text-slate-900" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">SCAN QR TIKET</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Validasi Kedatangan Pemain SmashGo</p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden relative min-h-[400px] flex flex-col items-center justify-center">
           {!scanning && !result && !loading && (
             <div className="p-8 text-center space-y-6 flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100 mb-2">
                   <QrCode className="h-12 w-12" />
                </div>
                <div className="space-y-1">
                   <h2 className="text-2xl font-black text-slate-900">SIAP SCAN?</h2>
                   <p className="text-sm text-slate-500 font-medium">Arahkan kamera ke QR Code aplikasi SmashGo di HP pemain.</p>
                </div>
                <Button 
                  onClick={startScan} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black text-lg transition-transform active:scale-95 shadow-xl shadow-indigo-100"
                >
                  AKTIFKAN KAMERA
                </Button>
             </div>
           )}

           {scanning && (
             <div className="w-full h-full p-6 space-y-4 animate-in fade-in">
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl">
                   <video ref={videoRef} className="w-full h-full object-cover" />
                   <canvas ref={canvasRef} className="hidden" />
                   {/* HUD Overlay */}
                   <div className="absolute inset-4 border-2 border-indigo-500/50 rounded-2xl animate-pulse">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-indigo-600 rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-indigo-600 rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-indigo-600 rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-indigo-600 rounded-br-xl" />
                   </div>
                </div>
                <Button 
                   variant="ghost" 
                   onClick={stopScan} 
                   className="w-full font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-12"
                >
                   BATALKAN SCAN
                </Button>
             </div>
           )}

           {loading && (
             <div className="flex flex-col items-center gap-4 py-20 text-indigo-600 animate-in zoom-in">
                <Loader2 className="h-16 w-16 animate-spin stroke-[3px]" />
                <p className="font-black uppercase tracking-widest text-sm">MEMPROSES DATA...</p>
             </div>
           )}

           {result && (
             <div className="p-8 text-center space-y-6 flex flex-col items-center animate-in zoom-in duration-500">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl ${result.success ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'} text-white`}>
                   {result.success ? <CheckCircle2 className="h-16 w-16" /> : <ShieldAlert className="h-16 w-16" />}
                </div>
                <div className="space-y-1">
                   <h2 className={`text-3xl font-black ${result.success ? 'text-emerald-600' : 'text-rose-600'} leading-tight`}>{result.success ? 'BERHASIL!' : 'GAGAL!'}</h2>
                   <p className="text-slate-600 font-bold px-4">{result.message}</p>
                   {result.details && <p className="text-xs text-slate-400 font-medium uppercase mt-2">{result.details}</p>}
                </div>
                <Button 
                   onClick={() => setResult(null)} 
                   variant="outline"
                   className="w-full border-slate-200 hover:bg-slate-50 h-14 rounded-2xl font-black text-md shadow-sm"
                >
                  SCAN LAGI
                </Button>
             </div>
           )}
        </Card>

        {/* Security Warning */}
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4">
           <ShieldAlert className="h-8 w-8 text-amber-600 shrink-0" />
           <div className="space-y-1">
              <p className="font-black text-amber-900 text-xs uppercase tracking-tight">Perhatian Admin</p>
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                 Hanya scan QR Ticket asli dari aplikasi SmashGo. Pastikan nama pemain di aplikasi cocok dengan identitas fisik. Satu QR Code hanya berlaku untuk satu kali check-in.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
