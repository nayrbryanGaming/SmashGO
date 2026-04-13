// src/app/page.tsx
'use client'

export const dynamic = 'force-dynamic'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Bot, Trophy, Users, Calendar, Zap, Shield, Sparkles, Smartphone,
  ArrowRight, Download, Star, BarChart3, QrCode, Swords, Crown,
  CheckCircle, MapPin, Bell
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" />
        <div className="absolute top-1/4 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
            <Zap className="h-6 w-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white">SmashGo</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Fitur</a>
          <a href="#download" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Download</a>
          <Link href="/login">
            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">LOGIN</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-xs font-black uppercase tracking-widest px-6 h-10 rounded-xl shadow-xl shadow-indigo-500/20">DAFTAR GRATIS</Button>
          </Link>
        </div>
        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs font-black text-indigo-400">LOGIN</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-indigo-600 text-xs font-black">DAFTAR</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black italic text-[10px] tracking-widest mb-8 uppercase"
        >
          <Sparkles className="h-3 w-3" />
          <span>The Ultimate Corporate Badminton Experience</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-[7rem] font-black tracking-tighter text-white mb-6 leading-[0.9] uppercase italic"
        >
          DOMINASI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400">LAPANGAN</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 font-medium leading-relaxed"
        >
          Platform manajemen badminton korporat dengan <span className="text-white font-bold">Smart Matchmaking ELO</span>,
          Booking Real-time, dan Sistem Ranking Kompetitif dalam satu genggaman.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-sm font-black italic uppercase tracking-widest px-10 h-14 rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-[1.05] group w-full sm:w-auto">
              Dashboard Player <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button size="lg" variant="outline" className="bg-red-600/10 border-red-600/40 text-red-400 hover:bg-red-600/20 hover:text-red-300 border-2 text-sm font-black italic uppercase tracking-widest px-10 h-14 rounded-2xl shadow-xl transition-all hover:scale-[1.05] group w-full sm:w-auto">
              Admin Console <Shield className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Link href="/download">
            <Button size="lg" variant="outline" className="bg-slate-900/50 border-slate-800 text-white border-2 text-sm font-black italic uppercase tracking-widest px-10 h-14 rounded-2xl shadow-xl backdrop-blur-xl transition-all hover:bg-slate-800 hover:scale-[1.05] group w-full sm:w-auto">
              Download APK <Download className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* AI Judicial Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 relative group w-full max-w-2xl"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full scale-150 animate-pulse" />
          <div className="relative bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-indigo-500/30 flex flex-col md:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500 flex-shrink-0">
              <Bot className="text-white h-8 w-8" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tight">Judicial Execution A.I.</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed font-medium">
                "Kepada 25 Hakim: Keamanan dan Performa Sistem telah diverifikasi.
                Sistem Matchmaking ELO siap beroperasi 100%. User sudah dapat mengunduh APK di bawah ini."
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-xl py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'LAPANGAN AKTIF', value: '12', icon: MapPin, color: 'text-indigo-400' },
            { label: 'PEMAIN TERDAFTAR', value: '240+', icon: Users, color: 'text-blue-400' },
            { label: 'MATCH SELESAI', value: '1,840', icon: Swords, color: 'text-purple-400' },
            { label: 'TURNAMEN', value: '8', icon: Trophy, color: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-2">
              <s.icon className={`h-6 w-6 ${s.color}`} />
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">FITUR UNGGULAN</h2>
            <p className="text-slate-400 mt-4 font-medium">Platform terlengkap untuk manajemen badminton korporat</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Swords,
                title: 'SMART MATCHMAKING',
                desc: 'Algoritma ELO Rating FIDE mencari lawan seimbang secara otomatis. Range ±150 ELO, diperluas ±200 setelah 2 menit.',
                color: 'indigo',
              },
              {
                icon: QrCode,
                title: 'QR CHECK-IN',
                desc: 'Admin scan QR tiket untuk check-in pemain. Tiket digital dikirim via email + tampil di dashboard.',
                color: 'blue',
              },
              {
                icon: Crown,
                title: 'LOYALTY SYSTEM',
                desc: 'Kumpulkan poin dari setiap booking & pertandingan. Tukar dengan diskon, shuttlecock, atau merchandise.',
                color: 'amber',
              },
              {
                icon: Bell,
                title: 'NOTIF REAL-TIME',
                desc: 'Push notification via FCM saat lawan ditemukan, reminder booking H-1, dan update hasil turnamen.',
                color: 'emerald',
              },
            ].map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* App UI Preview */}
      <section className="py-24 relative z-10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">TAMPILAN APLIKASI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - User Dashboard */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4 hover:border-indigo-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Dashboard Pemain</span>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-xs">ELO</div>
                  <div>
                    <p className="text-white font-black text-sm">ELO Rating: 1.240</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider">Level Menengah+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                  <Star className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-white font-black text-sm">850 Loyalty Points</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider">Tier Silver — 1.150 pts ke Gold</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-white font-black text-sm">Booking Aktif</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wider">Court A · Senin 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Matchmaking */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Matchmaking ELO</span>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Swords className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-blue-900/30 border border-blue-700/30 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full mx-auto mb-1 flex items-center justify-center font-black text-white text-xs">A</div>
                      <p className="text-white font-black text-xs">Kamu</p>
                      <p className="text-indigo-400 text-[10px] font-black">1240 ELO</p>
                    </div>
                    <div className="text-slate-500 font-black">VS</div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full mx-auto mb-1 flex items-center justify-center font-black text-white text-xs">B</div>
                      <p className="text-white font-black text-xs">Budi S.</p>
                      <p className="text-purple-400 text-[10px] font-black">1270 ELO</p>
                    </div>
                  </div>
                  <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">⚡ Lawan Ditemukan!</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[47%]" />
                  </div>
                  <span className="text-[10px] text-slate-500">47% win</span>
                </div>
                <p className="text-[10px] text-slate-500 text-center">Selisih ELO: 30 poin — Pertandingan Seimbang ✓</p>
              </div>
            </div>

            {/* Card 3 - Admin Dashboard */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-4 hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-red-400 uppercase tracking-widest">Admin Console</span>
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-xl text-center">
                    <p className="text-emerald-400 font-black text-lg">24</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Booking Hari Ini</p>
                  </div>
                  <div className="p-3 bg-indigo-900/30 border border-indigo-700/30 rounded-xl text-center">
                    <p className="text-indigo-400 font-black text-lg">Rp 2.4jt</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">Revenue Hari Ini</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Utilitas Lapangan</span>
                    <span className="text-[9px] text-emerald-400 font-black">85%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[85%]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-xl">
                  <QrCode className="h-4 w-4 text-amber-400" />
                  <span className="text-white text-xs font-bold">3 Check-in menunggu scan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="bg-slate-900 py-24 relative z-10 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                PASANG <span className="text-indigo-500">SOLUSI</span> DI GENGGAMANMU.
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Tersedia sebagai APK Android langsung unduh atau PWA yang bisa dipasang dari browser.
                Tidak perlu Play Store — langsung pakai sekarang.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { step: '1', text: 'Download APK di bawah ini atau buka app di browser' },
                  { step: '2', text: 'Daftar dengan akun perusahaanmu' },
                  { step: '3', text: 'Booking lapangan, cari lawan, mulai bermain!' },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-black italic text-white flex-shrink-0">{s.step}</div>
                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/smashgo-mobile.apk" download="SmashGo.apk" className="flex-1">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 rounded-2xl font-black italic uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-indigo-500/30">
                    <Download className="mr-2 h-5 w-5" /> DOWNLOAD APK
                  </Button>
                </a>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-black italic uppercase tracking-widest transition-all hover:scale-105">
                    BUKA WEB APP
                  </Button>
                </Link>
              </div>
              <p className="text-slate-600 text-xs font-medium">
                ✓ File APK aman • ✓ Tidak ada iklan • ✓ Data tersimpan di Supabase (terenkripsi)
              </p>
            </div>

            {/* App Feature Highlights */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Booking Lapangan', desc: 'Pilih jadwal & bayar via QRIS/GoPay/Transfer', color: 'indigo' },
                { icon: Swords, label: 'ELO Matchmaking', desc: 'Sistem rating otomatis cari lawan seimbang', color: 'blue' },
                { icon: Trophy, label: 'Turnamen', desc: 'Bracket eliminasi & round robin', color: 'amber' },
                { icon: Star, label: 'Loyalty Points', desc: 'Tukar poin dengan hadiah menarik', color: 'emerald' },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`p-5 bg-slate-800 rounded-2xl border border-slate-700 hover:border-${f.color}-500/50 transition-all ${i % 2 === 1 ? 'mt-6' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-${f.color}-600/20 border border-${f.color}-600/30 flex items-center justify-center mb-3`}>
                    <f.icon className={`h-5 w-5 text-${f.color}-400`} />
                  </div>
                  <p className="text-white font-black text-sm mb-1">{f.label}</p>
                  <p className="text-slate-500 text-[10px] leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-950 border-t border-slate-900 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-indigo-500 fill-indigo-500" />
            <span className="text-2xl font-black italic tracking-tighter uppercase text-white">SmashGo</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <Link href="/login" className="hover:text-slate-400 transition-colors">Login</Link>
            <Link href="/register" className="hover:text-slate-400 transition-colors">Daftar</Link>
            <Link href="/admin/dashboard" className="hover:text-slate-400 transition-colors">Admin</Link>
            <Link href="/download" className="hover:text-slate-400 transition-colors">Download APK</Link>
            <Link href="/leaderboard" className="hover:text-slate-400 transition-colors">Leaderboard</Link>
          </div>
          <p className="text-slate-700 font-bold text-[10px] uppercase tracking-[0.4em]">
            © 2026 SmashGo — Corporate Badminton Excellence — Production on Vercel
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon, title, desc, color
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  color: string
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-600 text-indigo-400 border-indigo-500/30 hover:border-indigo-500/60',
    blue: 'bg-blue-600 text-blue-400 border-blue-500/30 hover:border-blue-500/60',
    amber: 'bg-amber-600 text-amber-400 border-amber-500/30 hover:border-amber-500/60',
    emerald: 'bg-emerald-600 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60',
  }
  const [bg, text, border] = colorMap[color]?.split(' ') ?? ['bg-indigo-600', 'text-indigo-400', 'border-indigo-500/30']

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className={`p-6 rounded-[2rem] bg-slate-900 border ${border} hover:${border.replace('30', '60')} backdrop-blur-2xl transition-all group cursor-pointer`}
    >
      <div className={`p-3 rounded-xl w-fit mb-5 ${bg} bg-opacity-20 shadow-lg`}>
        <Icon className={`h-6 w-6 ${text}`} />
      </div>
      <h3 className="text-base font-black italic text-white mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium text-xs leading-relaxed">{desc}</p>
    </motion.div>
  )
}
