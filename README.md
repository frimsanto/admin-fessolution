# Super Admin Panel — FES Solution

Panel khusus pemilik platform FES Solution untuk mengelola aplikasi SaaS (CafeOS,
BilliardOS, dst), tenant, billing manual, dan broadcast. **Bukan** untuk diakses tenant.

- Domain target: `admin.fessolution.my.id`
- VPS: `202.155.13.191` (Nginx + PM2)
- Backend port: `4002` (4000 = fes-backend, 4001 = cafe-backend)

## Struktur

```
backend/    Express.js + TypeScript + Prisma (PostgreSQL `platform_admin`) — port 4002
frontend/   React + Vite + Tailwind v4 + Framer Motion — port 5175
```

## Menjalankan frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5175
```

`/api` di-proxy ke `http://localhost:4002` saat dev. Untuk production set
`VITE_API_BASE_URL=https://admin.fessolution.my.id/api`.

> Port dev sengaja 5175 (`strictPort`) karena 5173 dipakai CafeOS di mesin dev.

### Desain

Dark premium — latar `#0a0a0f`, aksen ungu `#7c3aed`, kartu bergaris
`rgba(255,255,255,0.06)`, font Geist. Token-nya ada di
[src/index.css](frontend/src/index.css) (`@theme`), sidebar icon-only 60px dengan
tooltip, transisi halaman & reveal kartu pakai Framer Motion. Semua teks UI
berbahasa Indonesia.

Token JWT super admin dibaca dari `localStorage['admin-token']` oleh
[src/lib/api.ts](frontend/src/lib/api.ts) — auth-nya sendiri belum dibuat.

## Menjalankan backend

```bash
cd backend
cp .env.example .env      # isi DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate deploy # buat tabel di database platform_admin
npm run dev               # http://localhost:4002
```

Perintah lain: `npm run build` (prisma generate + tsc), `npm start` (jalankan `dist/`),
`npm run typecheck`.

> Prisma 7: connection string tidak lagi di `schema.prisma`, melainkan di
> [prisma.config.ts](backend/prisma.config.ts) dan lewat driver adapter `@prisma/adapter-pg`.

## Endpoint tersedia

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/api/health` | Cek API hidup |
| GET | `/api/dashboard/ringkasan` | Ringkasan Dashboard Overview (blok `tenant` + `aplikasi`) |
| GET | `/api/dashboard/statistik-tenant` | Statistik tenant (total, per status, baru bulan ini, akan expired 7 hari, per aplikasi) |
| GET | `/api/dashboard/daftar-aplikasi` | Daftar aplikasi SaaS: total, jumlah berjalan/nonaktif, dan jumlah tenant per aplikasi |
