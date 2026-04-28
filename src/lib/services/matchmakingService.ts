import { SupabaseClient } from "@supabase/supabase-js";
import { MatchmakingInput, MatchmakingSchema } from "@/lib/validators";
import { CONFIG } from "@/lib/config";
import { OfflineStorage } from "./offlineStorage";
import { MatchmakingEntry } from "@/types";

export class MatchmakingService {
  /**
   * Join queue and trigger pairing engine. Supports offline mode.
   */
  static async joinQueue(supabase: SupabaseClient, userId: string, data: MatchmakingInput) {
    const validated = MatchmakingSchema.parse(data);

    if (CONFIG.IS_OFFLINE_ONLY) {
      const existing = OfflineStorage.getMatchmaking().find(m => m.user_id === userId && (m.status === "searching" || m.status === "matched"));
      if (existing) throw new Error("You are already in queue.");

      const newEntry: MatchmakingEntry = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: userId,
        skill_level: validated.skill_level,
        start_time: validated.start_time,
        end_time: validated.end_time,
        status: 'searching',
        created_at: new Date().toISOString()
      };

      OfflineStorage.addMatchmaking(newEntry);
      
      // Simulate finding a match after 2 seconds for WOW effect
      setTimeout(() => {
        this.simulateMatch(newEntry.id);
      }, 2000);

      return { success: true, entry_id: newEntry.id };
    }

    // Online Logic
    const { data: existing } = await supabase
      .from("matchmaking")
      .select("id")
      .eq("user_id", userId)
      .in("status", ["searching", "matched"])
      .single();

    if (existing) throw new Error("You are already in queue.");

    const { data: entry, error } = await supabase
      .from("matchmaking")
      .insert({
        user_id: userId,
        skill_level: validated.skill_level,
        start_time: validated.start_time,
        end_time: validated.end_time,
        status: 'searching'
      })
      .select()
      .single();

    if (error) throw error;

    return this.runEngine(supabase, entry.id);
  }

  static simulateMatch(entryId: string) {
    const entries = OfflineStorage.getMatchmaking();
    const index = entries.findIndex(e => e.id === entryId);
    if (index !== -1) {
      entries[index].status = "matched";
      entries[index].matched_user_id = "mock_partner_id";
      entries[index].matched_user = {
        id: "mock_partner_id",
        name: "Pro Player AI",
        phone: "628999999999",
        role: "user",
        skill_level: entries[index].skill_level,
        created_at: new Date().toISOString()
      };
      OfflineStorage.saveMatchmaking(entries);
    }
  }

  static async runEngine(supabase: SupabaseClient, entryId: string) {
    if (CONFIG.IS_OFFLINE_ONLY) return null;
    
    const { data: result, error } = await supabase.rpc('fn_match_players', { 
      v_entry_id: entryId 
    });

    if (error) return null;
    return result.success ? result : null;
  }

  static buildPartnerWhatsAppLink(phone: string, name: string, skill: number, start: string, end: string) {
    const message = `Halo ${name}, kita match di SmashGo!\n\nLevel: ${skill === 3 ? 'Pro' : skill === 2 ? 'Intermediate' : 'Beginner'}\nJam: ${start}-${end}\n\nYuk cari lapangan!`;
    return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  }
}

