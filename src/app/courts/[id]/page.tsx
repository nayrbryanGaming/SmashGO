"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Court, User } from "@/types";
import { GlassCard, Button, InputField } from "@/components/ui";
import { Calendar as CalendarIcon, Clock, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { BookingService } from "@/lib/services/bookingService";
import Link from "next/link";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [court, setCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: "18:00",
    end_time: "19:00",
    name: "",
    phone: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Fetch Court
      const { data: courtData } = await supabase
        .from("courts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (courtData) setCourt(courtData);

      // Fetch User (if any)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profile) {
          setCurrentUser(profile);
          setFormData(prev => ({ ...prev, name: profile.name, phone: profile.phone }));
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 1. Simple Auth (if not logged in)
      let userId = currentUser?.id;
      
      if (!userId) {
        // Create a temporary/basic user or handle minimal login
        // For production scale, I'd trigger a proper login here
        // But following "Tanpa login ribet", we use the provided data
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: `${formData.phone}@smashgo.com`,
          password: 'password123',
          options: { data: { name: formData.name, phone: formData.phone } }
        });
        
        if (authError) throw authError;
        userId = authData.user?.id;
      }

      if (!userId) throw new Error("Gagal menginisialisasi user.");

      // 2. Create Booking
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          court_id: id,
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time
        })
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setSuccess(true);
      
      // WhatsApp Trigger
      const waLink = BookingService.buildWhatsAppLink({
        adminPhone: court?.admin_phone || "628123456789",
        userName: formData.name,
        courtName: court?.name || "",
        date: formData.date,
        start: formData.start_time,
        end: formData.end_time
      });

      // Simple delay before redirecting to WhatsApp
      setTimeout(() => {
        window.open(waLink, '_blank');
      }, 1500);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal membuat booking.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Memuat...</div>;
  if (!court) return <div className="p-20 text-center">Lapangan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <Link href="/courts" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
      </Link>

      {success ? (
        <GlassCard className="text-center py-24 border-accent/20 bg-accent/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent/20">
            <div className="h-full bg-accent animate-shimmer" style={{ width: '60%' }} />
          </div>
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic leading-[0.9]">
              RESERVE <br />
              <span className="text-primary italic">YOUR COURT</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl font-medium">Selesaikan booking Anda untuk mengunci slot lapangan.</p>
          </div>
          <p className="text-white/60 mb-10 max-w-md mx-auto text-lg leading-relaxed mt-6">
            Permintaan Anda telah masuk ke sistem. 
            Kami akan mengalihkan Anda ke WhatsApp Admin untuk konfirmasi pembayaran dan kunci slot.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button onClick={() => router.push("/")} variant="secondary" className="h-14 px-8 rounded-2xl border-white/10 text-white font-bold">
               KEMBALI KE HOME
             </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic leading-[0.9]">
              RESERVE <br />
              <span className="text-primary italic">YOUR COURT</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl font-medium">Selesaikan booking Anda untuk mengunci slot lapangan.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Summary */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="bg-white/[0.02] border-white/10 p-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 shadow-inner">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Summary</h2>
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20">Selected Arena</p>
                  <p className="text-2xl font-black text-white">{court.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20">Hourly Rate</p>
                  <p className="text-2xl font-black text-accent">Rp {court.price_per_hour.toLocaleString('id-ID')}</p>
                </div>
                <div className="pt-6 border-t border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-accent">Real-time Availability</span>
                   </div>
                </div>
              </div>
            </GlassCard>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
               <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Aturan Booking</h4>
               <ul className="text-xs text-white/50 space-y-2 leading-relaxed">
                 <li>• Minimal durasi booking adalah 1 jam.</li>
                 <li>• Maksimal durasi booking adalah 3 jam.</li>
                 <li>• Pembatalan hanya bisa dilakukan lewat WhatsApp.</li>
               </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <GlassCard className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="Nama Lengkap" 
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                    required
                    disabled={!!currentUser}
                  />
                  <InputField 
                    label="No. WhatsApp (Aktif)" 
                    placeholder="Contoh: 0812..."
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})}
                    required
                    disabled={!!currentUser}
                  />
                </div>

                <InputField 
                  label="Tanggal Main" 
                  type="date"
                  value={formData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 ml-1">Jam Mulai</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                      <select 
                        className="input-field pl-10 appearance-none"
                        value={formData.start_time}
                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                      >
                        {Array.from({ length: 18 }, (_, i) => i + 6).map(hour => (
                          <option key={hour} value={`${hour < 10 ? '0' + hour : hour}:00`}>
                            {hour < 10 ? '0' + hour : hour}:00
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 ml-1">Jam Selesai</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                      <select 
                        className="input-field pl-10 appearance-none"
                        value={formData.end_time}
                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                      >
                         {Array.from({ length: 18 }, (_, i) => i + 7).map(hour => (
                          <option key={hour} value={`${hour < 10 ? '0' + hour : hour}:00`}>
                            {hour < 10 ? '0' + hour : hour}:00
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full py-4 text-lg"
                >
                  {submitting ? "Memproses..." : (
                    <>Konfirmasi via WhatsApp <Send className="w-5 h-5" /></>
                  )}
                </Button>
                
                <p className="text-center text-[10px] text-white/20">
                  Dengan mengklik tombol di atas, Anda setuju dengan Syarat & Ketentuan SmashGo.
                </p>
              </form>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
