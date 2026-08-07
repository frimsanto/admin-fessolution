import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/layout/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'

export function AppShell() {
  const { terbuka, alihkan } = useSidebar()

  return (
    <div className="min-h-dvh">
      <Sidebar terbuka={terbuka} onAlihkan={alihkan} />

      {/* Padding mengikuti lebar sidebar: 60px saat tertutup, 224px saat terbuka. */}
      <main
        className={`transition-[padding] duration-200 ease-out ${terbuka ? 'pl-56' : 'pl-15'}`}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {/* Isi halaman digambar langsung, tanpa transisi masuk/keluar.
              Sebelumnya di sini ada <AnimatePresence mode="wait"> dengan
              <motion.div key={location.pathname} exit="keluar">. Pola itu
              menyandera halaman: <Outlet /> tidak ikut dikunci ke lokasi lama,
              jadi node yang sedang beranimasi keluar sudah berisi konten rute
              baru. Begitu callback selesai-keluar terlewat, node itu tidak
              pernah dilepas dan seluruh halaman tertinggal di style akhir
              animasi keluar — opacity: 0; transform: translateY(-6px). */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
