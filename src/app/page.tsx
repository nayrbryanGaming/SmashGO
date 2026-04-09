// src/app/page.tsx
'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Bot, Trophy, Users, Calendar, Zap, Shield, Sparkles, Smartphone, ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3">
             <Zap className="h-6 w-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white">SmashGo</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
           <a href="#features" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Fitur</a>
           <Link href="/download" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Download</Link>
           <Link href="/login">
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">LOGIN</Button>
           </Link>
           <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-xs font-black uppercase tracking-widest px-6 h-10 rounded-xl shadow-xl shadow-indigo-500/20">MULAI BERMAIN</Button>
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
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
          className="text-6xl md:text-[7rem] font-black tracking-tighter text-white mb-6 leading-[0.9] uppercase italic"
        >
          DOMINASI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400">LAPANGAN</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 font-medium leading-relaxed"
        >
          Revolusi manajemen badminton korporat dengan <span className="text-white font-bold">Smart Matchmaking ELO</span>, 
          Booking Real-time, dan Sistem Ranking Kompetitif dalam satu genggaman.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-6 w-full md:w-auto"
        >
          <Link href="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-sm font-black italic uppercase tracking-widest px-12 h-16 rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-[1.05] group">
              Dashboard Player <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/download">
            <Button size="lg" variant="outline" className="bg-slate-900/50 border-slate-800 text-white border-2 text-sm font-black italic uppercase tracking-widest px-12 h-16 rounded-2xl shadow-xl backdrop-blur-xl transition-all hover:bg-slate-800 hover:scale-[1.05] group">
              Download Full APK <Download className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, scale: 1,
            y: [0, -15, 0]
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.5 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mt-32 relative group"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full scale-150 animate-pulse" />
          <div className="relative bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-slate-800/50 flex flex-col md:flex-row items-center gap-8 max-w-2xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Bot className="text-white h-10 w-10 animate-bounce" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-black italic text-white uppercase tracking-tight">SmashGo A.I. Butler</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed font-medium">
                "Hai Juara! Saya sudah menyiapkan lawan seimbang untuk kamu hari ini. 
                Siap memenangkan 10 poin loyalitas pertamamu?"
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FeatureCard icon={Trophy} title="SMART MATCHMAKING" color="indigo" />
              <FeatureCard icon={Shield} title="PAYMENT SECURE" color="blue" />
              <FeatureCard icon={Sparkles} title="LOYALTY SYSTEM" color="emerald" />
              <FeatureCard icon={Smartphone} title="NATIVE EXPERIENCE" color="purple" />
           </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="bg-slate-900 py-32 relative z-10 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
             <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                   PASANG <span className="text-indigo-500">SOLUSI</span> DI GENGGAMANMU.
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                   Dapatkan pengalaman bermain terbaik dengan aplikasi mobile SmashGo (PWA). 
                   Tanpa instalasi ribet, langsung di layar utamamu.
                </p>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-black italic text-white">1</div>
                      <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Chrome/Safari: "ADD TO HOME SCREEN"</p>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-black italic text-white">2</div>
                      <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Login & Sync: SEMUA DATA TERHUBUNG</p>
                   </div>
                </div>
                <Button className="w-full md:w-auto bg-white text-slate-950 hover:bg-indigo-500 hover:text-white h-16 px-12 rounded-2xl font-black italic uppercase tracking-widest transition-all">
                   Dapatkan Link APK (Email)
                </Button>
             </div>
             <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />
                {/* Mockup Placeholder */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="h-64 bg-slate-800 rounded-[2rem] border border-slate-700 shadow-2xl" />
                   <div className="h-64 bg-slate-800 rounded-[2rem] border border-slate-700 shadow-2xl mt-8" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-950 border-t border-slate-900 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
             <Zap className="h-8 w-8 text-indigo-500 fill-indigo-500" />
             <span className="text-2xl font-black italic tracking-tighter uppercase text-white">SmashGo</span>
           </div>
           <p className="text-slate-600 font-bold text-[10px] uppercase tracking-[0.4em]">
             © 2026 SmashGo — Corporate Badminton Excellence — Vercel Production Environment
           </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-500 shadow-indigo-900/20 text-indigo-500",
    blue: "bg-blue-500 shadow-blue-900/20 text-blue-500",
    emerald: "bg-emerald-500 shadow-emerald-900/20 text-emerald-500",
    purple: "bg-purple-500 shadow-purple-900/20 text-purple-500",
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800/50 backdrop-blur-2xl hover:border-indigo-500/50 transition-all group cursor-pointer"
    >
      <div className={cn("p-4 rounded-2xl w-fit mb-8 shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity", colorMap[color].split(" ")[0])}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-black italic text-white mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium text-xs leading-relaxed uppercase tracking-widest">PRO GRADE SYSTEM</p>
    </motion.div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(" ")
}
