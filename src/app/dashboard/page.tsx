"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { User as UserIcon, ArrowLeft, RotateCcw, Users, Trophy, LayoutDashboard } from "lucide-react";
import { GlassCard, Button } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";
import { OfflineStorage } from "@/lib/services/offlineStorage";
import { AuthService } from "@/lib/services/authService";
import { CONFIG } from "@/lib/config";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setProfile(user);
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);


  if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-primary">{t.common.loading}</div>;

  return (
    <div className="min-h-screen py-10 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.common.back}
        </Link>
        <div className="flex items-center gap-3 glass px-6 py-2 rounded-full border-white/10 bg-white/5">
          <UserIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-white">{profile?.name || "Player"}</span>
        </div>
      </div>

      <div className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
          {t.dashboard.hub_title} <span className="text-primary">{t.dashboard.hub_title_accent}</span>
        </h1>
        <p className="text-white/70 text-lg md:text-xl font-bold">{t.landing.cta_dashboard}</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-10 border-white/10 bg-white/[0.02] group">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
            <RotateCcw className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">{t.dashboard.history_title}</h3>
          <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">{t.dashboard.history_empty}</p>
          </div>
        </GlassCard>
        
        <GlassCard className="p-10 border-white/10 bg-white/[0.02] group">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">{t.dashboard.performance_title}</h3>
          <div className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em] block mb-2">{t.dashboard.base_rating}</span>
              <p className="text-4xl font-black text-white">{profile?.elo_rating || 1200}</p>
            </div>
            <div className="px-6 py-2 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/30">
              {t.dashboard.rank_alpha}
            </div>
          </div>
          <p className="text-[10px] text-white/30 mt-8 leading-relaxed italic font-black uppercase tracking-widest">
            {t.dashboard.elo_footer}
          </p>
        </GlassCard>
      </section>

      <section className="mt-12">
         <GlassCard className="p-8 border-primary/30 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/30">
                  <Users className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="text-xl font-black uppercase italic text-white">{t.matchmaking.title} {t.matchmaking.title_accent}</h4>
                  <p className="text-white/50 text-sm font-medium">{t.dashboard.matchmaking_sub}</p>
               </div>
            </div>
            <Link href="/matchmaking">
              <Button className="px-10 h-14 font-black uppercase tracking-widest text-xs rounded-2xl">
                 {t.dashboard.matchmaking_cta} <LayoutDashboard className="w-4 h-4 ml-2" />
              </Button>
            </Link>
         </GlassCard>
      </section>
    </div>
  );
}
