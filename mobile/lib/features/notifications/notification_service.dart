// mobile/lib/features/notifications/notification_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class NotificationService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getNotifications() async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    final response = await _supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> markAsRead(String id) async {
    await _supabase
        .from('notifications')
        .update({
          'is_read': true, 
          'read_at': DateTime.now().toIso8601String()
        })
        .eq('id', id);
  }

  Future<void> updateFcmToken(String token) async {
    final user = _supabase.auth.currentUser;
    if (user == null) return;

    await _supabase
        .from('users')
        .update({'fcm_token': token})
        .eq('id', user.id);
  }
}
