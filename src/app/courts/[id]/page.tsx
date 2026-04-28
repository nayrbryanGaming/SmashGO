"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Court, User } from "@/types";
import { GlassCard, Button, InputField } from "@/components/ui";
import { Calendar, Clock, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BookingService } from "@/lib/services/bookingService";
import { formatCurrency, formatDate } from "@/lib/utils";

import { AuthService } from "@/lib/services/authService";
import { CONFIG } from "@/lib/config";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [court, setCourt] = useState<Court | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: "18:00",
    end_time: "19:00",
  });


  useEffect(() => {
    async function init() {
      try {
        if (CONFIG.IS_OFFLINE_ONLY) {
          // Mock court data
          const mockCourts: Court[] = [
            {
              id: "court_1",
              name: "Grand Smash Arena",
              open_time: "08:00",
              close_time: "22:00",
              price_per_hour: 150000,
              status: "active",
              admin_phone: CONFIG.WHATSAPP_ADMIN,
              created_at: new Date().toISOString()
            },
            {
              id: "court_2",
              name: "Pro Shuttle Court",
              open_time: "06:00",
              close_time: "23:00",
              price_per_hour: 120000,
              status: "active",
              admin_phone: CONFIG.WHATSAPP_ADMIN,
              created_at: new Date().toISOString()
            }
          ];
          const found = mockCourts.find(c => c.id === id);
          if (found) setCourt(found);
        } else {
          const { data: courtData } = await supabase.from("courts").select("*").eq("id", id).single();
          if (courtData) setCourt(courtData as Court);
        }

        const user = await AuthService.getCurrentUser();
        if (user) setCurrentUser(user);

      } catch (err) {
        console.error("Booking init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Please login to continue.");
        return;
    }
    setSubmitting(true);

    try {
      const booking = await BookingService.createBooking(supabase, currentUser.id, {
        court_id: id as string,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      setSuccess(true);
      
      // Redirect to WhatsApp after 2 seconds
      const waLink = BookingService.buildWhatsAppLink(
        court?.admin_phone || "08123456789",
        currentUser.name,
        court?.name || "Lapangan",
        formData.date,
        formData.start_time,
        formData.end_time
      );
      
      setTimeout(() => {
        window.open(waLink, "_blank");
        router.push("/dashboard");
      }, 2000);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-primary">{t.common.loading}</div>;
  if (!court) return <div className="p-20 text-center font-black uppercase text-white">Court not found.</div>;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full p-12 text-center border-accent/30 bg-accent/5">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-black uppercase italic mb-4">{t.booking.success_title}</h2>
          <p className="text-white/60 font-medium leading-relaxed mb-8">
            {t.booking.success_desc}
          </p>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-accent animate-shimmer" style={{ width: '60%' }} />
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 max-w-5xl mx-auto">
      <div className="mb-12">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.common.back}
        </button>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
          {t.booking.title} <span className="text-primary">{t.booking.title_accent}</span>
        </h1>
        <p className="text-white/70 text-lg font-bold mt-4">{t.booking.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Booking Form */}
        <GlassCard className="p-8 border-primary/20 bg-primary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
             <InputField 
               label={t.booking.play_date} 
               type="date" 
               min={new Date().toISOString().split('T')[0]}
               value={formData.date}
               onChange={(e: any) => setFormData({...formData, date: e.target.value})}
               required
             />
             <div className="grid grid-cols-2 gap-4">
               <InputField 
                 label={t.booking.start_time} 
                 type="time" 
                 value={formData.start_time}
                 onChange={(e: any) => setFormData({...formData, start_time: e.target.value})}
                 required
               />
               <InputField 
                 label={t.booking.end_time} 
                 type="time" 
                 value={formData.end_time}
                 onChange={(e: any) => setFormData({...formData, end_time: e.target.value})}
                 required
               />
             </div>
             
             <div className="pt-4">
               <Button type="submit" disabled={submitting} className="w-full py-6 text-base">
                 {submitting ? t.booking.processing : t.booking.confirm_wa}
               </Button>
             </div>

             <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
               <ShieldCheck className="w-4 h-4" /> Professional Grade System Secured
             </div>
          </form>
        </GlassCard>

        {/* Summary Card */}
        <div className="space-y-8">
          <GlassCard className="p-8 border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-black uppercase italic mb-6 border-b border-white/5 pb-4">{t.booking.summary}</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-xs font-black uppercase text-white/40 tracking-widest">{t.booking.selected_arena}</span>
                 <span className="text-sm font-black text-white italic">{court.name}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs font-black uppercase text-white/40 tracking-widest">{t.booking.hourly_rate}</span>
                 <span className="text-sm font-black text-primary italic">{formatCurrency(court.price_per_hour)}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs font-black uppercase text-white/40 tracking-widest">{t.booking.play_date}</span>
                 <span className="text-sm font-black text-white italic">{formatDate(formData.date)}</span>
               </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-accent/20 bg-accent/5">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-4 flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4" /> {t.booking.rules}
             </h3>
             <ul className="space-y-3">
               {[t.booking.rule_1, t.booking.rule_2, t.booking.rule_3].map((rule, i) => (
                 <li key={i} className="text-[10px] font-bold text-white/60 flex items-start gap-2 uppercase tracking-wide">
                   <div className="w-1 h-1 rounded-full bg-accent mt-1" /> {rule}
                 </li>
               ))}
             </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
