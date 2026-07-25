import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { KonteksAuth, type NilaiAuth } from '@/context/auth-context'
import { cocokKredensial, SUPER_ADMIN_TIRUAN } from '@/data/kredensial-tiruan'
import { ambilToken, hapusToken, simpanToken } from '@/lib/api'
import type { IsianLogin, SuperAdmin } from '@/types/auth'

/** Profil admin disimpan berdampingan dengan tokennya di localStorage. */
const KUNCI_ADMIN = 'admin-profil'

/**
 * Pulihkan sesi dari localStorage. Token dan profil harus dua-duanya ada —
 * kalau salah satunya hilang, sesinya dianggap tidak sah.
 *
 * Sinkron, jadi guard tidak pernah sempat melihat keadaan "belum masuk" lebih
 * dulu dan salah mengalihkan ke login saat halaman dimuat ulang.
 */
function pulihkanSesi(): SuperAdmin | null {
  if (!ambilToken()) return null

  const tersimpan = localStorage.getItem(KUNCI_ADMIN)
  if (!tersimpan) return null

  try {
    const admin = JSON.parse(tersimpan) as Partial<SuperAdmin>
    if (typeof admin.id !== 'string' || typeof admin.email !== 'string') return null
    return { id: admin.id, email: admin.email }
  } catch {
    // Isinya rusak — perlakukan seperti belum masuk.
    return null
  }
}

/**
 * Sesi super admin: menyimpan token dan profil, memulihkannya saat halaman
 * dibuka lagi, dan membuangnya saat keluar.
 *
 * Kredensialnya masih dicocokkan di sisi klien dan tokennya tiruan —
 * `POST /api/auth/login` belum ada di backend. Saat endpointnya siap, `masuk`
 * yang diganti panggilan API; halaman, guard, dan interceptor tidak berubah.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<SuperAdmin | null>(pulihkanSesi)

  const masuk = useCallback((isian: IsianLogin): string | null => {
    if (!cocokKredensial(isian)) {
      return 'Email atau password salah.'
    }

    // Token tiruan supaya alur penyimpanan dan pengiriman header sudah terpakai
    // sejak sekarang; nanti tinggal diganti token asli dari backend.
    simpanToken(`tiruan.${crypto.randomUUID()}`)
    localStorage.setItem(KUNCI_ADMIN, JSON.stringify(SUPER_ADMIN_TIRUAN))
    setAdmin(SUPER_ADMIN_TIRUAN)
    return null
  }, [])

  const keluar = useCallback(() => {
    hapusToken()
    localStorage.removeItem(KUNCI_ADMIN)
    setAdmin(null)
  }, [])

  const nilai = useMemo<NilaiAuth>(
    () => ({ admin, sudahMasuk: admin !== null, masuk, keluar }),
    [admin, masuk, keluar],
  )

  return <KonteksAuth value={nilai}>{children}</KonteksAuth>
}
