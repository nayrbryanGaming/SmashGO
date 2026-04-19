"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Clock, CheckCircle, XCircle, User, MapPin, Loader2, Filter, Calendar, MessageCircle } from "lucide-react";

export default function AdminBookingBoard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
    
    // Subscribe to new bookings
    const channel = supabase
      .channel("admin-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*, users(name, phone), courts(name)")
      .order("created_at", { ascending: false });
    
    setBookings(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.success) alert(json.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredBookings = bookings.filter(b => filter === "all" || b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Booking Board</h2>
          <p className="text-slate-400 text-sm">Kelola semua jadwal lapangan SmashGo.</p>
        </div>

        <div className="flex items-center gap-2 p-1 glass rounded-xl">
          {["all", "waiting_admin", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                filter === f ? "bg-primary text-white" : "hover:bg-white/5 opacity-60"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-400">Memuat data booking...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  b.status === "confirmed" ? "bg-accent/20 text-accent" : 
                  b.status === "cancelled" ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"
                }`}>
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{b.courts.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      b.status === "confirmed" ? "bg-accent/20 text-accent" :
                      b.status === "cancelled" ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white/60"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3"/> {b.users.name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {b.start_time} - {b.end_time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                {b.status === "waiting_admin" && (
                  <>
                    <button
                      onClick={() => updateStatus(b.id, "confirmed")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-lg border border-accent/30 hover:bg-accent hover:text-white transition-all text-sm font-bold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "cancelled")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                <a
                  href={`https://wa.me/${b.users.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  className="p-2 glass rounded-lg hover:text-primary transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="glass-card py-20 text-center">
              <Filter className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">Tidak ada booking dalam kategori ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
