import { SupabaseClient } from "@supabase/supabase-js";
import { BookingInput, BookingSchema } from "@/lib/validators";
import { Booking } from "@/types";
import { CONFIG } from "@/lib/config";
import { OfflineStorage } from "./offlineStorage";

export class BookingService {
  /**
   * Create a new booking. Supports offline-only mode.
   */
  static async createBooking(supabase: SupabaseClient, userId: string, data: BookingInput) {
    const validated = BookingSchema.parse(data);

    // Duration Check
    const start = new Date(`1970-01-01T${validated.start_time}`);
    const end = new Date(`1970-01-01T${validated.end_time}`);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (durationHours < 1 || durationHours > 3) {
      throw new Error("Duration must be between 1 and 3 hours.");
    }

    if (CONFIG.IS_OFFLINE_ONLY) {
      // Offline Logic: Check overlap in localStorage
      const existing = OfflineStorage.getBookings();
      const hasOverlap = existing.some(b => 
        b.court_id === validated.court_id && 
        b.date === validated.date && 
        ((validated.start_time >= b.start_time && validated.start_time < b.end_time) ||
         (validated.end_time > b.start_time && validated.end_time <= b.end_time))
      );

      if (hasOverlap) throw new Error("Court is already booked for this time slot.");

      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: userId,
        court_id: validated.court_id,
        date: validated.date,
        start_time: validated.start_time,
        end_time: validated.end_time,
        status: "confirmed",
        created_at: new Date().toISOString(),
        courts: {
          name: "Local Court",
          admin_phone: CONFIG.WHATSAPP_ADMIN
        }
      };

      OfflineStorage.addBooking(newBooking);
      return newBooking;
    }

    // Online Logic (Sync if needed)
    const { data: result, error: rpcError } = await supabase.rpc('fn_create_booking', {
      v_user_id: userId,
      v_court_id: validated.court_id,
      v_date: validated.date,
      v_start_time: validated.start_time,
      v_end_time: validated.end_time
    });

    if (rpcError) throw new Error(rpcError.message);
    if (!result.success) throw new Error(result.message);

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*, courts(name, admin_phone)")
      .eq("id", result.booking_id)
      .single();

    if (fetchError) throw fetchError;
    return booking as Booking;
  }

  static buildWhatsAppLink(adminPhone: string, userName: string, courtName: string, date: string, start: string, end: string) {
    const message = `Halo Admin SmashGo,\n\nSaya ingin booking:\n\nNama: ${userName}\nTanggal: ${date}\nJam: ${start}-${end}\nLapangan: ${courtName}\n\nTerima kasih.`;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${adminPhone.replace(/\D/g, "")}?text=${encoded}`;
  }
}

