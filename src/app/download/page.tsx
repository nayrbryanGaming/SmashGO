// src/app/download/page.tsx
'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Download, Smartphone } from 'lucide-react'
import Image from 'next/image'

export default function DownloadPage() {
  const apkUrl = '/app-release.apk' // This matches the expected location in public/

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-4 transform rotate-12">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">SmashGo Mobile</h1>
          <p className="text-slate-500 font-medium">Bawa SmashGo kemana saja dalam genggamanmu.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
            <CardTitle className="text-2xl font-bold">Download APK</CardTitle>
            <CardDescription className="text-slate-400">Versi Terbaru v1.0.0 (Production)</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4 text-left">
              {[
                'Booking lapangan lebih cepat',
                'Notifikasi Matchmaking real-time',
                'Live Score di pinggir lapangan',
                'Tukar poin dengan merchandise',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              asChild
              className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              <a href={apkUrl} download>
                <Download className="mr-2 h-5 w-5" /> Install SmashGo Sekarang
              </a>
            </Button>
            
            <p className="text-[10px] text-slate-400">
              *Pastikan "Unknown Sources" diizinkan di pengaturan Android Anda.
            </p>
          </CardContent>
        </Card>

        <p className="text-slate-400 text-sm font-medium">
          Dibuat dengan ❤️ oleh Tim SmashGo
        </p>
      </div>
    </div>
  )
}
