// src/app/(user)/download/page.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Download, CheckCircle2, Globe } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
          SmashGo Mobile
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Nikmati pengalaman booking lapangan bulutangkis yang lebih lancar dan real-time langsung dari smartphone Anda.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Android / iOS App Section */}
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden group hover:border-primary transition-all duration-300">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 text-white">
              <Smartphone size={28} />
            </div>
            <CardTitle className="text-2xl">Native Mobile App</CardTitle>
            <CardDescription>
              Aplikasi Flutter untuk performa maksimal dan notifikasi real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span>Notifikasi push untuk matchmaking</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span>Input skor pertandingan langsung di lapangan</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span>Scan QR Code check-in lebih cepat</span>
              </li>
            </ul>
            <Button className="w-full gap-2 py-6 text-lg font-bold" size="lg">
              <Download size={20} /> Unduh APK (Android)
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Versi 1.0.0 · 24MB · Memerlukan Android 8.0+
            </p>
          </CardContent>
        </Card>

        {/* PWA Section */}
        <Card className="border-2 border-muted shadow-lg overflow-hidden group hover:border-primary/50 transition-all duration-300">
          <CardHeader className="bg-muted/30 pb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 text-white">
              <Globe size={28} />
            </div>
            <CardTitle className="text-2xl">Web App (PWA)</CardTitle>
            <CardDescription>
              Instal aplikasi langsung dari browser tanpa perlu download file.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <p className="font-semibold">Cara Instal:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Buka smashgo.vercel.app di Chrome/Safari</li>
                <li>Tap ikon <strong>Share</strong> atau <strong>Menu (⋮)</strong></li>
                <li>Pilih <strong>Add to Home Screen</strong></li>
              </ol>
            </div>
            <Button variant="outline" className="w-full gap-2 py-6 text-lg" size="lg">
              Buka Web App
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Kompatibel dengan Android, iOS, Windows, dan macOS.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integration Message */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center max-w-2xl mx-auto italic">
        "Platform SmashGo dirancang untuk memenuhi standar kepatuhan sistem audit olahraga perusahaan. Pastikan selalu menggunakan versi terbaru untuk fitur matchmaking yang paling akurat."
      </div>
    </div>
  );
}
