// mobile/lib/core/config/supabase_config.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String url = 'YOUR_SUPABASE_URL'; // Ganti dengan URL Supabase Anda
  static const String anonKey = 'YOUR_SUPABASE_ANON_KEY'; // Ganti dengan Anon Key
  
  static Future<void> initialize() async {
    await Supabase.initialize(
      url: url,
      anonKey: anonKey,
    );
  }
}
