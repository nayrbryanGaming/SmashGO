import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smashgo/core/providers/auth_provider.dart';
import 'package:smashgo/features/booking/presentation/booking_screen.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isObscure = true;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    ref.listen(authProvider, (previous, next) {
      if (next is AsyncData && next.value != null) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const BookingScreen()),
        );
      }
      if (next is AsyncError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login Gagal: ${next.error}')),
        );
      }
    });

    return Scaffold(
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0F172A), Color(0xFF020617)],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Hero(
              tag: 'logo',
              child: Icon(Icons.sports_tennis, size: 80, color: Color(0xFF4F46E5)),
            ),
            const SizedBox(height: 16),
            const Text(
              'SMASHGO',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                fontStyle: FontStyle.italic,
                letterSpacing: -1,
              ),
            ),
            const Text(
              'PLATFORM BOOKING LAPANGAN TERDEPAN',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.white24,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 48),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'EMAIL PEGAWAI',
                prefixIcon: Icon(Icons.email_outlined, size: 20),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              obscureText: _isObscure,
              decoration: InputDecoration(
                labelText: 'PASSWORD',
                prefixIcon: const Icon(Icons.lock_outline, size: 20),
                suffixIcon: IconButton(
                  icon: Icon(_isObscure ? Icons.visibility_off : Icons.visibility, size: 20),
                  onPressed: () => setState(() => _isObscure = !_isObscure),
                ),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: authState is AsyncLoading
                  ? null
                  : () {
                      ref.read(authProvider.notifier).login(
                            _emailController.text,
                            _passwordController.text,
                          );
                    },
              child: authState is AsyncLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('MASUK SEKARANG'),
            ),
            const SizedBox(height: 24),
            TextButton(
              onPressed: () {},
              child: const Text(
                'LUPA PASSWORD?',
                style: TextStyle(color: Colors.white24, fontSize: 10, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
