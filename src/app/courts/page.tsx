"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Court } from "@/types";
import { GlassCard, Button } from "@/components/ui";
import { MapPin, Clock, ArrowLeft, Trophy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";

import { CONFIG } from "@/lib/config";

export default function CourtsPage() {
  const { t } = useLanguage();
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourts() {
      if (CONFIG.IS_OFFLINE_ONLY) {
        // Mock data for offline mode
        const mockCourts: Court[] = [
          {
            id: "court_1",
            name: "Grand Smash Arena",
            open_time: "08:00",
            close_time: "22:00",
            price_per_hour: 150000,
            status: "active",
            admin_phone: CONFIG.WHATSAPP_ADMIN,
            created_at: new Date().toISOString()
          },
          {
            id: "court_2",
            name: "Pro Shuttle Court",
            open_time: "06:00",
            close_time: "23:00",
            price_per_hour: 120000,
            status: "active",
            admin_phone: CONFIG.WHATSAPP_ADMIN,
            created_at: new Date().toISOString()
          }
        ];
        setCourts(mockCourts);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("courts")
        .select("*")
        .eq("status", "active");
      
      if (!error && data) {
        setCourts(data as Court[]);
      }
      setLoading(false);
    }
    fetchCourts();
  }, []);


  if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-primary">{t.common.loading}</div>;

  return (
    <div className="min-h-screen py-10 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.common.back}
        </Link>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
          {t.courts.title} <span className="text-primary">{t.courts.title_accent}</span>
        </h1>
        <p className="text-white/70 text-lg md:text-xl font-bold mt-4">{t.courts.subtitle}</p>
      </div>

      {courts.length === 0 ? (
        <GlassCard className="p-20 text-center border-white/5 bg-white/[0.01]">
          <Trophy className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h3 className="text-xl font-black uppercase text-white/40">{t.courts.no_active}</h3>
          <p className="text-white/20 font-medium mt-2">{t.courts.no_active_desc}</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court) => (
            <GlassCard key={court.id} className="group hover:bg-white/5 transition-all border-white/10 flex flex-col">
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                <div className="absolute bottom-4 left-6">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-[8px] font-black uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                     {t.courts.operational}
                   </div>
                </div>
              </div>
              <div className="p-8 space-y-6 flex-grow flex flex-col">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-white group-hover:text-primary transition-colors">{court.name}</h3>
                  <p className="text-white/40 flex items-center gap-1 font-bold uppercase text-[10px] tracking-widest mt-1">
                    <MapPin className="w-3 h-3" /> {t.courts.location_verified}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[8px] uppercase font-black tracking-widest text-white/30 block mb-1">{t.courts.investment}</span>
                    <span className="text-sm font-black text-white">{formatCurrency(court.price_per_hour)}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[8px] uppercase font-black tracking-widest text-white/30 block mb-1">{t.common.status}</span>
                    <span className="text-sm font-black text-accent uppercase flex items-center gap-1 italic"><Clock className="w-3 h-3" /> {court.open_time} - {court.close_time}</span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                   <Link href={`/courts/${court.id}`} className="block">
                     <Button className="w-full py-4 text-xs font-black uppercase tracking-[0.2em]">{t.courts.pick_schedule}</Button>
                   </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
