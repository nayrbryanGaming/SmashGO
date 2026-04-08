import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<User?>>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AsyncValue<User?>> {
  AuthNotifier() : super(const AsyncValue.loading()) {
    _init();
  }

  final _supabase = Supabase.instance.client;

  void _init() {
    final session = _supabase.auth.currentSession;
    if (session != null) {
      state = AsyncValue.data(session.user);
    } else {
      state = const AsyncValue.data(null);
    }

    _supabase.auth.onAuthStateChange.listen((data) {
      final User? user = data.user;
      state = AsyncValue.data(user);
    });
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> logout() async {
    await _supabase.auth.signOut();
  }
}
