import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { DaftarTenantPage } from '@/pages/DaftarTenantPage'
import { DetailTenantPage } from '@/pages/DetailTenantPage'
import { HalamanSegeraHadir } from '@/pages/HalamanSegeraHadir'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          index
          element={
            <HalamanSegeraHadir
              judul="Dashboard"
              deskripsi="Ringkasan pendapatan, tenant, dan aplikasi platform."
              catatan="API-nya sudah siap di /api/dashboard/ringkasan, tapi task untuk halamannya belum ada di backlog."
            />
          }
        />
        <Route path="tenant" element={<DaftarTenantPage />} />
        <Route path="tenant/:id" element={<DetailTenantPage />} />
        <Route
          path="aplikasi"
          element={
            <HalamanSegeraHadir
              judul="Manajemen Aplikasi"
              deskripsi="Kelola aplikasi SaaS yang berjalan di platform."
            />
          }
        />
        <Route
          path="billing"
          element={
            <HalamanSegeraHadir
              judul="Billing & Pembayaran"
              deskripsi="Status langganan, konfirmasi pembayaran, dan riwayat tenant."
            />
          }
        />
        <Route
          path="broadcast"
          element={
            <HalamanSegeraHadir
              judul="Notifikasi & Broadcast"
              deskripsi="Kirim pengumuman ke seluruh tenant atau per aplikasi."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
