// mobile/lib/features/dashboard/dashboard_page.dart
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:smashgo/features/profile/profile_service.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final _profileService = ProfileService();
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF020617),
          border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
            backgroundColor: const Color(0xFF0F172A),
            selectedItemColor: const Color(0xFF4F46E5),
            unselectedItemColor: const Color(0xFF64748B),
            selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, fontStyle: FontStyle.italic),
            unselectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
            type: BottomNavigationBarType.fixed,
            items: const [
              BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: 'HOME'),
              BottomNavigationBarItem(icon: Icon(LucideIcons.calendar), label: 'BOOKING'),
              BottomNavigationBarItem(icon: Icon(LucideIcons.users), label: 'MATCH'),
              BottomNavigationBarItem(icon: Icon(LucideIcons.trophy), label: 'RANK'),
              BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: 'PROFIL'),
            ],
          ),
        ),
      ),
      body: _currentIndex == 0 ? _buildHome() : const Center(child: Text('Coming Soon')),
    );
  }

  Widget _buildHome() {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 120,
          floating: false,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            titlePadding: const EdgeInsets.only(left: 24, bottom: 16),
            title: Row(
              children: [
                const Icon(LucideIcons.zap, color: Color(0xFF4F46E5), size: 20),
                const SizedBox(width: 8),
                Text(
                  'SMASHGO',
                  style: GoogleFonts.outfit(
                    fontWeight: FontWeight.w900,
                    fontStyle: FontStyle.italic,
                    fontSize: 20,
                  ),
                ),
              ],
            ),
          ),
          actions: [
            IconButton(
              icon: const Icon(LucideIcons.bell),
              onPressed: () {},
            ),
            const SizedBox(width: 8),
          ],
        ),
        
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Quick Stats
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF4F46E5), Color(0xFF3B82F6)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('ELO RATING', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white70)),
                              Text('1240', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white24,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text('GOLD TIER', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildMiniStat('MATCH', '42'),
                          _buildMiniStat('WINS', '28'),
                          _buildMiniStat('POINTS', '850'),
                        ],
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 32),
                _buildSectionHeader('BOOKING AKTIF'),
                const SizedBox(height: 16),
                _buildActiveBookingCard(),
                
                const SizedBox(height: 32),
                _buildSectionHeader('MENU CEPAT'),
                const SizedBox(height: 16),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.5,
                  children: [
                    _buildQuickMenu(LucideIcons.calendar, 'BOOKING LAMPU', const Color(0xFF6366F1)),
                    _buildQuickMenu(LucideIcons.users, 'CARI LAWAN', const Color(0xFF22C55E)),
                    _buildQuickMenu(LucideIcons.trophy, 'TURNAMEN', const Color(0xFFF59E0B)),
                    _buildQuickMenu(LucideIcons.gift, 'REWARDS', const Color(0xFFEC4899)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMiniStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
        Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white60)),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: Color(0xFF64748B))),
        const Icon(LucideIcons.chevronRight, size: 16, color: Color(0xFF64748B)),
      ],
    );
  }

  Widget _buildActiveBookingCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF4F46E5).withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(LucideIcons.mapPin, color: Color(0xFF4F46E5)),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Lapangan Utama A1', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                Text('Besok, 18:00 - 20:00', style: TextStyle(color: Color(0xFF64748B), fontSize: 11)),
              ],
            ),
          ),
          const Icon(LucideIcons.qrCode, color: Color(0xFF4F46E5)),
        ],
      ),
    );
  }

  Widget _buildQuickMenu(IconData icon, String label, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
        ],
      ),
    );
  }
}
