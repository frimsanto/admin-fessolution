import { createContext, useContext } from 'react'

import type { IsianLogin, SuperAdmin } from '@/types/auth'

export type NilaiAuth = {
  /** null berarti belum masuk. */
  admin: SuperAdmin | null
  sudahMasuk: boolean
  /** Mengembalikan null kalau berhasil, atau pesan galat kalau kredensial ditolak. */
  masuk: (isian: IsianLogin) => Promise<string | null>
  /** Membatalkan token di server lalu membuang sesi lokal. */
  keluar: () => Promise<void>
  /**
   * Buang sesi lokal saja, tanpa memanggil server. Dipakai saat server sudah
   * menolak tokennya (401) — memanggil logout di situ percuma dan malah
   * memicu 401 berikutnya.
   */
  buangSesi: () => void
}

export const KonteksAuth = createContext<NilaiAuth | null>(null)

export function useAuth(): NilaiAuth {
  const nilai = useContext(KonteksAuth)
  if (!nilai) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider')
  }
  return nilai
}
