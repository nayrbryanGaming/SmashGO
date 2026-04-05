# SmashGo — Corporate Badminton Management Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Live-emerald?style=for-the-badge&logo=vercel)](https://smashgo.vercel.app/)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

SmashGo is a production-ready, full-stack badminton court management and matchmaking application designed for corporate internal use. It features a robust ELO-based matchmaking system, secure payment integration with Midtrans, and a comprehensive admin dashboard for venue operations.

## 🔗 Live Application (APK/PWA)
**Access & Install Now**: [https://smashgo.vercel.app/](https://smashgo.vercel.app/)

## 🚀 Key Features

- **Smart Matchmaking**: ELO-based system with dynamic skill level mapping and real-time waiting rooms.
- **Court Booking**: Flexible scheduling with integrated pre-ordering for equipment and consumables.
- **Secure Payments**: Integrated with Midtrans (QRIS, VA, Bank Transfer) with webhook safety.
- **Admin Dashboard**: Real-time sales stats, court management, and QR-based check-ins for staff.
- **PWA Ready**: Offline capabilities and push notifications for a native-like mobile experience.
- **Loyalty System**: Tiered rewards based on activity points (Bronze, Silver, Gold, Platinum).

## 🛠 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org)
- **Language**: TypeScript
- **Database / Auth**: [Supabase](https://supabase.com) (PostgreSQL, RLS enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Payments**: [Midtrans Node SDK](https://github.com/Midtrans/midtrans-nodejs-client)
- **Email**: [Resend](https://resend.com)
- **Notif**: [Firebase Cloud Messaging (FCM)](https://firebase.google.com/products/cloud-messaging)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Supabase Project
- Midtrans Merchant Account (Sandbox/Production)
- Firebase Project (for notifications)
- Resend API Key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   Copy `.env.example` to `.env.local` and fill in your credentials.

3. Initialize the database:
   Run the SQL migration located in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security & Compliance

- **RLS (Row Level Security)**: Every table in Supabase is protected with strict RLS policies.
- **Webhook Verification**: Payment callbacks include SHA512 signature verification.
- **Route Protection**: Middleware-level auth and role-based access control (Admin/User).

## 📱 Mobile Installation (Download APK/PWA)

SmashGo is built as a Progressive Web App (PWA) for the best mobile experience. 

1. Open [https://smashgo.vercel.app/](https://smashgo.vercel.app/) in your mobile browser.
2. **Android**: Tap the three dots and select **"Install App"** or **"Add to Home Screen"**.
3. **iOS**: Tap the Share icon and select **"Add to Home Screen"**.
4. The app will be installed on your device with a premium icon and full-screen functionality.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
