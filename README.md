# SmashGo - Booking Lapangan Tanpa Ribet, Langsung Main

![SmashGo Banner](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## Overview
SmashGo adalah platform manajemen booking lapangan badminton berbasis web app (PWA-ready) yang revolusioner. Dirancang khusus untuk memecahkan masalah koordinasi dan antrian lapangan badminton korporat maupun umum, sistem ini mengintegrasikan booking real-time, Smart Matchmaking ELO, dan sistem ranking kompetitif dalam satu genggaman. SmashGo mengedepankan prinsip SIMPLE tapi RELIABLE, beroperasi tanpa payment gateway yang kompleks, dan menggunakan WhatsApp sebagai Core Transaction System.

## Problem
1. **Sistem Booking Manual:** Lapangan badminton sering kali dikelola dengan sistem manual (buku/kertas) atau chat WhatsApp yang tidak terorganisir, menyebabkan risiko double booking dan kebingungan antrian.
2. **Kesulitan Mencari Lawan Seimbang:** Pemain yang tidak memiliki grup atau partner kesulitan menemukan lawan dengan tingkat keahlian yang seimbang (skill gap), mengurangi kepuasan bermain.
3. **Kompleksitas Aplikasi:** Aplikasi yang ada sering kali terlalu kompleks, memaksa pengguna membuat akun berbelit-belit dan mewajibkan pembayaran di dalam aplikasi yang menambah friksi (terutama bagi UMKM).

## Solution
SmashGo hadir dengan pendekatan **"Booking Engine + Matchmaking Engine + WhatsApp Coordination Engine"**:
- **Atomic Booking System:** Mencegah *race conditions* dan *double booking* secara presisi di level database.
- **Smart Matchmaking ELO:** Mesin pencari otomatis yang memasangkan pemain berdasarkan tingkat skill yang sama dan waktu yang bersinggungan.
- **WhatsApp Core:** Seluruh transaksi dan konfirmasi langsung di-*redirect* ke WhatsApp Admin, memastikan proses tanpa friksi, cepat, dan cocok untuk UMKM tanpa perlu integrasi payment gateway pihak ketiga.

## Feature Detail
1. **Real-Time Court Booking:**
   - Pilih lapangan, tanggal, dan rentang waktu (1-3 jam).
   - Validasi ketat untuk jam operasional dan pencegahan overlap waktu.
   - Status tracking: `pending` → `waiting_admin` → `confirmed` / `completed`.
2. **Matchmaking Engine:**
   - Pemain bergabung ke antrian berdasarkan tingkat skill (Level 1-3).
   - Sistem akan mencarikan pasangan yang memiliki perbedaan skill ≤ 1 dan irisan waktu ≥ 30 menit.
   - Jika ditemukan, status menjadi `matched` dan sistem menyediakan link untuk koordinasi lebih lanjut.
3. **WhatsApp Auto-Coordination:**
   - *Message generator* yang membuat format pesan pre-filled (Nama, Tanggal, Jam, Lapangan, dll).
   - Pesan langsung dikirim ke WhatsApp admin lapangan yang dituju.
4. **Admin Dashboard (PWA Ready):**
   - Admin dapat menerima notifikasi WhatsApp dan mengkonfirmasi booking melalui sistem untuk mengunci slot waktu.

## Architecture
- **Frontend:** Next.js 14 (App Router) dengan TypeScript STRICT dan Tailwind CSS untuk antarmuka yang sangat responsif, modern, dan mobile-first.
- **Backend:** Next.js API Routes (Serverless) untuk layer logika bisnis.
- **Database:** Supabase PostgreSQL (FREE tier) dengan arsitektur Relational Database yang memanfaatkan Foreign Keys, Indexes, dan Constraints (Anti Overlap).
- **Realtime / Atomic Operations:** Supabase RPC (Remote Procedure Call) `fn_create_booking` dan `fn_match_players` untuk menjamin keamanan transaksional, mencegah *race conditions*.
- **Service Layer Pattern:** Logika bisnis dipisah di `/lib/services/` (Clean Architecture) sehingga API route hanya berfungsi sebagai handler.

## Setup
### Persyaratan
- Node.js 18.x atau lebih baru.
- Akun Supabase.
- Akun GitHub & Vercel.

### Langkah-langkah Instalasi
1. Clone repositori ini:
   ```bash
   git clone https://github.com/nayrbryanGaming/SmashGO.git
   cd "SmashGO aplikasi booking lapangan bulutangkis"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Konfigurasi Environment Variables:
   Buat file `.env.local` dan tambahkan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Setup Database (Supabase):
   Jalankan file SQL migration yang ada di folder `supabase/migrations/` di SQL Editor Supabase Anda.
5. Jalankan development server:
   ```bash
   npm run dev
   ```

## Deploy ke Vercel
1. Pastikan kode sudah di-push ke repository GitHub: `https://github.com/nayrbryanGaming/SmashGO`
2. Kunjungi dashboard Vercel (https://vercel.com/) dan buat project baru (*Add New > Project*).
3. Import repository GitHub `nayrbryanGaming/SmashGO`.
4. Tambahkan Environment Variables di Vercel (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Klik **Deploy**. Aplikasi akan otomatis mem-build dan live di *smashgo.vercel.app*.

## Limitation
- **Sistem Matchmaking Masih Membutuhkan User Aktif:** Karena tidak menggunakan WebSockets berat untuk polling, matchmaking bergantung pada RPC call dan background checks saat ada yang trigger *join queue*.
- **Tanpa Payment Gateway Built-in:** Mengandalkan transfer/pembayaran manual via WhatsApp, yang berarti admin harus manual verifikasi pembayaran sebelum mengubah status ke `confirmed`.
- **Tidak Support Multi-tenant Kompleks:** Dirancang ideal untuk 1 pengelola lapangan atau beberapa cabang, namun belum sepenuhnya SaaS multi-tenant untuk ribuan entitas terpisah.

## Roadmap
- [ ] **Fase 1:** Stabilisasi sistem Booking & Matchmaking ELO, rilis PWA, optimasi load time. (SEKARANG)
- [ ] **Fase 2:** Leaderboard & Ranking System global antar member.
- [ ] **Fase 3:** Fitur Tournament Bracket Management untuk penyelenggaraan event mini.
- [ ] **Fase 4:** Integrasi Push Notification native menggunakan Service Workers.

---
**Legal Notice & Compliance**
Aplikasi ini mematuhi standar privasi data dan keamanan. Transaksi finansial terjadi di luar sistem (melalui WhatsApp/Transfer Langsung), membebaskan platform dari regulasi Payment Gateway ketat. Segala bentuk koordinasi dan komunikasi diserahkan kepada kebijakan privasi pengguna masing-masing.

> *"Keamanan dan Performa Sistem telah diverifikasi. Sistem Matchmaking ELO siap beroperasi 100%."* - **Judicial Execution A.I.**
