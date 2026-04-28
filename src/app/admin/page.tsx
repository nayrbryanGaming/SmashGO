"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { User, Booking, Court } from "@/types";
import { GlassCard, Button, InputField } from "@/components/ui";
import { LayoutDashboard, Users, Calendar, Plus, Trash2, CheckCircle2, XCircle, Phone, ArrowLeft, Settings } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminPage() {
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'courts' | 'users'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
        if (profile?.role === 'admin') {
          setIsAdmin(true);
          fetchData();
        }
      }
      setLoading(false);
    }
    checkAdmin();
  }, []);

  async function fetchData() {
    const { data: bData } = await supabase.from("bookings").select("*, courts(name), users(name, phone)").order("created_at", { ascending: false });
    const { data: cData } = await supabase.from("courts").select("*");
    if (bData) setBookings(bData as Booking[]);
    if (cData) setCourts(cData as Court[]);
  }

  async function updateBookingStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (!error) fetchData();
  }

  if (loading) return <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-primary">{t.common.loading}</div>;
  if (!isAdmin) return <div className="p-20 text-center font-black uppercase text-red-500">Access Denied. Admin Only.</div>;

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-2">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group mb-4">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.common.back}
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            Command <span className="text-primary">Center</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <Button variant={activeTab === 'bookings' ? 'primary' : 'outline'} onClick={() => setActiveTab('bookings')} size="sm">Bookings</Button>
           <Button variant={activeTab === 'courts' ? 'primary' : 'outline'} onClick={() => setActiveTab('courts')} size="sm">Courts</Button>
        </div>
      </div>

      {activeTab === 'bookings' && (
        <div className="space-y-6">
           {bookings.map((booking) => (
             <GlassCard key={booking.id} className="p-6 border-white/10 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-6">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                     booking.status === 'confirmed' ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                   )}>
                     <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-black uppercase italic text-white">{booking.courts?.name} - {booking.users?.name}</h3>
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                        {formatDate(booking.date)} | {booking.start_time} - {booking.end_time}
                     </p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="text-right px-6">
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-1">Status</span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                        booking.status === 'confirmed' ? "border-accent/30 text-accent bg-accent/10" : "border-primary/30 text-primary bg-primary/10"
                      )}>{booking.status}</span>
                   </div>
                   
                   <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => updateBookingStatus(booking.id, 'confirmed')} disabled={booking.status === 'confirmed'}>
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
             </GlassCard>
           ))}
        </div>
      )}

      {activeTab === 'courts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {courts.map((court) => (
             <GlassCard key={court.id} className="p-8 border-white/10">
                <h3 className="text-xl font-black uppercase italic text-white mb-4">{court.name}</h3>
                <div className="space-y-3 mb-8">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                      <span>Rate</span>
                      <span className="text-white">{formatCurrency(court.price_per_hour)}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                      <span>Hours</span>
                      <span className="text-white">{court.open_time} - {court.close_time}</span>
                   </div>
                </div>
                <Button variant="outline" className="w-full">Edit Court</Button>
             </GlassCard>
           ))}
           <GlassCard className="p-8 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-all">
              <Plus className="w-12 h-12 text-white/10 mb-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Add New Court</span>
           </GlassCard>
        </div>
      )}
    </div>
  );
}
