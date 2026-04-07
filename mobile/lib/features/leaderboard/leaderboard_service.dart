// mobile/lib/features/leaderboard/leaderboard_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class LeaderboardService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getGlobalRanking() async {
    final response = await _supabase
        .from('users')
        .select('full_name, email, elo_rating, skill_level, avatar_url')
        .order('elo_rating', { ascending: false })
        .limit(100);
    return List<Map<String, dynamic>>.from(response);
  }
}
