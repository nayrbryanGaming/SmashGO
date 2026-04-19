"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Users, Zap, ShieldCheck, XCircle, MessageCircle, Loader2 } from "lucide-react";
import { MatchmakingInput } from "@/lib/validators";
import { User } from "@/types";

export default function MatchmakingDashboard({ currentUser }: { currentUser: User }) {
  const [status, setStatus] = useState<"idle" | "searching" | "matched">("idle");
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState<User | null>(null);
  const [selection, setSelection] = useState<MatchmakingInput>({
    skill_level: 1,
    start_time: "18:00",
    end_time: "20:00",
  });

  // Susbscribe to matchmaking changes
  useEffect(() => {
    if (status !== "searching") return;

    const channel = supabase
      .channel("matchmaking-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matchmaking",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          if (payload.new.status === "matched") {
            setStatus("matched");
            fetchMatchDetails(payload.new.matched_user_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status, currentUser.id]);

  async function fetchMatchDetails(partnerId: string) {
    const { data: partner } = await supabase
      .from("users")
      .select("*")
      .eq("id", partnerId)
      .single();
    setMatchData(partner);
  }

  async function handleJoin() {
    setLoading(true);
    try {
      const res = await fetch("/api/matchmaking/join", {
        method: "POST",
        body: JSON.stringify(selection),
      });
      const json = await res.json();
      
      if (json.success) {
        if (json.data && json.data.partner) {
          setMatchData(json.data.partner.users);
          setStatus("matched");
        } else {
          setStatus("searching");
        }
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {status === "idle" && (
        <div className="glass-card animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Cari Lawan</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium opacity-60 mb-2 block">Level Skill</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelection({ ...selection, skill_level: lvl })}
                    className={`py-3 rounded-xl border-2 transition-all ${
                      selection.skill_level === lvl
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    {lvl === 1 ? "Basic" : lvl === 2 ? "Intermediate" : "Pro"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium opacity-60 mb-2 block">Mulai Jam</label>
                <input
                  type="time"
                  className="input-field"
                  value={selection.start_time}
                  onChange={(e) => setSelection({ ...selection, start_time: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium opacity-60 mb-2 block">Selesai Jam</label>
                <input
                  type="time"
                  className="input-field"
                  value={selection.end_time}
                  onChange={(e) => setSelection({ ...selection, end_time: e.target.value })}
                />
              </div>
            </div>

            <button
              onClick={handleJoin}
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap className="w-5 h-5" />}
              Mulai Matching
            </button>
          </div>
        </div>
      )}

      {status === "searching" && (
        <div className="glass-card text-center py-12 animate-pulse">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 rounded-full animate-ping" />
            <div className="relative glass w-full h-full rounded-full flex items-center justify-center border-primary /30">
              <Users className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Mencari Lawan...</h2>
          <p className="text-slate-400 mb-8">Pencarian lawan seimbang sedang diproses secara real-time.</p>
          <button
            onClick={() => setStatus("idle")}
            className="flex items-center gap-2 mx-auto text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Batalkan Pencarian
          </button>
        </div>
      )}

      {status === "matched" && matchData && (
        <div className="glass-card text-center border-accent/30 bg-accent/5 animate-in slide-in-from-bottom-8 duration-500">
          <div className="w-20 h-20 rounded-full bg-accent/20 mx-auto flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-black mb-2">MATCH FOUND!</h2>
          <p className="text-slate-400 mb-8">Lawan seimbang telah ditemukan untuk Anda.</p>

          <div className="glass p-6 rounded-2xl mb-8 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs uppercase opacity-50 font-bold block mb-1">Partner tanding</span>
              <p className="text-xl font-bold">{matchData.name}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <span className="text-xs font-bold text-accent">SKILL LVL {selection.skill_level}</span>
            </div>
          </div>

          <a
            href={`https://wa.me/${matchData.phone.replace(/\D/g, "")}?text=Halo%20${matchData.name},%20saya%20dari%20SmashGo%20ingin%20bermain%20bersama.`}
            target="_blank"
            className="btn-primary w-full py-4 bg-accent hover:bg-emerald-600 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-6 h-6" />
            Hubungi via WhatsApp
          </a>

          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm opacity-50 hover:opacity-100 transition-all font-medium"
          >
            Kembali ke Beranda
          </button>
        </div>
      )}
    </div>
  );
}
