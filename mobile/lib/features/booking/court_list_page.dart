// mobile/lib/features/booking/court_list_page.dart
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:smashgo/features/booking/booking_service.dart';

class CourtListPage extends StatefulWidget {
  const CourtListPage({super.key});

  @override
  State<CourtListPage> createState() => _CourtListPageState();
}

class _CourtListPageState extends State<CourtListPage> {
  final _bookingService = BookingService();
  late Future<List<Map<String, dynamic>>> _courtsFuture;

  @override
  void initState() {
    super.initState();
    _courtsFuture = _bookingService.getCourts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PILIH LAPANGAN'),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _courtsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final courts = snapshot.data ?? [];
          if (courts.isEmpty) {
            return const Center(child: Text('Tidak ada lapangan tersedia'));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: courts.length,
            itemBuilder: (context, index) {
              final court = courts[index];
              return Container(
                margin: const EdgeInsets.bottom(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.05)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Image Placeholder
                    Container(
                      height: 160,
                      decoration: BoxDecoration(
                        color: Colors.slate-800,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                        image: court['photo_url'] != null 
                            ? DecorationImage(
                                image: NetworkImage(court['photo_url']), 
                                fit: BoxFit.cover
                              ) 
                            : null,
                      ),
                      child: court['photo_url'] == null 
                          ? const Center(child: Icon(LucideIcons.image, size: 48, color: Colors.slate-700)) 
                          : null,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                court['name'],
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text('TERSEDIA', style: TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(LucideIcons.mapPin, size: 12, color: Color(0xFF64748B)),
                              const SizedBox(width: 4),
                              Text(
                                '${court['venues']['name']}, ${court['venues']['city']}',
                                style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('MULAI DARI', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                                  Text(
                                    'Rp ${court['price_morning'].toLocaleString()}/jam',
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF4F46E5)),
                                  ),
                                ],
                              ),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 24),
                                  minimumSize: const Size(0, 40),
                                ),
                                child: const Text('BOOKING'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
