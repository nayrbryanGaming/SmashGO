// mobile/lib/features/match/match_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class MatchService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getMyMatches() async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    final response = await _supabase
        .from('matches')
        .select('*, player_a:users!player_a_id(full_name), player_b:users!player_b_id(full_name)')
        .or('player_a_id.eq.${user.id},player_b_id.eq.${user.id},player_a2_id.eq.${user.id},player_b2_id.eq.${user.id}')
        .order('scheduled_at', { ascending: false });
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> updateScore({required String matchId, required List<dynamic> scores, String? winnerId}) async {
    await _supabase.from('matches').update({
      'scores': scores,
      'winner_id': winnerId,
      'status': 'completed',
      'completed_at': DateTime.now().toIso8601String(),
    }).eq('id', matchId);
  }
}
