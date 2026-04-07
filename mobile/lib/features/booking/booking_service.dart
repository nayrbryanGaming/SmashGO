// mobile/lib/features/booking/booking_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class BookingService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getCourts() async {
    final response = await _supabase
        .from('courts')
        .select('*, venues(name, city)')
        .eq('is_active', true);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<List<Map<String, dynamic>>> getCourtAvailability(String courtId, String date) async {
    final response = await _supabase
        .from('bookings')
        .select('start_time, end_time, status')
        .eq('court_id', courtId)
        .eq('booking_date', date)
        .not('status', 'in', '("cancelled","expired")');
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> createBooking({
    required String courtId,
    required String date,
    required String startTime,
    required String endTime,
    required double duration,
    required int totalPrice,
  }) async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    await _supabase.from('bookings').insert({
      'user_id': user.id,
      'court_id': courtId,
      'booking_date': date,
      'start_time': startTime,
      'end_time': endTime,
      'duration_hours': duration,
      'total_price': totalPrice,
      'status': 'pending_payment',
    });
  }
}
