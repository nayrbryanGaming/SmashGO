import { createClient } from "@/lib/supabase/server";
import MatchmakingDashboard from "@/components/matchmaking/MatchmakingDashboard";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, LayoutDashboard, RotateCcw, Users } from "lucide-react";
import { GlassCard } from "@/components/ui";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/"); // Or to a login page if one existed
  }

  // Fetch or ensure user profile exists in public.users
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
          <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">{profile?.name || user.email}</span>
          </div>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            PLAYER DASHBOARD
          </h1>
          <p className="text-slate-400">Kelola status matchmaking dan pantau performa tandingmu.</p>
        </div>

        <section>
          <MatchmakingDashboard currentUser={user} />
        </section>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-8 border-white/5 bg-white/[0.02] group">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-primary" /> Riwayat Tanding
            </h3>
            <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-sm text-slate-500">Belum ada data tanding dalam 30 hari terakhir.</p>
            </div>
          </GlassCard>
          
          <GlassCard className="p-8 border-white/5 bg-white/[0.02] group">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" /> Peringkat ELO
            </h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Base Rating</span>
                <p className="text-2xl font-black text-white">1,200</p>
              </div>
              <div className="px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-bold">
                RANK ALPHA
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed italic">
              *Peringkat dihitung berdasarkan performa tanding yang diverifikasi oleh Admin.
            </p>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
