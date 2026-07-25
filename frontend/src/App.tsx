import { Navigate, Route, Routes } from 'react-router-dom'

import { TamuSaja } from '@/components/auth/TamuSaja'
import { AppShell } from '@/components/layout/AppShell'
import { AuthProvider } from '@/context/AuthProvider'
import { PengumumanProvider } from '@/context/PengumumanProvider'
import { BillingPage } from '@/pages/BillingPage'
import { BroadcastPage } from '@/pages/BroadcastPage'
import { DaftarAplikasiPage } from '@/pages/DaftarAplikasiPage'
import { DaftarTenantPage } from '@/pages/DaftarTenantPage'
import { DetailTenantPage } from '@/pages/DetailTenantPage'
import { HalamanSegeraHadir } from '@/pages/HalamanSegeraHadir'
import { LoginPage } from '@/pages/LoginPage'
import { RiwayatPengumumanPage } from '@/pages/RiwayatPengumumanPage'
import { StatistikAplikasiPage } from '@/pages/StatistikAplikasiPage'

export default function App() {
  return (
    <AuthProvider>
      {/* Riwayat pengumuman dipegang di atas router supaya halaman Broadcast
          dan Riwayat melihat daftar yang sama saat berpindah. */}
      <PengumumanProvider>
        <Routes>
          {/* Di luar AppShell: halaman login tampil tanpa sidebar. */}
          <Route element={<TamuSaja />}>
            <Route path="login" element={<LoginPage />} />
          </Route>

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
      </PengumumanProvider>
    </AuthProvider>
  )
}
