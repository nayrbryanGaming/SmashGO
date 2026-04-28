import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SmashGo Professional | Premium Badminton Booking",
  description: "Revolutionize your badminton experience with Smart ELO Matchmaking and real-time booking. Built for performance and reliability.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, outfit.variable, "antialiased selection:bg-primary/30")}>
        <LanguageProvider>
          <div className="relative min-h-screen">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
            
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
