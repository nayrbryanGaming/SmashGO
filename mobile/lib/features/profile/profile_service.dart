// mobile/lib/features/profile/profile_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class ProfileService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<Map<String, dynamic>> getUserProfile() async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');
    
    final response = await _supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
    return response;
  }

  Future<void> updateProfile({required String fullName, String? phone}) async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    final Map<String, dynamic> updateData = {
      'full_name': fullName,
      'updated_at': DateTime.now().toIso8601String(),
    };
    if (phone != null) updateData['phone'] = phone;

    await _supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);
  }
}
