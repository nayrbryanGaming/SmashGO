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

        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            Player <span className="text-primary">Hub</span>
          </h1>
          <p className="text-white/40 text-lg md:text-xl font-medium">Kelola status matchmaking dan pantau performa tandingmu.</p>
        </div>

        <section>
          <MatchmakingDashboard currentUser={user} />
        </section>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-10 border-white/5 bg-white/[0.02] group">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">Match History</h3>
            <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-sm font-bold tracking-widest text-white/20 uppercase">No Recent Activity</p>
            </div>
          </GlassCard>
          
          <GlassCard className="p-10 border-white/5 bg-white/[0.02] group">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">ELO Performance</h3>
            <div className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/5">
              <div>
                <span className="text-[10px] uppercase font-black text-white/30 tracking-[0.3em] block mb-2">Base Rating</span>
                <p className="text-4xl font-black text-white">1,200</p>
              </div>
              <div className="px-6 py-2 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/30">
                RANK ALPHA
              </div>
            </div>
            <p className="text-[10px] text-white/20 mt-8 leading-relaxed italic font-medium uppercase tracking-widest">
              *Peringkat dihitung berdasarkan performa tanding terverifikasi.
            </p>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
