import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { BillingPage } from '@/pages/BillingPage'
import { BroadcastPage } from '@/pages/BroadcastPage'
import { DaftarAplikasiPage } from '@/pages/DaftarAplikasiPage'
import { DaftarTenantPage } from '@/pages/DaftarTenantPage'
import { DetailTenantPage } from '@/pages/DetailTenantPage'
import { HalamanSegeraHadir } from '@/pages/HalamanSegeraHadir'
import { RiwayatPengumumanPage } from '@/pages/RiwayatPengumumanPage'
import { StatistikAplikasiPage } from '@/pages/StatistikAplikasiPage'

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
        <Route path="aplikasi" element={<DaftarAplikasiPage />} />
        <Route path="aplikasi/:slug/statistik" element={<StatistikAplikasiPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="broadcast" element={<BroadcastPage />} />
        <Route path="broadcast/riwayat" element={<RiwayatPengumumanPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
