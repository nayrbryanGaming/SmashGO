import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class BookingScreen extends ConsumerStatefulWidget {
  const BookingScreen({super.key});

  @override
  ConsumerState<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends ConsumerState<BookingScreen> {
  final _supabase = Supabase.instance.client;
  List<dynamic> _venues = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchVenues();
  }

  Future<void> _fetchVenues() async {
    try {
      final data = await _supabase
          .from('venues')
          .select('*, courts(id, status)')
          .eq('is_active', true);
      setState(() {
        _venues = data;
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
        title: const Text('SMASHGO VENUES'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchVenues,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _venues.length,
                itemBuilder: (context, index) {
                  final venue = _venues[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 16),
                    clipBehavior: Clip.antiAlias,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: InkWell(
                      onTap: () {
                        // Navigate to Court Selection
                      },
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            height: 160,
                            width: double.infinity,
                            color: Colors.indigo.withOpacity(0.1),
                            child: const Icon(Icons.location_on, size: 48, color: Colors.indigo),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.between,
                                  children: [
                                    Text(
                                      venue['name'].toString().toUpperCase(),
                                      style: const TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w900,
                                        fontStyle: FontStyle.italic,
                                      ),
                                    ),
                                    const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.white24),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  venue['address'],
                                  style: const TextStyle(color: Colors.white60, fontSize: 12),
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    _buildInfoChip(Icons.sports_tennis, '${venue['courts'].length} LAPANGAN'),
                                    const SizedBox(width: 8),
                                    _buildInfoChip(Icons.access_time, '${venue['open_time']}-${venue['close_time']}'),
                                  ],
                                ),
                              ],
                            ),
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

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: Colors.indigoAccent),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
