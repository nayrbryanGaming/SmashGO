'use client'
// src/components/admin/QRScanner.tsx
import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScanLine, RefreshCcw, Camera } from 'lucide-react'

interface QRScannerProps {
  onScan: (data: string) => void
  isProcessing?: boolean
}

export function QRScanner({ onScan, isProcessing }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    async function setupCamera() {
      if (!isActive) {
        if (stream) stream.getTracks().forEach(t => t.stop())
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute('playsinline', 'true') // iOS required
          videoRef.current.play()
          requestAnimationFrame(tick)
        }
        setHasCamera(true)
        setError(null)
      } catch (err) {
        console.error("Camera access error:", err)
        setError("Kamera tidak dapat diakses. Pastikan izin kamera diberikan.")
        setHasCamera(false)
      }
    }

    setupCamera()

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [isActive])

  function tick() {
    if (!videoRef.current || !canvasRef.current || !isActive) return

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && !isProcessing) {
      const canvas = canvasRef.current
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        })

        if (code) {
          // Detected QR Code
          setIsActive(false) // Pause scanning
          onScan(code.data)
        }
      }
    }

    if (isActive) {
       requestAnimationFrame(tick)
    }
  }

  return (
    <Card className="border-none shadow-2xl bg-slate-900 rounded-[2.5rem] overflow-hidden w-full max-w-sm mx-auto">
      <CardContent className="p-0 relative">
        {!isActive && !isProcessing && (
          <div className="aspect-[3/4] bg-slate-800 flex flex-col items-center justify-center p-8 text-center gap-6">
             <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-indigo-400" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black text-white">SCAN TIKET QR</h3>
                <p className="text-xs text-slate-400 font-medium">Arahkan kamera ke QR code tiket yang ada di HP user untuk check-in lapangan.</p>
             </div>
             <Button
                size="lg"
                onClick={() => setIsActive(true)}
                className="w-full rounded-2xl h-14 bg-indigo-600 hover:bg-indigo-500 font-black text-lg mt-4 shadow-lg shadow-indigo-900/50"
             >
               AKTIFKAN KAMERA
             </Button>
          </div>
        )}

        {isActive && (
          <div className="relative">
            <video ref={videoRef} className="w-full aspect-[3/4] object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay Grid/Frame */}
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/50 z-10">
               <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500" />
               
               {/* Scanning Laser Line */}
               <div className="absolute w-full h-[2px] bg-indigo-500 shadow-[0_0_15px_3px_rgba(99,102,241,0.8)] animate-scan-laser" />
            </div>

            <Button
               variant="outline"
               size="icon"
               className="absolute top-6 right-6 z-20 bg-black/50 border-white/20 text-white rounded-full hover:bg-black/70 h-12 w-12 backdrop-blur-md"
               onClick={() => setIsActive(false)}
            >
               <RefreshCcw className="h-5 w-5" />
            </Button>
            
            <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center">
               <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  <ScanLine className="w-4 h-4 animate-pulse" />
                  Mencari QR Code...
               </div>
            </div>
          </div>
        )}

        {isProcessing && (
           <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center gap-4">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-white font-black tracking-widest text-sm animate-pulse">MEMPROSES TIKET...</p>
           </div>
        )}

        {error && !isActive && (
           <div className="absolute inset-x-8 bottom-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center">
              <p className="text-rose-400 text-xs font-bold">{error}</p>
           </div>
        )}
      </CardContent>
    </Card>
  )
}
