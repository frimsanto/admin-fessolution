import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { KonteksPengumuman, type NilaiPengumuman } from '@/context/pengumuman-context'
import { PENGUMUMAN_TIRUAN } from '@/data/pengumuman-tiruan'
import type { IsianPengumuman, Pengumuman } from '@/types/pengumuman'
import type { AplikasiRingkas } from '@/types/tenant'

/**
 * Menyimpan riwayat pengumuman selama sesi berjalan, supaya pengumuman yang
 * baru dikirim langsung terlihat di halaman Broadcast maupun Riwayat.
 *
 * Isinya masih disemai dari data tiruan dan hilang begitu halaman dimuat
 * ulang — endpoint broadcast belum ada. Saat endpointnya siap, provider ini
 * yang diganti panggilan API, bukan halaman-halamannya.
 */
export function PengumumanProvider({ children }: { children: ReactNode }) {
  const [daftar, setDaftar] = useState<Pengumuman[]>(PENGUMUMAN_TIRUAN)

  const kirim = useCallback(
    (isian: IsianPengumuman, aplikasi: AplikasiRingkas | null): Pengumuman => {
      const baru: Pengumuman = {
        id: `bc-lokal-${crypto.randomUUID()}`,
        aplikasi,
        judul: isian.judul,
        pesan: isian.pesan,
        dikirimPada: new Date().toISOString(),
      }

      setDaftar((lama) => [baru, ...lama])
      return baru
    },
    [],
  )

  const nilai = useMemo<NilaiPengumuman>(() => ({ daftar, kirim }), [daftar, kirim])

  return <KonteksPengumuman value={nilai}>{children}</KonteksPengumuman>
}
