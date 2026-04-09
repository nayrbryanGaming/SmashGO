import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class RewardsPage extends ConsumerStatefulWidget {
  const RewardsPage({super.key});

  @override
  ConsumerState<RewardsPage> createState() => _RewardsPageState();
}

class _RewardsPageState extends ConsumerState<RewardsPage> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> _rewards = [];
  int _userPoints = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return;

      final responses = await Future.wait([
        _supabase.from('users').select('loyalty_points').eq('id', user.id).single(),
        _supabase.from('rewards').select('*').eq('is_active', true),
      ]);

      setState(() {
        _userPoints = responses[0]['loyalty_points'] ?? 0;
        _rewards = List<Map<String, dynamic>>.from(responses[1] as List);
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rewards & Loyalty'),
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                _buildPointsHeader(),
                Expanded(
                  child: GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.75,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: _rewards.length,
                    itemBuilder: (context, index) {
                      final reward = _rewards[index];
                      return _buildRewardCard(reward);
                    },
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildPointsHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          const Text(
            'Poin Anda',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
          const SizedBox(height: 8),
          Text(
            '$_userPoints',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 48,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Tukarkan poin dengan hadiah menarik',
            style: TextStyle(color: Colors.white60, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildRewardCard(Map<String, dynamic> reward) {
    final name = reward['name'] ?? 'Reward';
    final cost = reward['points_cost'] ?? 0;
    final type = reward['reward_type'] ?? 'discount';
    final canAfford = _userPoints >= cost;

    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              width: double.infinity,
              color: _getRewardTypeColor(type).withOpacity(0.1),
              child: Icon(
                _getRewardTypeIcon(type),
                size: 48,
                color: _getRewardTypeColor(type),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  '$cost Poin',
                  style: TextStyle(
                    color: Theme.of(context).primaryColor,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: canAfford ? () => _redeemReward(reward) : null,
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.zero,
                      backgroundColor: _getRewardTypeColor(type),
                      disabledBackgroundColor: Colors.grey.shade300,
                    ),
                    child: const Text('Tukarkan', style: TextStyle(fontSize: 12)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _redeemReward(Map<String, dynamic> reward) async {
    // Basic redemption logic
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Konfirmasi Penukaran'),
        content: Text('Tukarkan ${reward['points_cost']} poin untuk ${reward['name']}?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _processRedemption(reward);
            },
            child: const Text('Ya, Tukarkan'),
          ),
        ],
      ),
    );
  }

  Future<void> _processRedemption(Map<String, dynamic> reward) async {
    // In production, this should be a transaction or a RPC call
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Menghubungi server...')),
    );
  }

  IconData _getRewardTypeIcon(String type) {
    switch (type) {
      case 'discount': return Icons.local_offer;
      case 'free_booking': return Icons.confirmation_number;
      case 'merchandise': return Icons.card_giftcard;
      default: return Icons.stars;
    }
  }

  Color _getRewardTypeColor(String type) {
    switch (type) {
      case 'discount': return Colors.red;
      case 'free_booking': return Colors.blue;
      case 'merchandise': return Colors.orange;
      default: return Colors.purple;
    }
  }
}
