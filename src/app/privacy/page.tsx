import { GlassCard } from "@/components/ui";
import { Shield, Lock, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

        <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic leading-tight">
          Privacy <span className="text-primary italic">Policy</span>
        </h1>

      <GlassCard className="p-8 space-y-8 leading-relaxed text-white/70">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent" /> 1. Pengantar
          </h2>
          <p>
            SmashGo berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami 
            mengelola informasi yang Anda berikan saat menggunakan platform booking dan matchmaking kami.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" /> 2. Data yang Kami Kumpulkan
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Informasi Identitas</strong>: Nama Lengkap dan Nomor WhatsApp.</li>
            <li><strong>Data Transaksi</strong>: Detail booking lapangan, jadwal main, dan preferensi skill level.</li>
            <li><strong>Data Real-time</strong>: Status matchmaking Anda saat berada dalam antrian.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Penggunaan Data</h2>
          <p>
            Data Anda digunakan secara eksklusif untuk memfasilitasi koordinasi antar pemain dan admin. 
            Kami menggunakan integrasi WhatsApp sebagai media komunikasi utama. Dengan menggunakan SmashGo, 
            Anda setuju bahwa nomor Anda akan dibagikan kepada Admin Lapangan atau Lawan Tanding (saat Match Found).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Keamanan dan Penghapusan Data</h2>
          <p>
            Kami menjaga keamanan data Anda dengan standar enkripsi yang ketat. Jika Anda ingin menghapus akun 
            dan seluruh riwayat data Anda dari sistem SmashGo, Anda dapat melakukannya melalui menu Profil atau 
            menghubungi kami langsung di <span className="text-primary font-mono select-all">privacy@smashgo.app</span>. 
            Data akan dihapus secara permanen dalam waktu 1x24 jam.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">5. Kebijakan Anak-Anak</h2>
          <p>
            Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak mengumpulkan data 
            dari anak-anak secara sadar. Jika kami menemukan adanya data anak-anak di sistem, kami akan segera menghapusnya.
          </p>
        </section>

        <section className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm">
          <strong>Pernyataan Kepatuhan</strong>: SmashGo sepenuhnya mematuhi kebijakan Data Safety Google Play Store. 
          Kami tidak menjual data Anda kepada pihak ketiga manapun.
        </section>

        <footer className="pt-8 border-t border-white/10 text-xs text-white/30 text-center">
          Terakhir diperbarui: 16 April 2026 - SmashGo Indonesia.
        </footer>
      </GlassCard>
    </div>
  );
}
