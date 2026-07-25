import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { KonteksAuth, type NilaiAuth } from '@/context/auth-context'
import { cocokKredensial, SUPER_ADMIN_TIRUAN } from '@/data/kredensial-tiruan'
import type { IsianLogin, SuperAdmin } from '@/types/auth'

/**
 * Sesi super admin selama aplikasi berjalan.
 *
 * Kredensialnya masih dicocokkan di sisi klien — endpoint
 * `POST /api/auth/login` belum ada. Saat endpointnya siap, `masuk` yang
 * diganti panggilan API; halaman dan guard-nya tidak perlu ikut berubah.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<SuperAdmin | null>(null)

  const masuk = useCallback((isian: IsianLogin): string | null => {
    if (!cocokKredensial(isian)) {
      return 'Email atau password salah.'
    }

    setAdmin(SUPER_ADMIN_TIRUAN)
    return null
  }, [])

  const keluar = useCallback(() => setAdmin(null), [])

  const nilai = useMemo<NilaiAuth>(
    () => ({ admin, sudahMasuk: admin !== null, masuk, keluar }),
    [admin, masuk, keluar],
  )

  return <KonteksAuth value={nilai}>{children}</KonteksAuth>
}
