// mobile/lib/features/matchmaking/matchmaking_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class MatchmakingService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<void> joinQueue({
    required int elo,
    required String skillLevel,
    required String matchType,
    String? venueId,
  }) async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    await _supabase.from('matchmaking_queue').insert({
      'user_id': user.id,
      'user_elo': elo,
      'user_skill_level': skillLevel,
      'match_type': matchType,
      'venue_id': venueId,
      'status': 'searching',
    });
  }

  Stream<List<Map<String, dynamic>>> watchQueueStatus() {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Stream.error('Pengguna tidak login');

    return _supabase
        .from('matchmaking_queue')
        .stream(primaryKey: ['id'])
        .eq('user_id', user.id)
        .order('created_at');
  }

  Future<void> cancelQueue(String queueId) async {
    await _supabase
        .from('matchmaking_queue')
        .update({'status': 'cancelled'})
        .eq('id', queueId);
  }
}
