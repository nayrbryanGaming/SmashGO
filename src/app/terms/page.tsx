import { GlassCard } from "@/components/ui";
import { FileText, Shield, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

        <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic leading-tight">
          Terms of <span className="text-primary italic">Service</span>
        </h1>

      <GlassCard className="p-8 space-y-8 leading-relaxed text-white/70">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> 1. Penerimaan Ketentuan
          </h2>
          <p>
            Dengan mengakses atau menggunakan platform SmashGo, Anda setuju untuk terikat oleh Ketentuan Layanan ini. 
            Jika Anda tidak setuju dengan bagian mana pun, Anda tidak diperbolehkan menggunakan layanan kami.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Tanggung Jawab Pengguna</h2>
          <p>
            Anda bertanggung jawab penuh atas keakuratan data yang Anda masukkan (Nama dan No. WhatsApp). 
            Penggunaan data palsu atau informasi yang tidak akurat dapat mengakibatkan 
            pembatasan akses demi menjaga integritas komunitas SmashGo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Booking dan Pembatalan</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Semua booking bersifat "Pending" hingga dikonfirmasi oleh Admin via WhatsApp.</li>
            <li>SmashGo tidak memproses pembayaran digital. Segala bentuk transaksi keuangan dilakukan langsung antara Pengguna dan Pengelola Lapangan.</li>
            <li>Pembatalan harus dilakukan minimal 6 jam sebelum jadwal main untuk menjaga reputasi akun Anda.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Batasan Tanggung Jawab (Force Majeure)</h2>
          <p>
            SmashGo tidak bertanggung jawab atas kegagalan sistem yang disebabkan oleh faktor luar kendali, termasuk 
            namun tidak terbatas pada gangguan layanan internet, pemeliharaan mendadak pada platform pihak ketiga 
            (seperti WhatsApp atau Supabase), atau kejadian tak terduga lainnya.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> 5. Tata Kelola Operasional
          </h2>
          <p>
            SmashGo berkomitmen untuk menyediakan platform yang adil dan transparan. Segala bentuk perbedaan interpretasi 
            mengenai penggunaan layanan akan diselesaikan melalui jalur mediasi internal yang mengedepankan profesionalisme 
            dan etika komunitas olahraga.
          </p>
        </section>

        <section className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm italic">
          <AlertCircle className="w-4 h-4 inline-block mr-2 mb-1" />
          <strong>Disclaimer</strong>: SmashGo adalah platform koordinasi. Kami tidak memproses dana pengguna. 
          Semua transaksi keuangan adalah tanggung jawab langsung antara pengguna dan penyedia lapangan.
        </section>

        <footer className="pt-8 border-t border-white/10 text-xs text-white/30 text-center">
          © 2026 SmashGo - Solusi Manajemen Lapangan Badminton.
        </footer>
      </GlassCard>
    </div>
  );
}
