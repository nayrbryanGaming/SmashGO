"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-6 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group mb-12">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <GlassCard className="p-12 border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Terms of <span className="text-accent">Service</span></h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-white/60 font-medium">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">1. Platform Usage</h2>
            <p>SmashGo is a booking facilitator. We do not own the courts listed on the platform. By using this service, you agree to follow the specific rules and regulations of each individual court facility.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">2. Matchmaking Conduct</h2>
            <p>Players are expected to maintain professional conduct during matchmaking. SmashGo reserves the right to suspend users who engage in harassment or fail to show up for confirmed matches.</p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">3. Payments</h2>
            <p>All payments are handled directly between the user and the court administrator via WhatsApp. SmashGo does not process payments and is not liable for transaction disputes.</p>
          </section>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pt-12">Final Production Version 18.0 - Secure & Verified</p>
        </div>
      </GlassCard>
    </div>
  );
}
