import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmashGoApp());
}

class SmashGoApp extends StatelessWidget {
  const SmashGoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmashGo Professional',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF3B82F6),
        scaffoldBackgroundColor: const Color(0xFF020617),
        useMaterial3: true,
      ),
      home: const MainWebView(),
    );
  }
}

class MainWebView extends StatefulWidget {
  const MainWebView({super.key});

  @override
  State<MainWebView> createState() => _MainWebViewState();
}

class _MainWebViewState extends State<MainWebView> {
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF020617))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('WebView Error: ${error.description}');
          },
        ),
      )
      ..loadRequest(Uri.parse('https://smashgo.vercel.app/'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_isLoading)
              Container(
                color: const Color(0xFF020617),
                child: const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'SMASHGO',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          fontStyle: FontStyle.italic,
                          letterSpacing: -2,
                          color: Color(0xFF3B82F6),
                        ),
                      ),
                      SizedBox(height: 20),
                      CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF3B82F6)),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
