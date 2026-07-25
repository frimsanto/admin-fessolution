# Super Admin Panel — FES Solution

Panel khusus pemilik platform FES Solution untuk mengelola aplikasi SaaS (CafeOS,
BilliardOS, dst), tenant, billing manual, dan broadcast. **Bukan** untuk diakses tenant.

- Domain target: `admin.fessolution.my.id`
- VPS: `202.155.13.191` (Nginx + PM2)
- Backend port: `4002` (4000 = fes-backend, 4001 = cafe-backend)

## Struktur

```
backend/    Express.js + TypeScript + Prisma (PostgreSQL `platform_admin`)
frontend/   React + Vite + Tailwind CSS  (menyusul)
```

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
