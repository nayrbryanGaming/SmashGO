"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-6 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group mb-12">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <GlassCard className="p-12 border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Privacy <span className="text-primary">Policy</span></h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-white/60 font-medium">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">1. Data Collection</h2>
            <p>SmashGo collects basic identification data including name and WhatsApp phone number solely for the purpose of court booking and matchmaking. We do not store sensitive financial data as all transactions occur externally via WhatsApp.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">2. Use of Data</h2>
            <p>Your phone number is shared only with the court administrator during a booking or with your designated playing partner during a successful matchmaking pair to facilitate coordination.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">3. System Security</h2>
            <p>Our system is built on professional-grade infrastructure using Supabase Row Level Security (RLS) to ensure that only you and authorized administrators can access your booking history.</p>
          </section>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pt-12">Last Updated: April 2026 - Professional System Verified</p>
        </div>
      </GlassCard>
    </div>
  );
}
