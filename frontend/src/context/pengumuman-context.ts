import { createContext, useContext } from 'react'

import type { IsianPengumuman, Pengumuman } from '@/types/pengumuman'
import type { AplikasiRingkas } from '@/types/tenant'

export type NilaiPengumuman = {
  /** Riwayat pengumuman, terbaru belum tentu di depan — komponen yang mengurutkan. */
  daftar: Pengumuman[]
  /**
   * Catat pengumuman baru. `aplikasi` null berarti dikirim ke seluruh aplikasi;
   * pemanggilnya yang mencocokkan `isian.appId` ke aplikasi karena formulir
   * hanya memegang id-nya.
   */
  kirim: (isian: IsianPengumuman, aplikasi: AplikasiRingkas | null) => Pengumuman
}

export const KonteksPengumuman = createContext<NilaiPengumuman | null>(null)

export function usePengumuman(): NilaiPengumuman {
  const nilai = useContext(KonteksPengumuman)
  if (!nilai) {
    throw new Error('usePengumuman harus dipakai di dalam PengumumanProvider')
  }
  return nilai
}
