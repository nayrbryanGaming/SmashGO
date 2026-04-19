import { MatchmakingSchema, MatchmakingInput } from "@/lib/validators";
import { SupabaseClient } from "@supabase/supabase-js";

export class MatchmakingService {
  /**
   * Join the matchmaking queue and find a match
   */
  static async joinQueue(supabase: SupabaseClient, userId: string, data: MatchmakingInput) {
    // 1. Validate
    const validated = MatchmakingSchema.parse(data);

    // 2. Check existing active queue
    const { data: existing } = await supabase
      .from("matchmaking")
      .select("id")
      .eq("user_id", userId)
      .in("status", ["searching", "matched"])
      .single();

    if (existing) {
      throw new Error("Anda sudah berada dalam antrian matchmaking.");
    }

    // 3. Create entry
    const { data: entry, error } = await supabase
      .from("matchmaking")
      .insert({
        user_id: userId,
        skill_level: validated.skill_level,
        start_time: validated.start_time,
        end_time: validated.end_time,
        status: "searching",
      })
      .select()
      .single();

    if (error) throw error;

    // 4. Attempt immediate match
    return this.runEngine(supabase, entry.id);
  }

  /**
   * The Real Matchmaking Engine (Now using atomic Database RPC)
   */
  static async runEngine(supabase: SupabaseClient, entryId: string) {
    const { data: result, error } = await supabase.rpc('fn_match_players', { 
      v_entry_id: entryId 
    });

    if (error) {
      console.error("[MATCHMAKING_RPC_ERROR]", error);
      return null;
    }

    // result is JSONB: { success: boolean, match_id: string, partner_name: string, ... }
    if (!result?.success) return null;

    // Fetch details for return
    const { data: updatedSelf } = await supabase
      .from("matchmaking")
      .select("*, users(name, phone)")
      .eq("id", entryId)
      .single();

    const { data: updatedPartner } = await supabase
      .from("matchmaking")
      .select("*, users(name, phone)")
      .eq("id", result.match_id)
      .single();

    return { self: updatedSelf, partner: updatedPartner };
  }

  /**
   * Cancel queue
   */
  static async cancelQueue(supabase: SupabaseClient, id: string, userId: string) {
    const { error } = await supabase
      .from("matchmaking")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true };
  }

  /**
   * Lazy Expiration: Searching entries > 15m become expired
   */
  static async cleanupExpiredQueue(supabase: SupabaseClient) {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { error } = await supabase
      .from("matchmaking")
      .update({ status: 'expired' })
      .eq('status', 'searching')
      .lt('created_at', fifteenMinutesAgo);

    if (error) console.error("[CLEANUP_EXPIRED_QUEUE]", error);
  }
}
