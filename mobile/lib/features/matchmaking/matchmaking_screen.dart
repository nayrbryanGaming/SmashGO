import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class MatchmakingScreen extends StatefulWidget {
  const MatchmakingScreen({super.key});

  @override
  State<MatchmakingScreen> createState() => _MatchmakingScreenState();
}

class _MatchmakingScreenState extends State<MatchmakingScreen> {
  final _supabase = Supabase.instance.client;
  bool _isSearching = false;
  String? _queueId;
  int _timer = 0;
  RealtimeChannel? _channel;

  @override
  void dispose() {
    _stopTimer();
    _channel?.unsubscribe();
    super.dispose();
  }

  void _startTimer() {
    _timer = 0;
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted || !_isSearching) return false;
      setState(() => _timer++);
      return true;
    });
  }

  void _stopTimer() {
    _isSearching = false;
  }

  Future<void> _startSearch() async {
    setState(() => _isSearching = true);
    _startTimer();

    try {
      final userId = _supabase.auth.currentUser!.id;
      final response = await _supabase.from('matchmaking_queue').insert({
        'user_id': userId,
        'match_type': 'singles',
        'user_elo': 1200, // Hardcoded for demo
        'status': 'searching',
        'expires_at': DateTime.now().add(const Duration(minutes: 5)).toIso8601String(),
      }).select().single();

      _queueId = response['id'];

      // Subscribe to real-time updates
      _channel = _supabase
        .channel('public:matchmaking_queue:id=eq.$_queueId')
        .onPostgresChanges(
          event: PostgresChangeEvent.update,
          schema: 'public',
          table: 'matchmaking_queue',
          callback: (payload) {
            if (payload.newRecord['status'] == 'matched') {
              _onMatchFound(payload.newRecord['match_id']);
            }
          },
        )
        .subscribe();
      
    } catch (e) {
      _stopTimer();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  void _onMatchFound(String matchId) {
    _stopTimer();
    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          backgroundColor: const Color(0xFF0F172A),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: const Text('LAWAN DITEMUKAN!', style: TextStyle(fontWeight: FontWeight.black, fontStyle: FontStyle.italic)),
          content: const Text('Sistem telah menemukan lawan yang seimbang. Siap bertanding?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('MASUK LAPANGAN', style: TextStyle(color: Color(0xFF4F46E5), fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('MATCHMAKING')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (!_isSearching) ...[
                const Icon(Icons.flash_on, size: 100, color: Colors.amber),
                const SizedBox(height: 24),
                const Text(
                  'CARI LAWAN TANDING',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Main seru dengan lawan yang seimbang berdasarkan rating ELO kamu.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white60),
                ),
                const SizedBox(height: 48),
                ElevatedButton(
                  onPressed: _startSearch,
                  style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 56)),
                  child: const Text('MULAI SEARCHING'),
                ),
              ] else ...[
                const SizedBox(
                  width: 120,
                  height: 120,
                  child: CircularProgressIndicator(strokeWidth: 8, color: Color(0xFF4F46E5)),
                ),
                const SizedBox(height: 48),
                Text(
                  'SEARCHING... ${_timer ~/ 60}:${(_timer % 60).toString().padStart(2, '0')}',
                  style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Harap tidak menutup aplikasi saat sedang mencari lawan.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 48),
                TextButton(
                  onPressed: () => setState(() => _isSearching = false),
                  child: const Text('BATALKAN PENCARIAN', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.black)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
