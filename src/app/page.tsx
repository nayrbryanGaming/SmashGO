'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Bot, Trophy, Users, Calendar, Zap, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-200/20 blur-[100px] rounded-full"
        />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-bold text-sm mb-8"
        >
          <Zap className="h-4 w-4 fill-indigo-600" />
          <span>SMART BADMINTON PLATFORM</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-6 leading-none"
        >
          MAINKAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">POTENSIMU</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-slate-600 max-w-2xl mb-12 font-medium"
        >
          Platform manajemen lapangan bulu tangkis korporat dengan Smart Matchmaking ELO, 
          Sistem Loyalitas, dan Dashboard Admin Real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
        >
          <Link href="/dashboard">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg font-bold px-12 h-16 rounded-2xl shadow-2xl shadow-indigo-200 transition-all hover:scale-[1.03]">
              Mulai Sekarang
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="bg-white border-slate-200 text-lg font-bold px-12 h-16 rounded-2xl shadow-sm transition-all hover:bg-slate-50 hover:scale-[1.03]">
              Dashboard Admin
            </Button>
          </Link>
        </motion.div>

        {/* Mascot Character Integration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, scale: 1,
            y: [0, -10, 0]
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.8 },
            scale: { duration: 1, delay: 0.8 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full scale-150 animate-pulse" />
          <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 flex items-center gap-6 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="text-white h-8 w-8" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 leading-tight">Halo! Saya SmashGo Bot.</p>
              <p className="text-sm text-slate-500 mt-1">Siap membantu mencarikan lawan seimbang hari ini.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section className="bg-white py-32 relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
               whileHover={{ y: -10 }}
               className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all"
            >
              <div className="p-4 bg-indigo-600 text-white rounded-2xl w-fit mb-6 shadow-lg shadow-indigo-100">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Smart Matchmaking</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Algoritma ELO kelas dunia untuk memasangkan pemain dengan skill yang seimbang secara otomatis.
              </p>
            </motion.div>

            <motion.div 
               whileHover={{ y: -10 }}
               className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all"
            >
              <div className="p-4 bg-blue-600 text-white rounded-2xl w-fit mb-6 shadow-lg shadow-blue-100">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Pembayaran Aman</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Integrasi Midtrans untuk pembayaran QRIS dan Bank Transfer yang instan dan terverifikasi otomatis.
              </p>
            </motion.div>

            <motion.div 
               whileHover={{ y: -10 }}
               className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all"
            >
              <div className="p-4 bg-emerald-600 text-white rounded-2xl w-fit mb-6 shadow-lg shadow-emerald-100">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Sistem Loyalitas</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Dapatkan poin di setiap pertandingan dan tukarkan dengan hadiah atau diskon booking lapangan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-100 text-center relative z-10">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          © 2026 SmashGo — Corporate Badminton Excellence
        </p>
      </footer>
    </div>
  )
}
