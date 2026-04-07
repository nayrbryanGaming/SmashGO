// src/app/(admin)/admin/checkin/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { QRScanner } from '@/components/admin/QRScanner'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function CheckinPage() {
  const [scanResult, setScanResult] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleScan = async (data: string) => {
    setIsProcessing(true)
    setError(null)
    setScanResult(null)

    try {
      // In real scenario, the QR data string would be the `qr_code` from bookings table or an encrypted token.
      const res = await fetch('/api/bookings/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_code: data })
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Check-in gagal. QR tidak valid.')
      }

      setScanResult(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">CHECK-IN LAPANGAN</h1>
        <p className="text-slate-500 font-medium">Scan QR Code user untuk memvalidasi booking</p>
      </div>

      {!scanResult && !error && (
        <QRScanner onScan={handleScan} isProcessing={isProcessing} />
      )}

      {scanResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
             <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <div>
             <h2 className="text-2xl font-black text-emerald-900">Validasi Berhasil!</h2>
             <p className="font-bold text-emerald-700 mt-2">{scanResult.booking?.users?.full_name}</p>
             <p className="text-sm text-emerald-600 font-medium">{scanResult.booking?.courts?.name}</p>
          </div>
          <Button 
            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black"
            onClick={() => setScanResult(null)}
          >
            SCAN BERIKUTNYA
          </Button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-[2rem] p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
             <XCircle className="h-10 w-10 text-white" />
          </div>
          <div>
             <h2 className="text-2xl font-black text-rose-900">Check-in Gagal</h2>
             <p className="text-sm font-bold text-rose-700 mt-2">{error}</p>
          </div>
          <Button 
            className="w-full h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black"
            onClick={() => setError(null)}
          >
            COBA LAGI
          </Button>
        </div>
      )}
    </div>
  )
}
