import { createContext, useContext } from 'react'

import type { IsianLogin, SuperAdmin } from '@/types/auth'

export type NilaiAuth = {
  /** null berarti belum masuk. */
  admin: SuperAdmin | null
  sudahMasuk: boolean
  /** Mengembalikan null kalau berhasil, atau pesan galat kalau kredensial ditolak. */
  masuk: (isian: IsianLogin) => string | null
  keluar: () => void
}

export const KonteksAuth = createContext<NilaiAuth | null>(null)

export function useAuth(): NilaiAuth {
  const nilai = useContext(KonteksAuth)
  if (!nilai) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider')
  }
  return nilai
}
