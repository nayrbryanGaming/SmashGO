'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Download, Smartphone, Globe, ArrowLeft, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-20">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors gap-2 font-black uppercase text-[10px] tracking-widest">
              <ArrowLeft className="h-4 w-4" /> KEMBALI
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-indigo-500 fill-indigo-500" />
            <span className="text-xl font-black italic tracking-tighter uppercase">SmashGo</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-6 leading-none"
          >
            UNDUH <span className="text-indigo-500">APLIKASI.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg font-medium max-w-2xl mx-auto"
          >
            Pilih metode akses tercepat untuk mendominasi lapangan. 
            Tersedia dalam format APK Native untuk Android dan PWA untuk semua perangkat.
          </motion.p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {/* Native APK Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative p-10 rounded-[3rem] bg-slate-900/50 border border-slate-800 backdrop-blur-3xl hover:border-indigo-500/50 transition-all"
          >
            <div className="mb-8 p-4 bg-indigo-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Smartphone className="h-10 w-10 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tight">Android Native APK</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 uppercase tracking-wider">
              Peforma maksimal, Push Notification Real-time, dan akses kamera untuk scan QR Tiket.
            </p>
            <ul className="space-y-4 mb-10">
               <li className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" /> Judicial Certified Build
               </li>
               <li className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" /> No Background Usage
               </li>
            </ul>
            <a href="/smashgo.apk" download>
              <Button className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 gap-3">
                <Download className="h-5 w-5" /> DOWNLOAD APK (V1.0)
              </Button>
            </a>
          </motion.div>

          {/* PWA Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative p-10 rounded-[3rem] bg-slate-950 border border-slate-900 backdrop-blur-3xl hover:border-blue-500/50 transition-all shadow-2xl"
          >
            <div className="mb-8 p-4 bg-blue-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Globe className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tight">PWA (Web Install)</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 uppercase tracking-wider">
              Instalasi instan tanpa memori besar. Kompatibel dengan iPhone (iOS), Android, dan Desktop.
            </p>
            <ul className="space-y-4 mb-10">
               <li className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" /> Auto-Update via Browser
               </li>
               <li className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" /> Offline Mode Ready
               </li>
            </ul>
            <Link href="/" className="w-full block">
              <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-800 hover:bg-slate-900 text-sm font-black uppercase tracking-[0.2em] gap-3">
                BUKA & "ADD TO HOME SCREEN"
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Installation Steps */}
        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Smartphone className="h-64 w-64 rotate-12" />
           </div>
           <h3 className="text-2xl font-black italic uppercase mb-12 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-indigo-500" /> Panduan Instalasi APK
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="space-y-4">
                 <div className="text-4xl font-black text-indigo-500 opacity-30 italic">01</div>
                 <h4 className="font-black uppercase tracking-widest text-sm">Download File</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Unduh file smashgo.apk dari tombol di atas langsung ke perangkat Android Anda.</p>
              </div>
              <div className="space-y-4">
                 <div className="text-4xl font-black text-indigo-500 opacity-30 italic">02</div>
                 <h4 className="font-black uppercase tracking-widest text-sm">Izinkan Sumber</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Buka menu pengaturan dan izinkan "Install from Unknown Sources" untuk browser Anda.</p>
              </div>
              <div className="space-y-4">
                 <div className="text-4xl font-black text-indigo-500 opacity-30 italic">03</div>
                 <h4 className="font-black uppercase tracking-widest text-sm">Instal & Main</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Klik file yang sudah diunduh, pilih instal, dan SmashGo siap digunakan untuk dominasi lapangan.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
