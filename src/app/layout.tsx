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
      <body className={`${inter.variable} ${outfit.variable} bg-[#0f172a] text-white selection:bg-primary/30`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
