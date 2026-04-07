// mobile/lib/features/rewards/reward_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class RewardService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getAvailableRewards() async {
    final response = await _supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost', { ascending: true });
    return List<Map<String, dynamic>>.from(response);
  }

  Future<void> redeemReward(String rewardId) async {
    final user = _supabase.auth.currentUser;
    if (user == null) throw Exception('Pengguna tidak login');

    // Get user points first
    final userData = await _supabase
        .from('users')
        .select('loyalty_points')
        .eq('id', user.id)
        .single();
    
    final rewardData = await _supabase
        .from('rewards')
        .select('points_cost')
        .eq('id', rewardId)
        .single();

    if (userData['loyalty_points'] < rewardData['points_cost']) {
      throw Exception('Poin tidak cukup');
    }

    // Process redemption
    await _supabase.rpc('redeem_reward_points', params: {
      'p_user_id': user.id,
      'p_reward_id': rewardId,
      'p_cost': rewardData['points_cost'],
    });
  }
}
