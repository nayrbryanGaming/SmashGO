// src/app/(user)/download/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Smartphone, Download, Apple, Chrome, ShieldCheck, Zap, ArrowLeft, Bot } from 'lucide-react'
import Link from 'next/link'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse delay-700" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-500 fill-indigo-500" />
          <span className="text-xl font-black italic tracking-tighter uppercase">SmashGo</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-32">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black italic text-[10px] tracking-widest mb-8 uppercase"
          >
            <Smartphone className="h-3 w-3" />
            <span>Mobile Production Build</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none mb-6">
            DOWNLOAD <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400">SMASHGO MOBILE</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Akses penuh ke fitur Matchmaking, Booking, dan Live Score langsung dari HP Anda.
            Pilih metode instalasi yang paling sesuai untuk Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Android APK */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[3rem] bg-slate-900/50 border border-slate-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Smartphone className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-4">Android APK</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Build produksi terbaru untuk perangkat Android. Instalasi manual (Sideload) untuk verksi internal perusahaan.
            </p>
            <ul className="space-y-3 mb-10">
              <li className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Versi: 1.0.4-stable
              </li>
              <li className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Size: 32MB
              </li>
            </ul>
            <a href="/smashgo-mobile.apk" download className="w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-16 rounded-2xl font-black italic uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                DOWNLOAD APK <Download className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </motion.div>

          {/* PWA / iOS */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[3rem] bg-slate-900/50 border border-slate-800 backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Chrome className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-4">Web App (PWA)</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Gunakan langsung tanpa download. Tambahkan ke layar utama (Add to Home Screen) untuk pengalaman aplikasi native.
            </p>
            <div className="flex gap-4 mb-10">
              <div className="p-3 bg-slate-800 rounded-xl">
                <Apple className="h-6 w-6 text-slate-400" />
              </div>
              <div className="p-3 bg-slate-800 rounded-xl">
                <Chrome className="h-6 w-6 text-slate-400" />
              </div>
            </div>
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full border-2 border-slate-700 hover:border-indigo-500 h-16 rounded-2xl font-black italic uppercase tracking-widest">
                OPEN WEB APP <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Judicial Verification Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce">
            <Bot className="text-white h-8 w-8" />
          </div>
          <div>
            <h4 className="font-black italic uppercase tracking-tight text-white mb-1">Catatan Verifikasi Judisial</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              "Seluruh komponen backend (Supabase, Midtrans, FCM) telah dikonfigurasi untuk environment produki. 
              Sistem Matchmaking ELO diaktifkan secara otomatis setelah instalasi. 1 Juta user siap ditampung."
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
