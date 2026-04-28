"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { User } from "@/types";
import { GlassCard } from "@/components/ui";
import { Trophy, ArrowLeft, TrendingUp, Medal, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [players, setPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("elo_rating", { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setPlayers(data as User[]);
      }
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-primary">{t.common.loading}</div>;

  const top3 = players.slice(0, 3);
  const remaining = players.slice(3);

  return (
    <div className="min-h-screen py-10 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.common.back}
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
              {t.leaderboard.title} <span className="text-primary">{t.leaderboard.title_accent}</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-bold max-w-2xl">{t.leaderboard.subtitle}</p>
          </div>
          <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
             <Trophy className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.leaderboard.season_active}</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         {top3.map((player, index) => (
           <GlassCard key={player.id} className={cn(
             "p-8 text-center border-white/10 relative group hover:bg-white/5 transition-all",
             index === 0 ? "md:-translate-y-4 border-primary/30 bg-primary/5" : ""
           )}>
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-inner",
                index === 0 ? "bg-primary/20 text-primary border-2 border-primary/30" : "bg-white/5 text-white/40 border border-white/10"
              )}>
                {index + 1}
              </div>
              <h3 className="text-2xl font-black uppercase italic text-white mb-2">{player.name}</h3>
              <div className="flex justify-center gap-4">
                 <div className="text-center">
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest block">{t.leaderboard.elo_rating}</span>
                    <span className="text-lg font-black text-primary">{player.elo_rating}</span>
                 </div>
                 <div className="text-center">
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest block">{t.leaderboard.table.matches}</span>
                    <span className="text-lg font-black text-white">{player.matches_played}</span>
                 </div>
              </div>
              {index === 0 && (
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 rotate-12">
                   <Medal className="w-6 h-6 text-white" />
                </div>
              )}
           </GlassCard>
         ))}
      </div>

      {/* Rankings Table */}
      <GlassCard className="border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{t.leaderboard.table.rank}</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{t.leaderboard.table.player}</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{t.leaderboard.table.skill}</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 text-center">{t.leaderboard.table.matches}</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 text-right">{t.leaderboard.table.elo}</th>
            </tr>
          </thead>
          <tbody>
            {remaining.map((player, index) => (
              <tr key={player.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 font-black text-white/20 italic text-xl">#{index + 4}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:text-primary transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-black uppercase tracking-tight text-white">{player.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/40">
                     {player.skill_level === 3 ? t.matchmaking.skill_3 : player.skill_level === 2 ? t.matchmaking.skill_2 : t.matchmaking.skill_1}
                   </span>
                </td>
                <td className="px-8 py-6 text-center font-bold text-white/60">{player.matches_played}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xl font-black text-white italic">{player.elo_rating}</span>
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
