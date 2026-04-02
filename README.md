# GDG on Campus IKCU — Stand Oyunları

QR kod ile erişilen, mobil-first, 5 interaktif oyundan oluşan web uygulaması. GDG on Campus IKCU standında etkinlik günü kullanılmak üzere geliştirilmiştir.

## Oyunlar

| # | Oyun | Açıklama |
|---|------|----------|
| 1 | Kart Eşleştirme | 4×4 gridde 8 çift teknolojiyi eşleştir (90sn, 3 can) |
| 2 | Kod Kırıcı | Teknoloji terimlerinin eksik harflerini doldur (5 kelime) |
| 3 | Bug Avı | Böcekleri yakala, teknoloji ikonlarına dokunma (30sn) |
| 4 | Sıralama Yarışı | Teknolojileri kronolojik sıraya diz (5 round) |
| 5 | GDG Quiz | Google ve teknoloji dünyası quizi (10 soru) |

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS — pnpm
- **Backend:** Express.js — bun
- **Database:** PostgreSQL

## Kurulum

### Gereksinimler

- Node.js 18+
- pnpm
- bun
- PostgreSQL

### Veritabanı

```bash
psql -c "CREATE DATABASE gdg_games_db"
psql gdg_games_db < server/db/init.sql
```

### Backend

```bash
cd server
cp .env.example .env  # DATABASE_URL'i düzenle
bun install
bun run dev
```

### Frontend

```bash
cd client
pnpm install
pnpm dev
```

Uygulama `http://localhost:5173` adresinde çalışır.

## Oyun Sistemi

- Her oyun için **3 deneme hakkı**, 5 dakikada bir yenilenir
- Her oyunun kendi **leaderboard**'u var (en yüksek skor)
- Kullanıcılar takma ad ile giriş yapar, UUID localStorage'da tutulur
