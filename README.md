# SmashGo — Corporate Badminton Management Platform

[![Live App](https://img.shields.io/badge/🚀_LIVE_APP-smashgo.vercel.app-6366f1?style=for-the-badge)](https://smashgo.vercel.app/)
[![Download APK/PWA](https://img.shields.io/badge/📱_DOWNLOAD_APK/PWA-Install_Now-22c55e?style=for-the-badge)](https://smashgo.vercel.app/)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

SmashGo is a production-ready, full-stack badminton court management and matchmaking application designed for corporate internal use. It features a robust ELO-based matchmaking system, secure payment integration with Midtrans, and a comprehensive admin dashboard for venue operations.

---

## 📱 DOWNLOAD APK / INSTALL APP — KLIK SEKARANG

> **🔗 Link Resmi:** [https://smashgo.vercel.app/](https://smashgo.vercel.app/)

### Cara Install di Android (APK / PWA):
1. Buka **[https://smashgo.vercel.app/](https://smashgo.vercel.app/)** di browser HP (Chrome direkomendasikan)
2. Tunggu halaman terbuka sepenuhnya
3. Ketuk **tiga titik (⋮)** di pojok kanan atas Chrome
4. Pilih **"Install App"** atau **"Tambahkan ke Layar Utama"**
5. Konfirmasi install → Ikon SmashGo muncul di Home Screen ✅
6. Buka app → login / daftar akun → siap digunakan!

### Cara Install di iOS (iPhone/iPad):
1. Buka **[https://smashgo.vercel.app/](https://smashgo.vercel.app/)** di Safari
2. Ketuk ikon **Share (kotak dengan panah ke atas)**
3. Pilih **"Add to Home Screen"**
4. Ketuk **"Add"** → Ikon SmashGo muncul di Home Screen ✅

---

## 🚀 Key Features

- **Smart Matchmaking**: ELO-based system with dynamic skill level mapping and real-time waiting rooms.
- **Court Booking**: Flexible scheduling with integrated pre-ordering for equipment and consumables.
- **Secure Payments**: Integrated with Midtrans (QRIS, VA, Bank Transfer) with webhook safety.
- **Admin Dashboard**: Real-time sales stats, court management, and QR-based check-ins for staff.
- **PWA Ready**: Offline capabilities and push notifications for a native-like mobile experience.
- **Loyalty System**: Tiered rewards based on activity points (Bronze, Silver, Gold, Platinum).

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database / Auth | Supabase (PostgreSQL + RLS) |
| Styling | Tailwind CSS + shadcn/ui |
| Payments | Midtrans Node SDK |
| Email | Resend |
| Notifications | Firebase Cloud Messaging (FCM) |
| Deployment | Vercel (free tier) |

## 📦 Getting Started (Development)

### Prerequisites

- Node.js 18+
- Supabase Project
- Midtrans Merchant Account (Sandbox/Production)
- Firebase Project (for notifications)
- Resend API Key

### Installation

1. Clone this repo:
   ```bash
   git clone https://github.com/nayrbryanGaming/SmashGO.git
   cd SmashGO
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env.local` and fill in your credentials.

4. Initialize the database:
   Run the SQL migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security & Compliance

- **RLS (Row Level Security)**: Every table in Supabase is protected with strict RLS policies.
- **Webhook Verification**: Payment callbacks include SHA512 signature verification.
- **Route Protection**: Middleware-level auth and role-based access control (Admin/User).

## 📄 License

This project is licensed under the [MIT License](LICENSE).
