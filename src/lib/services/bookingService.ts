import { BookingSchema, BookingInput } from "@/lib/validators";
import { Booking } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export class BookingService {
  /**
   * Create a new booking with extreme reliability (Atomic RPC)
   */
  static async createBooking(supabase: SupabaseClient, userId: string, data: BookingInput) {
    // 1. Validate Input
    const validated = BookingSchema.parse(data);

    // 2. Business Rules (Pre-check)
    const start = new Date(`1970-01-01T${validated.start_time}`);
    const end = new Date(`1970-01-01T${validated.end_time}`);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (durationHours < 1 || durationHours > 3) {
      throw new Error("Durasi booking minimal 1 jam dan maksimal 3 jam.");
    }

    // 3. Booking Lifecycle Logic (Atomic Transaction)
    const { data: result, error: rpcError } = await supabase.rpc('fn_create_booking', {
      v_user_id: userId,
      v_court_id: validated.court_id,
      v_date: validated.date,
      v_start_time: validated.start_time,
      v_end_time: validated.end_time
    });

    if (rpcError) {
      console.error("[BOOKING_RPC_ERROR]", rpcError);
      throw new Error("Gagal memproses booking. Silakan coba lagi.");
    }

    if (!result?.success) {
      throw new Error(result?.message || "Terjadi kesalahan pada sistem booking.");
    }

    // 4. Fetch the created booking with related data for the UI
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*, courts(name, admin_phone)")
      .eq("id", result.booking_id)
      .single();

    if (fetchError) throw fetchError;

    return booking as Booking;
  }

  /**
   * Update booking status with strict state machine transitions
   */
  static async updateStatus(supabase: SupabaseClient, id: string, status: string, userRole: string) {
    // 1. Fetch current status
    const { data: current, error: fetchError } = await supabase
      .from("bookings")
      .select("status, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !current) throw new Error("Booking tidak ditemukan.");

    // 2. Transition Guardrails
    if (status === "confirmed") {
      if (userRole !== "admin") throw new Error("Hanya admin yang dapat mengkonfirmasi booking.");
      if (current.status !== "pending" && current.status !== "waiting_admin") {
        throw new Error(`Tidak dapat mengkonfirmasi booking dari status ${current.status}.`);
      }
    }

    if (status === "cancelled") {
      if (current.status === "confirmed" && userRole !== "admin") {
        throw new Error("Booking yang sudah dikonfirmasi hanya bisa dibatalkan oleh admin.");
      }
      if (current.status === "completed" || current.status === "expired") {
        throw new Error("Tidak dapat membatalkan booking yang sudah selesai atau kadaluarsa.");
      }
    }

    // 3. Update
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  }

  /**
   * Lazy Expiration Logic: Set pending bookings to 'expired' if >30 minutes old
   */
  static async cleanupExpiredBookings(supabase: SupabaseClient) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { error } = await supabase
      .from("bookings")
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('created_at', thirtyMinutesAgo);

    if (error) console.error("[CLEANUP_EXPIRED_BOOKINGS]", error);
  }

  /**
   * Build WhatsApp Message URL
   */
  static buildWhatsAppLink(data: {
    adminPhone: string;
    userName: string;
    courtName: string;
    date: string;
    start: string;
    end: string;
  }) {
    const message = `Halo Admin SmashGo,

Saya ingin booking:

Nama: ${data.userName}
Tanggal: ${data.date}
Jam: ${data.start}-${data.end}
Lapangan: ${data.courtName}

Mohon konfirmasinya. Terima kasih.`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${data.adminPhone.replace(/\D/g, "")}?text=${encoded}`;
  }
}
