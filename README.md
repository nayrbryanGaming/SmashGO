# SmashGo: Pro-Grade Badminton Management 🏸
> "Booking Lapangan Tanpa Ribet, Langsung Main."

## 🚀 Overview
**SmashGo** adalah platform manajemen booking lapangan badminton (PWA-Ready) yang dirancang untuk keandalan tinggi, keamanan transaksi, dan koordinasi instan. Sistem ini mengintegrasikan **Smart Matchmaking ELO**, **Pencegahan Overlap Real-time (GIST)**, dan **WhatsApp Transaction Engine** sebagai inti operasional.

## 🛡️ Enterprise Infrastructure
*Sistem Keandalan Global:*
- **Keamanan**: Protokol RLS (Row Level Security) ketat pada Supabase demi privasi data.
- **Integritas**: Menggunakan GIST Index & PostgreSQL Range Constraints untuk mencegah overlap jadwal secara matematis.
- **Atomisitas**: Pairing pemain dilakukan di level Database (RPC) untuk mencegah race-condition (Anti-Duplicate Matching).

## 🔥 Key Features
- **Smart Matchmaking Logic**: Algoritma yang menghitung *skill matching* (tolerance +/- 1) dan *overlap duration* (min 30 Menit).
- **Instant Booking Engine**: 3-klik booking dengan notifikasi dan konfirmasi via WhatsApp deep-link.
- **Progressive Web App (PWA)**: Teroptimasi untuk mobile dengan manifest mandiri untuk pengalaman aplikasi yang seamless.
- **Admin Dashboard**: Monitoring booking, manajemen status (Confirmed/Cancelled), dan statistik lapangan secara real-time.

## ⚙️ Tech Stack & Arch
- **Frontend**: Next.js 14 (App Router), TypeScript STRICT, Tailwind CSS.
- **Backend**: Next.js API Routes (Serverless).
- **Database**: Supabase PostgreSQL + BTree_GIST Extension.
- **State Management**: Zustand (Local) & React Query (Server Sync).

## 🛠️ Setup & Installation
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment Setup**:
   Copy `.env.local.example` to `.env.local` and fill in Supabase URL & Keys.
3. **Database Migration**:
   Run all migrations in `supabase/migrations/` sequentially.
4. **Run Dev**:
   ```bash
   npm run dev
   ```

## 🚢 Deployment
Proyek ini siap di-deploy langsung ke Vercel dengan integrasi Supabase yang sudah terkonfigurasi.

---
**SmashGo - Solusi Digital untuk Komunitas Badminton.**
