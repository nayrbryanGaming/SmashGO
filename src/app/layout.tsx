import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SmashGo | Booking Lapangan Tanpa Ribet, Langsung Main",
  description: "Platform manajemen booking lapangan badminton berbasis web app dengan Smart Matchmaking ELO dan koordinasi WhatsApp real-time.",
  keywords: ["badminton", "booking lapangan", "matchmaking", "bulutangkis", "SmashGo"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SmashGo",
  },
  verification: {
    google: "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} bg-[#020617] text-white antialiased selection:bg-primary/30`}>
        {/* Universal Premium Background */}
        <div className="fixed inset-0 -z-10 bg-[#020617] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
        </div>
        
        <main className="min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
