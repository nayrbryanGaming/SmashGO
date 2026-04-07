// mobile/lib/features/admin/admin_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class AdminService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getAllBookings() async {
    final response = await _supabase
        .from('bookings')
        .select('*, courts(name, venues(name)), users(full_name, email)')
        .order('created_at', { ascending: false });
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> confirmCheckIn(String bookingId) async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    await _supabase.from('bookings').update({
      'status': 'checked_in',
      'checked_in_at': DateTime.now().toIso8601String(),
      'checked_in_by': user.id,
    }).eq('id', bookingId);
  }
}
