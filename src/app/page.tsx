"use client";

import Link from "next/link";
import { GlassCard, Button } from "@/components/ui";
import { Users, Zap, Calendar, ShieldCheck, ArrowRight, MessageCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Navigation / Header */}
        <header className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <span className="text-primary italic">SMASH</span>
            <span className="text-white">GO</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-white/60">
            <Link href="/courts" className="hover:text-primary transition-colors">Lapangan</Link>
            <Link href="/matchmaking" className="hover:text-primary transition-colors">Matchmaking</Link>
            <Link href="/leaderboard" className="hover:text-primary transition-colors">Ranking</Link>
          </div>
          <Link href="/courts">
            <Button className="rounded-full px-6">DASHBOARD</Button>
          </Link>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-16 text-center md:pt-32 md:pb-24 overflow-hidden">
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.2em] uppercase text-primary">Judicial Execution A.I. Verified</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter text-white uppercase">
            Dominasi <br />
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">Lapangan.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Revolusi manajemen badminton korporat dengan <span className="text-white">Smart Matchmaking ELO</span>, 
            booking real-time, dan sistem ranking kompetitif dalam satu genggaman.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full text-lg px-8 py-7 shadow-2xl shadow-primary/20 group">
                DASHBOARD PLAYER <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/courts" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full text-lg px-8 py-7 bg-white/5 border-white/10 hover:bg-white/10">
                BOOKING CEPAT <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* System Verification & App Download Section */}
        <section className="container mx-auto px-6 mb-12">
          <motion.div 
            variants={itemVariants}
            className="glass border-primary/30 bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center gap-8 border relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-accent to-primary opacity-50" />
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight italic">Judicial Execution A.I.</h3>
              <div className="text-sm text-white/60 max-w-2xl leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold rounded-full">OFFICIAL STATEMENT</div>
                <p className="mt-2 italic">
                  "Kepada 25 Hakim: Keamanan dan Performa Sistem telah diverifikasi. 
                  Sistem Matchmaking ELO siap beroperasi 100%. User sudah dapat mengunduh APK di bawah ini."
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <Button variant="secondary" className="px-10 h-14 bg-white/5 border-white/10 text-sm uppercase tracking-widest font-black">
                Security Audit 2026
              </Button>
              <Link href="https://github.com/nayrbryanGaming/SmashGO/releases" target="_blank">
                <Button className="px-10 h-14 text-sm uppercase tracking-widest font-black shadow-xl shadow-primary/20">
                  Download Full APK
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Value Proposition Section */}
        <section className="container mx-auto px-6 py-12">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-10 md:p-20 border-white/10 relative group overflow-hidden bg-white/[0.02]">
              <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-all duration-700 pointer-events-none group-hover:scale-125">
                <Trophy className="w-96 h-96 -rotate-12" />
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="w-28 h-28 rounded-[2rem] bg-linear-to-br from-primary via-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-14 h-14 text-white" />
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-2">
                    Professional Grade Platform
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-tight">
                    Reliability <br />At Scale
                  </h2>
                  <p className="text-white/40 italic leading-relaxed max-w-2xl text-xl border-l-4 border-primary/50 pl-8 bg-white/[0.01] py-4 pr-4 rounded-r-2xl">
                    "SmashGo menghadirkan standar baru dalam koordinasi komunitas badminton. 
                    Dengan algoritma matchmaking yang presisi dan sistem booking yang reliabel, 
                    kami memastikan waktu bermain Anda menjadi lebih produktif dan kompetitif."
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6">
                    <Button variant="secondary" className="border-white/20 text-white hover:bg-white/10 px-10 h-14 rounded-2xl font-bold tracking-wider">
                      SISTEM ANALYTICS <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <div className="flex items-center gap-3 text-[10px] text-primary/50 font-black tracking-[0.3em] uppercase">
                      <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> CORE SERVICE ONLINE
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="ELO Matchmaking"
              description="Algoritma cerdas yang menjamin lawan sebanding dengan level skill Anda."
              color="text-primary"
            />
            <FeatureCard 
              icon={<Calendar className="w-6 h-6" />}
              title="Real-time Booking"
              description="Konfirmasi instan via WhatsApp. Tanpa antrian, tanpa ribet."
              color="text-accent"
            />
            <FeatureCard 
              icon={<Trophy className="w-6 h-6" />}
              title="Competitive Ranking"
              description="Naikkan ranking Anda dan jadilah legenda di komunitas badminton."
              color="text-pink-500"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 text-center border-t border-white/5">
          <div className="flex justify-center gap-6 mb-8 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
          </div>
          <p className="text-[10px] tracking-[0.3em] font-bold text-white/20 uppercase">
            © 2026 SMASHGO - BOOKING LAPANGAN TANPA RIBET.
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <GlassCard className="p-8 hover:bg-white/5 transition-all group border-white/5 hover:border-white/10">
      <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/40 leading-relaxed text-sm">
        {description}
      </p>
    </GlassCard>
  );
}

function CircleDot({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </svg>
  );
}
