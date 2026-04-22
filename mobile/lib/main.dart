import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmashGo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3B82F6)),
      ),
      home: const SmashGoWebView(),
    );
  }
}

class SmashGoWebView extends StatefulWidget {
  const SmashGoWebView({super.key});

  @override
  State<SmashGoWebView> createState() => _SmashGoWebViewState();
}

class _SmashGoWebViewState extends State<SmashGoWebView> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF020617))
      ..loadRequest(Uri.parse('https://smashgo.vercel.app'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      body: SafeArea(
        child: WebViewWidget(controller: controller),
      ),
    );
  }
}
