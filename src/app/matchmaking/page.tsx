"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { MatchmakingEntry, User } from "@/types";
import { GlassCard, Button, InputField } from "@/components/ui";
import { Users, Zap, Clock, Shield, Search, CheckCircle2, MessageCircle, X, RotateCcw, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { OfflineStorage } from "@/lib/services/offlineStorage";
import { MatchmakingService } from "@/lib/services/matchmakingService";
import { AuthService } from "@/lib/services/authService";
import { CONFIG } from "@/lib/config";


export default function MatchmakingPage() {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeQueue, setActiveQueue] = useState<MatchmakingEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  
  const [formData, setFormData] = useState({
    skill_level: 2,
    start_time: "18:00",
    end_time: "20:00",
    name: "",
    phone: ""
  });

  useEffect(() => {
    async function init() {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          await fetchActiveQueue(user.id);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();

    if (!CONFIG.IS_OFFLINE_ONLY) {
      const channel = supabase
        .channel('matchmaking_status')
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'matchmaking' 
        }, (payload) => {
          if (activeQueue && payload.new.id === activeQueue.id) {
            fetchActiveQueue(currentUser?.id || "");
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [activeQueue?.id, currentUser?.id]);

  async function fetchActiveQueue(userId: string) {
    if (!userId) return;

    if (CONFIG.IS_OFFLINE_ONLY) {
      const cached = OfflineStorage.getMatchmaking();
      const active = cached.find(m => m.user_id === userId && (m.status === 'searching' || m.status === 'matched'));
      if (active) setActiveQueue(active);
      return;
    }

    const { data } = await supabase
      .from("matchmaking")
      .select("*, matched_user:matched_user_id(*)")
      .eq("user_id", userId)
      .in("status", ["searching", "matched"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (data) setActiveQueue(data as MatchmakingEntry);
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setJoining(true);

    try {
      await MatchmakingService.joinQueue(supabase, currentUser.id, {
        skill_level: formData.skill_level,
        start_time: formData.start_time,
        end_time: formData.end_time
      });

      await fetchActiveQueue(currentUser.id);
      
      // If offline, simulate polling for the mock match
      if (CONFIG.IS_OFFLINE_ONLY) {
        const interval = setInterval(async () => {
          const cached = OfflineStorage.getMatchmaking();
          const active = cached.find(m => m.user_id === currentUser.id && m.status === 'matched');
          if (active) {
            setActiveQueue(active);
            clearInterval(interval);
          }
        }, 1000);
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleCancel = async () => {
    if (!activeQueue || !currentUser) return;
    try {
      if (CONFIG.IS_OFFLINE_ONLY) {
        const cached = OfflineStorage.getMatchmaking();
        const index = cached.findIndex(m => m.id === activeQueue.id);
        if (index !== -1) {
          cached[index].status = 'cancelled';
          OfflineStorage.saveMatchmaking(cached);
        }
      } else {
        await supabase
          .from("matchmaking")
          .update({ status: "cancelled" })
          .eq("id", activeQueue.id);
      }
      setActiveQueue(null);
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-primary">{t.common.loading}</div>;

  return (
    <div className="container mx-auto px-6 py-24 max-w-5xl">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group mb-4">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.common.back}
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            {t.matchmaking.title} <span className="text-primary">{t.matchmaking.title_accent}</span>
          </h1>
          <p className="text-white/70 text-lg font-bold">{t.matchmaking.subtitle}</p>
        </div>
        <div className="flex gap-4">
          <GlassCard className="py-2 px-6 flex items-center gap-2 border-primary/20 bg-primary/10 rounded-full">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t.matchmaking.engine_v2}</span>
          </GlassCard>
        </div>
      </div>

      {!activeQueue ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic text-white">{t.matchmaking.why_title}</h2>
              <p className="text-white/60 leading-relaxed font-medium">
                {t.matchmaking.why_desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { icon: Search, title: t.matchmaking.feature_1, desc: t.matchmaking.feature_1_desc },
                 { icon: Shield, title: t.matchmaking.feature_2, desc: t.matchmaking.feature_2_desc },
                 { icon: Clock, title: t.matchmaking.feature_3, desc: t.matchmaking.feature_3_desc },
                 { icon: Users, title: t.matchmaking.feature_4, desc: t.matchmaking.feature_4_desc },
               ].map((item, i) => (
                 <GlassCard key={i} className="p-4 flex gap-4 items-start border-white/10 bg-white/[0.02]">
                   <item.icon className="w-5 h-5 text-primary shrink-0" />
                   <div>
                     <h4 className="text-sm font-black uppercase tracking-tight text-white">{item.title}</h4>
                     <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{item.desc}</p>
                   </div>
                 </GlassCard>
               ))}
            </div>
          </div>

          <GlassCard className="p-8 border-primary/30 bg-primary/5">
            <form onSubmit={handleJoin} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">{t.matchmaking.skill_level}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({...formData, skill_level: level})}
                        className={`py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 transition-all ${
                          formData.skill_level === level 
                            ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {level === 1 ? t.matchmaking.skill_1 : level === 2 ? t.matchmaking.skill_2 : t.matchmaking.skill_3}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputField 
                    label={t.booking.start_time} 
                    type="time"
                    value={formData.start_time}
                    onChange={(e: any) => setFormData({...formData, start_time: e.target.value})}
                    required
                  />
                  <InputField 
                    label={t.booking.end_time} 
                    type="time"
                    value={formData.end_time}
                    onChange={(e: any) => setFormData({...formData, end_time: e.target.value})}
                    required
                   />
                </div>

                <Button type="submit" disabled={joining} className="w-full py-4 text-xs font-black uppercase tracking-[0.2em]">
                  {joining ? t.booking.processing : t.matchmaking.form_title} <Users className="w-5 h-5" />
                </Button>
            </form>
          </GlassCard>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">
           {activeQueue.status === 'searching' ? (
            <GlassCard className="text-center py-20 relative overflow-hidden group bg-white/[0.02] border-white/10">
               <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 overflow-hidden">
                 <div className="h-full bg-primary animate-shimmer" style={{ width: '40%' }} />
               </div>
               
               <div className="relative mb-10">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/10 border-t-primary animate-spin mx-auto flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary animate-pulse" />
                  </div>
               </div>

               <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-3">{t.matchmaking.searching}</h2>
               <p className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
                 {t.matchmaking.searching_desc}
               </p>
               
               <div className="flex flex-col sm:flex-row justify-center gap-4 px-8">
                 <Button variant="outline" onClick={() => fetchActiveQueue(currentUser?.id || '')} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs">
                    {t.matchmaking.refresh} <RotateCcw className="w-4 h-4 ml-2" />
                 </Button>
                 <Button variant="danger" onClick={handleCancel} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs">
                    {t.common.cancel} <X className="w-4 h-4 ml-2" />
                 </Button>
               </div>
             </GlassCard>
           ) : (
             <GlassCard className="border-accent/40 bg-accent/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-accent p-4 text-center text-xs font-black uppercase tracking-[0.2em] text-[#0f172a]">
                  {t.matchmaking.match_found}
                </div>
                
                <div className="p-8 space-y-8">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/30 shadow-inner">
                          <Users className="w-8 h-8" />
                       </div>
                       <div>
                         <h3 className="text-2xl font-black uppercase italic text-white">{activeQueue.matched_user?.name || "Partner Tanding"}</h3>
                         <p className="text-accent flex items-center gap-1 font-black uppercase text-[10px] tracking-widest">
                           <CheckCircle2 className="w-3 h-3" /> {t.matchmaking.verified_player}
                         </p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                       <span className="text-[10px] uppercase font-black tracking-widest text-white/30 block mb-1">{t.matchmaking.skill_level}</span>
                       <span className="text-xl font-black text-primary uppercase italic">LVL {activeQueue.matched_user?.skill_level || activeQueue.skill_level}</span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                       <span className="text-[10px] uppercase font-black tracking-widest text-white/30 block mb-1">{t.matchmaking.overlap_time}</span>
                       <span className="text-xl font-black text-white/80 uppercase italic">{activeQueue.start_time} - {activeQueue.end_time}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-center text-white/60 text-sm font-medium">
                      Lawan ditemukan! Segera hubungi partner Anda untuk menentukan lapangan dan waktu tanding.
                    </p>
                    <a 
                      href={MatchmakingService.buildPartnerWhatsAppLink(
                        activeQueue.matched_user?.phone || "",
                        activeQueue.matched_user?.name || "Player",
                        activeQueue.skill_level,
                        activeQueue.start_time,
                        activeQueue.end_time
                      )}
                      target="_blank"
                      className="block"
                    >
                      <Button className="w-full py-6 text-sm font-black uppercase tracking-[0.2em] bg-[#25D366] hover:bg-[#128C7E] border-none shadow-lg shadow-green-500/20 group">
                        {t.matchmaking.contact_partner} <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </div>
             </GlassCard>
           )}
        </div>
      )}
    </div>
  );
}
