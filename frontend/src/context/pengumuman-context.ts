import { createContext, useContext } from 'react'

import type { IsianPengumuman, Pengumuman } from '@/types/pengumuman'

export type NilaiPengumuman = {
  /** Riwayat pengumuman dari `GET /api/broadcast`, terbaru lebih dulu. */
  daftar: Pengumuman[]
  memuat: boolean
  /** Pesan kegagalan saat memuat riwayat; null kalau baik-baik saja. */
  pesanGagal: string | null
  muatUlang: () => void
  /**
   * Kirim pengumuman ke `POST /api/broadcast` lalu sisipkan hasilnya ke
   * riwayat. `slugAplikasi` null berarti dikirim ke seluruh aplikasi —
   * pemanggilnya yang menerjemahkan `isian.appId` menjadi slug, karena
   * formulir hanya memegang id-nya.
   *
   * Melempar ApiError kalau server menolak.
   */
  kirim: (isian: IsianPengumuman, slugAplikasi: string | null) => Promise<Pengumuman>
}

export const KonteksPengumuman = createContext<NilaiPengumuman | null>(null)

export function usePengumuman(): NilaiPengumuman {
  const nilai = useContext(KonteksPengumuman)
  if (!nilai) {
    throw new Error('usePengumuman harus dipakai di dalam PengumumanProvider')
  }
  return nilai
}
