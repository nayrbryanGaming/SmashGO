"use client";

import { GlassCard } from "@/components/ui";
import { Trophy, Medal, Star, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface RankingUser {
  id: string;
  name: string;
  elo_rating: number;
  matches_played: number;
  win_rate: number;
  skill_level?: string;
}

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, elo_rating, matches_played, win_rate")
        .order("elo_rating", { ascending: false })
        .limit(10);

      if (data) {
        setRankings(data);
      }
      setLoading(false);
    }
    fetchRankings();
  }, []);

  const getSkillLabel = (elo: number) => {
    if (elo >= 2200) return "PRO";
    if (elo >= 1800) return "INTERMEDIATE";
    return "BASIC";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Global <span className="text-primary">Ranking</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl">
              Dominasi lapangan dan naikkan ranking Anda. Sistem ELO kami menghitung performa Anda di setiap pertandingan.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase">Season 1 Active</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Top 3 Spotlight */}
              {rankings.slice(0, 3).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className={`p-8 flex flex-col items-center text-center relative overflow-hidden border-white/10 ${
                    index === 0 ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' : 'bg-white/[0.02]'
                  }`}>
                    {index === 0 && (
                      <div className="absolute top-4 right-4">
                        <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                      </div>
                    )}
                    <div className={`w-20 h-20 rounded-full mb-6 flex items-center justify-center text-3xl font-black ${
                      index === 0 ? 'bg-primary text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'bg-white/10 text-white/60'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-1 truncate w-full">{player.name}</h3>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-4">{getSkillLabel(player.elo_rating)}</p>
                    <div className="grid grid-cols-2 gap-8 w-full border-t border-white/10 pt-6">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">ELO Rating</p>
                        <p className="text-lg font-black">{player.elo_rating}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Win Rate</p>
                        <p className="text-lg font-black text-green-400">{player.win_rate}%</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <GlassCard className="overflow-hidden border-white/10 bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Rank</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Player</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Skill</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Matches</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">ELO</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rankings.map((player, index) => (
                      <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-6">
                          <span className="font-black text-white/40 group-hover:text-primary transition-colors">#{index + 1}</span>
                        </td>
                        <td className="px-8 py-6 font-bold truncate max-w-[150px]">{player.name}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase">
                            {getSkillLabel(player.elo_rating)}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-white/60">{player.matches_played}</td>
                        <td className="px-8 py-6 font-black text-primary">{player.elo_rating}</td>
                        <td className="px-8 py-6 text-right">
                          <TrendingUp className="w-4 h-4 text-green-500 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
}
