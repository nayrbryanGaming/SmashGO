import { User } from "@/types";
import { CONFIG } from "@/lib/config";
import { OfflineStorage } from "./offlineStorage";
import { supabase } from "../supabase/client";

export class AuthService {
  static async getCurrentUser(): Promise<User | null> {
    if (CONFIG.IS_OFFLINE_ONLY) {
      const cached = OfflineStorage.getUser();
      if (cached) return cached;
      
      // Default mock user for offline mode
      const mockUser: User = {
        id: "offline_user_id",
        name: "Pro Player",
        phone: "628123456789",
        role: "user",
        skill_level: 2,
        elo_rating: 1200,
        created_at: new Date().toISOString()
      };
      OfflineStorage.saveUser(mockUser);
      return mockUser;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      
      return profile as User;
    } catch (err) {
      return OfflineStorage.getUser();
    }
  }
}
