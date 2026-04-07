// mobile/lib/features/tournament/tournament_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class TournamentService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getTournaments() async {
    final response = await _supabase
        .from('tournaments')
        .select('*, venues(name, city)')
        .order('start_date', { ascending: true });
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> registerTournament({required String tournamentId, String? partnerId}) async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    await _supabase.from('tournament_participants').insert({
      'tournament_id': tournamentId,
      'user_id': user.id,
      'partner_id': partnerId,
      'status': 'registered',
    });
  }
}
