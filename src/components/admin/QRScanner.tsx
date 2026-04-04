'use client'
import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Camera, RefreshCw } from 'lucide-react'

interface QRScannerProps {
  onScan: (data: string) => void
}

export function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setScanning(true)
      }
    } catch (err) {
      setError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setScanning(false)
    }
  }

  useEffect(() => {
    let animationFrameId: number

    const scan = () => {
      if (scanning && videoRef.current && canvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
          canvas.height = video.videoHeight
          canvas.width = video.videoWidth
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          })

          if (code) {
            onScan(code.data)
            stopCamera()
            return
          }
        }
        animationFrameId = requestAnimationFrame(scan)
      }
    }

    if (scanning) {
      animationFrameId = requestAnimationFrame(scan)
    }

    return () => cancelAnimationFrame(animationFrameId)
  }, [scanning, onScan])

  return (
    <Card className="relative overflow-hidden aspect-square max-w-sm mx-auto bg-black flex flex-col items-center justify-center border-2 border-primary/20">
      {scanning ? (
        <>
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
             <div className="w-full h-full border-2 border-primary animate-pulse" />
          </div>
          <Button 
            variant="secondary" 
            className="absolute bottom-4 z-10" 
            onClick={stopCamera}
          >
            Matikan Kamera
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Camera className="h-8 w-8" />
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Klik tombol di bawah untuk mulai memindai QR Tiket user.</p>
          )}
          <Button onClick={startCamera}>
            Mulai Scan QR
          </Button>
        </div>
      )}
    </Card>
  )
}
