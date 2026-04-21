import { useState } from "react";
import { Calendar, Clock, MapPin, Send, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { BookingInput } from "@/lib/validators";
import { Court } from "@/types";
import { BookingService } from "@/lib/services/bookingService";

export default function QuickBookingForm({ courts }: { courts: Court[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [form, setForm] = useState<BookingInput>({
    court_id: courts[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    start_time: "17:00",
    end_time: "19:00",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const json = await res.json();
      
      if (json.success) {
        setSuccess(true);
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card text-center py-12 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent animate-bounce" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Booking Berhasil!</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Permintaan booking Anda telah masuk ke sistem. Hubungi admin via WhatsApp untuk konfirmasi status "Confirmed".
        </p>
        
        <button 
          onClick={() => {
            const court = courts.find(c => c.id === form.court_id);
            if (!court) return;
            
            const link = BookingService.buildWhatsAppLink({
              adminPhone: court.admin_phone || "628123456789",
              userName: "User SmashGo", // Default since we don't have name in this form
              courtName: court.name,
              date: form.date,
              start: form.start_time,
              end: form.end_time
            });
            
            window.open(link, "_blank");
          }}
          className="btn-primary w-full max-w-xs flex items-center justify-center gap-2 bg-emerald-600 border-none"
        >
          <Send className="w-5 h-5" />
          Konfirmasi via WhatsApp
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold">Booking Lapangan</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold uppercase opacity-50 mb-2 block tracking-widest">
            Pilih Lapangan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courts.map((court) => (
              <button
                key={court.id}
                type="button"
                onClick={() => setForm({ ...form, court_id: court.id })}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  form.court_id === court.id
                    ? "border-primary bg-primary/10"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className={`w-5 h-5 ${form.court_id === court.id ? "text-primary" : "text-slate-600"}`} />
                </div>
                <div>
                  <p className="font-bold text-sm">{court.name}</p>
                  <p className="text-xs opacity-50">Rp {court.price_per_hour.toLocaleString()}/Jam</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase opacity-50 mb-2 block tracking-widest">Tanggal</label>
            <div className="relative">
              <input 
                type="date" 
                className="input-field pl-10" 
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase opacity-50 mb-2 block tracking-widest">Mulai</label>
            <div className="relative">
              <input 
                type="time" 
                className="input-field pl-10" 
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
              <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase opacity-50 mb-2 block tracking-widest">Selesai</label>
            <div className="relative">
              <input 
                type="time" 
                className="input-field pl-10" 
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
              <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Send className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-slate-400">
            Booking minimal 1 jam. Status "Waiting Admin" setelah submit. 
            Segera hubungi admin untuk konfirmasi jadwal.
          </p>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
          Booking Lapangan Sekarang
        </button>
      </form>
    </div>
  );
}
