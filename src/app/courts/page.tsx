"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Court } from "@/types";
import { GlassCard, Button } from "@/components/ui";
import { Navigation, MapPin, Clock, CircleDot, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourts() {
      const { data, error } = await supabase
        .from("courts")
        .select("*")
        .eq("status", "active");

      if (data) setCourts(data);
      setLoading(false);
    }
    fetchCourts();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">PILIH <span className="text-primary italic">LAPANGAN</span></h1>
          <p className="text-white/40 text-lg">Temukan arena terbaik untuk performa maksimal Anda.</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} className="h-[400px] animate-pulse bg-white/5 border-white/5">
                <></>
              </GlassCard>
            ))}
          </div>
        ) : courts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard className="text-center py-32 border-dashed border-white/10">
              <CircleDot className="w-20 h-20 text-white/5 mx-auto mb-8 animate-pulse" />
              <h2 className="text-2xl font-bold mb-3">Belum Ada Lapangan Aktif</h2>
              <p className="text-white/30 max-w-sm mx-auto">Kami sedang memproses ketersediaan lapangan baru untuk Anda.</p>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courts.map((court) => (
              <motion.div key={court.id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                <Link href={`/courts/${court.id}`}>
                  <GlassCard className="group relative h-full flex flex-col p-8 transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.03]">
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <div className="bg-primary p-2 rounded-xl shadow-2xl shadow-primary/40">
                        <ChevronRight className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="space-y-8 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Navigation className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black group-hover:text-primary transition-colors tracking-tight">{court.name}</h3>
                          <p className="text-xs font-bold text-white/30 flex items-center gap-2 mt-1 uppercase tracking-widest">
                            <MapPin className="w-3 h-3 text-primary" /> Lokasi Terverifikasi
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Operasional</span>
                          <span className="text-sm font-bold flex items-center gap-2 text-white/70">
                            <Clock className="w-4 h-4 text-primary" /> {court.open_time} - {court.close_time}
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Investasi / Jam</span>
                          <span className="text-sm font-black text-accent">
                            Rp {court.price_per_hour.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 mt-auto">
                        <Button className="w-full h-14 text-sm font-black uppercase tracking-widest group-hover:shadow-xl shadow-primary/20">
                          PILIH JADWAL <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
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
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
