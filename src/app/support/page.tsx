"use client";

import { GlassCard, Button } from "@/components/ui";
import { MessageCircle, Mail, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Support <span className="text-primary">Center</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl">
              Kami siap membantu Anda. Jika Anda mengalami kendala dengan booking atau matchmaking, hubungi tim kami melalui kanal di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-8 space-y-6 hover:bg-white/5 transition-colors border-white/10">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">WhatsApp Support</h3>
                <p className="text-white/40 text-sm">Respon cepat untuk bantuan booking dan teknis lapangan.</p>
              </div>
              <Link href="https://wa.me/6281234567890" target="_blank" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white border-none">
                  Chat di WhatsApp
                </Button>
              </Link>
            </GlassCard>

            <GlassCard className="p-8 space-y-6 hover:bg-white/5 transition-colors border-white/10">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Email Inquiry</h3>
                <p className="text-white/40 text-sm">Untuk kerjasama bisnis atau laporan bug mendalam.</p>
              </div>
              <Link href="mailto:support@smashgo.com" className="block">
                <Button variant="secondary" className="w-full bg-white/5 border-white/10">
                  Kirim Email
                </Button>
              </Link>
            </GlassCard>
          </div>

          <GlassCard className="p-8 border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Bagaimana cara membatalkan booking?</h4>
                <p className="text-white/40 text-sm">Buka Dashboard Player, pilih booking Anda, dan klik tombol 'Cancel'. Perhatikan bahwa pembatalan hanya bisa dilakukan sebelum admin melakukan konfirmasi.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Apa itu Smart Matchmaking ELO?</h4>
                <p className="text-white/40 text-sm">Sistem kami mencocokkan Anda dengan pemain lain yang memiliki tingkat skill serupa (Level 1-3) dan ketersediaan waktu yang sama untuk memastikan pertandingan yang seru.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
