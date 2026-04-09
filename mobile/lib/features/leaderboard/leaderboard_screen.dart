import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class LeaderboardScreen extends ConsumerStatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  ConsumerState<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends ConsumerState<LeaderboardScreen> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> _rankings = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchRankings();
  }

  Future<void> _fetchRankings() async {
    try {
      final response = await _supabase
          .from('users')
          .select('full_name, elo_rating, avatar_url, division')
          .order('elo_rating', ascending: false)
          .limit(50);
      
      setState(() {
        _rankings = List<Map<String, dynamic>>.from(response);
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error fetching rankings: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Leaderboard Global'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.black,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchRankings,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemCount: _rankings.length,
                itemBuilder: (context, index) {
                  final user = _rankings[index];
                  final name = user['full_name'] ?? 'Unknown';
                  final elo = user['elo_rating'] ?? 1000;
                  final division = user['division'] ?? 'General';
                  final rank = index + 1;

                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    elevation: rank <= 3 ? 4 : 1,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: rank <= 3 
                        ? BorderSide(color: _getRankColor(rank), width: 2)
                        : BorderSide.none,
                    ),
                    child: ListTile(
                      leading: SizedBox(
                        width: 40,
                        child: Center(
                          child: _getRankIcon(rank),
                        ),
                      ),
                      title: Text(
                        name,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(division),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '$elo ELO',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                          const Text(
                            'PRO PLAYER',
                            style: TextStyle(fontSize: 10, letterSpacing: 1),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }

  Widget _getRankIcon(int rank) {
    if (rank == 1) return const Icon(Icons.emoji_events, color: Colors.orange, size: 32);
    if (rank == 2) return const Icon(Icons.emoji_events, color: Colors.grey, size: 28);
    if (rank == 3) return const Icon(Icons.emoji_events, color: Colors.brown, size: 24);
    return Text(
      '#$rank',
      style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
    );
  }

  Color _getRankColor(int rank) {
    if (rank == 1) return Colors.orange;
    if (rank == 2) return Colors.grey;
    if (rank == 3) return Colors.brown;
    return Colors.transparent;
  }
}
