"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Booking, User } from "@/types";
import { GlassCard, Button } from "@/components/ui";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  LayoutDashboard, 
  Users, 
  Calendar,
  MoreVertical,
  Filter
} from "lucide-react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profile?.role === 'admin') {
          setCurrentUser(profile);
          fetchBookings();
        } else {
          // Redirect or show error
          console.error("Not an admin");
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  async function fetchBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, courts(*), users(*)")
      .order("created_at", { ascending: false });
    
    if (data) setBookings(data);
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const result = await res.json();
      if (result.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Memuat...</div>;
  if (!currentUser) return <div className="p-20 text-center">Akses Ditolak. Khusus Admin.</div>;

  const stats = {
    pending: bookings.filter(b => b.status === 'waiting_admin').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    total: bookings.length
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <LayoutDashboard className="w-10 h-10 text-primary" /> SmashGo Admin
          </h1>
          <p className="text-white/40 mt-2 italic">Dashboard Manajemen Operasional & Penjadwalan</p>
        </div>
        
        <div className="flex gap-4">
           <GlassCard className="py-3 px-6 text-center border-primary/20 bg-primary/5">
              <span className="text-[10px] uppercase text-white/30 block">Menunggu</span>
              <span className="text-2xl font-bold text-primary">{stats.pending}</span>
           </GlassCard>
           <GlassCard className="py-3 px-6 text-center border-accent/20 bg-accent/5">
              <span className="text-[10px] uppercase text-white/30 block">Terkonfirmasi</span>
              <span className="text-2xl font-bold text-accent">{stats.confirmed}</span>
           </GlassCard>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white/40" /> Daftar Booking Terbaru
          </h2>
          <Button variant="secondary" className="py-2 px-4 text-xs">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <GlassCard key={booking.id} className={`p-6 border-l-4 transition-all ${
              booking.status === 'confirmed' ? 'border-l-accent' : 
              booking.status === 'waiting_admin' ? 'border-l-primary animate-pulse' : 
              'border-l-white/10'
            }`}>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* User Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">{booking.users?.name || 'Anonymous'}</h4>
                    <p className="text-xs text-white/40">{booking.users?.phone}</p>
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-[10px] uppercase text-white/30 block mb-1">Lapangan</span>
                    <span className="text-sm font-semibold">{booking.courts?.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-white/30 block mb-1">Waktu</span>
                    <span className="text-sm font-semibold">{booking.date} | {booking.start_time}-{booking.end_time}</span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-[10px] uppercase text-white/30 block mb-1">Status</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded inline-block ${
                      booking.status === 'confirmed' ? 'bg-accent/20 text-accent' : 
                      booking.status === 'waiting_admin' ? 'bg-primary/20 text-primary' : 
                      'bg-white/5 text-white/40'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {booking.status === 'waiting_admin' && (
                    <>
                      <Button 
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="p-3 bg-accent/20 hover:bg-accent text-accent hover:text-white border-none rounded-xl"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </Button>
                      <Button 
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="p-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border-none rounded-xl"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  <Button variant="secondary" className="p-3 rounded-xl">
                    <MoreVertical className="w-5 h-5 text-white/40" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
