// mobile/lib/features/matchmaking/matchmaking_page.dart
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:smashgo/features/matchmaking/matchmaking_service.dart';

class MatchmakingPage extends StatefulWidget {
  const MatchmakingPage({super.key});

  @override
  State<MatchmakingPage> createState() => _MatchmakingPageState();
}

class _MatchmakingPageState extends State<MatchmakingPage> {
  final _matchmakingService = MatchmakingService();
  bool _isSearching = false;
  String? _currentQueueId;

  void _toggleSearch() async {
    if (_isSearching) {
      if (_currentQueueId != null) {
        await _matchmakingService.cancelQueue(_currentQueueId!);
      }
      setState(() {
        _isSearching = false;
        _currentQueueId = null;
      });
    } else {
      setState(() => _isSearching = true);
      try {
        // Mock data for elo and skill level (should come from profile)
        await _matchmakingService.joinQueue(
          elo: 1200, 
          skillLevel: 'menengah', 
          matchType: 'singles'
        );
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
          );
        }
        setState(() => _isSearching = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(title: const Text('MATCHMAKING')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Searching Animation / Icon
              Stack(
                alignment: Alignment.center,
                children: [
                   if (_isSearching) ...[
                     _buildRipple(150, 1.0, 1.0),
                     _buildRipple(200, 0.8, 2.0),
                     _buildRipple(250, 0.6, 3.0),
                   ],
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      color: _isSearching ? const Color(0xFF4F46E5) : const Color(0xFF1E293B),
                      shape: BoxShape.circle,
                      boxShadow: _isSearching ? [
                        BoxShadow(
                          color: const Color(0xFF4F46E5).withOpacity(0.4),
                          blurRadius: 40,
                          spreadRadius: 10,
                        )
                      ] : [],
                    ),
                    child: Icon(
                      _isSearching ? LucideIcons.search : LucideIcons.users, 
                      size: 48, 
                      color: Colors.white
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 64),
              
              Text(
                _isSearching ? 'SEDANG MENCARI LAWAN...' : 'CARI PERTANDINGAN',
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                _isSearching 
                  ? 'Kami mencocokkan Anda dengan pemain dengan ELO rating yang serupa.' 
                  : 'Siap untuk meningkatkan ranking Anda?',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 14),
              ),
              const SizedBox(height: 64),
              
              const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _InfoTag(LucideIcons.zap, 'ELO 1200'),
                  SizedBox(width: 12),
                  _InfoTag(LucideIcons.shield, 'MENENGAH'),
                ],
              ),
              const SizedBox(height: 64),
              
              ElevatedButton(
                onPressed: _toggleSearch,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isSearching ? Colors.red : const Color(0xFF4F46E5),
                  minimumSize: const Size(double.infinity, 56),
                ),
                child: Text(_isSearching ? 'BATALKAN PENCARIAN' : 'MULAI CARI LAWAN'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRipple(double size, double opacity, double delay) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFF4F46E5).withOpacity(0.2 * opacity), width: 2),
      ),
    );
  }
}

class _InfoTag extends StatelessWidget {
  final IconData icon;
  final String label;
  const _InfoTag(this.icon, this.label);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: const Color(0xFF4F46E5)),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.black, fontStyle: FontStyle.italic)),
        ],
      ),
    );
  }
}
