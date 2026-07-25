import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { KonteksAuth, type NilaiAuth } from '@/context/auth-context'
import { ambilToken, ApiError, hapusToken, simpanToken } from '@/lib/api'
import { keluarApi, masukApi } from '@/services/auth'
import type { IsianLogin, SuperAdmin } from '@/types/auth'

/** Profil admin disimpan berdampingan dengan tokennya di localStorage. */
const KUNCI_ADMIN = 'admin-profil'

/**
 * Pulihkan sesi dari localStorage. Token dan profil harus dua-duanya ada —
 * kalau salah satunya hilang, sesinya dianggap tidak sah.
 *
 * Sinkron, jadi guard tidak pernah sempat melihat keadaan "belum masuk" lebih
 * dulu dan salah mengalihkan ke login saat halaman dimuat ulang. Keabsahan
 * tokennya sendiri diputuskan server: permintaan pertama yang dijawab 401
 * membuang sesi ini lewat interceptor.
 */
function pulihkanSesi(): SuperAdmin | null {
  if (!ambilToken()) return null

  const tersimpan = localStorage.getItem(KUNCI_ADMIN)
  if (!tersimpan) return null

  try {
    const admin = JSON.parse(tersimpan) as Partial<SuperAdmin>
    if (
      typeof admin.id !== 'string' ||
      typeof admin.nama !== 'string' ||
      typeof admin.email !== 'string'
    ) {
      return null
    }
    return { id: admin.id, nama: admin.nama, email: admin.email }
  } catch {
    // Isinya rusak — perlakukan seperti belum masuk.
    return null
  }
}

function buangSesiLokal(): void {
  hapusToken()
  localStorage.removeItem(KUNCI_ADMIN)
}

/**
 * Sesi super admin: menyimpan token dan profil dari `POST /api/auth/login`,
 * memulihkannya saat halaman dibuka lagi, dan membuangnya saat keluar.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<SuperAdmin | null>(pulihkanSesi)

  const masuk = useCallback(async (isian: IsianLogin): Promise<string | null> => {
    try {
      const hasil = await masukApi(isian)

      simpanToken(hasil.token)
      localStorage.setItem(KUNCI_ADMIN, JSON.stringify(hasil.admin))
      setAdmin(hasil.admin)
      return null
    } catch (err) {
      buangSesiLokal()
      setAdmin(null)

      if (err instanceof ApiError) {
        return err.message
      }
      // Jaringan mati atau server tidak menjawab — bedakan dari kredensial salah.
      return 'Tidak bisa menghubungi server. Coba lagi sebentar lagi.'
    }
  }, [])

  const buangSesi = useCallback((): void => {
    buangSesiLokal()
    setAdmin(null)
  }, [])

  const keluar = useCallback(async (): Promise<void> => {
    try {
      // Dipanggil selagi tokennya masih tersimpan — server perlu tahu token
      // mana yang dibatalkan.
      await keluarApi()
    } catch {
      // Server tidak terjangkau atau tokennya sudah ditolak: sesi lokal tetap
      // harus dibuang, jadi galatnya sengaja tidak dilempar ulang.
    } finally {
      buangSesiLokal()
      setAdmin(null)
    }
  }, [])

  const nilai = useMemo<NilaiAuth>(
    () => ({ admin, sudahMasuk: admin !== null, masuk, keluar, buangSesi }),
    [admin, masuk, keluar, buangSesi],
  )

  return <KonteksAuth value={nilai}>{children}</KonteksAuth>
}
