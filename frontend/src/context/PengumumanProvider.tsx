import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { useAuth } from '@/context/auth-context'
import { KonteksPengumuman, type NilaiPengumuman } from '@/context/pengumuman-context'
import { ambilRiwayatPengumuman, kirimPengumuman } from '@/services/pengumuman'
import type { IsianPengumuman, Pengumuman } from '@/types/pengumuman'

/**
 * Riwayat pengumuman dari backend, dipegang di atas router supaya halaman
 * Broadcast dan Riwayat melihat daftar yang sama saat berpindah.
 *
 * Sumbernya `GET /api/broadcast`, jadi isinya bertahan setelah halaman dimuat
 * ulang — sebelumnya daftar ini hanya hidup di memori dan hilang setiap F5.
 */
export function PengumumanProvider({ children }: { children: ReactNode }) {
  const { sudahMasuk } = useAuth()

  const [daftar, setDaftar] = useState<Pengumuman[]>([])
  const [memuat, setMemuat] = useState(false)
  const [pesanGagal, setPesanGagal] = useState<string | null>(null)
  const [pemicuUlang, setPemicuUlang] = useState(0)

  const muatUlang = useCallback(() => setPemicuUlang((n) => n + 1), [])

  useEffect(() => {
    // Riwayat ada di balik guard: tanpa sesi permintaannya pasti ditolak 401,
    // jadi jangan dikirim sama sekali dan kosongkan daftar yang tersisa.
    if (!sudahMasuk) {
      setDaftar([])
      setMemuat(false)
      setPesanGagal(null)
      return
    }

    const kontrol = new AbortController()
    setMemuat(true)
    setPesanGagal(null)

    ambilRiwayatPengumuman(kontrol.signal)
      .then((hasil) => {
        setDaftar(hasil.daftar)
        setMemuat(false)
      })
      .catch((err: unknown) => {
        if (kontrol.signal.aborted) return

        setDaftar([])
        setMemuat(false)
        setPesanGagal(err instanceof Error ? err.message : 'Gagal memuat riwayat pengumuman')
      })

    return () => kontrol.abort()
  }, [sudahMasuk, pemicuUlang])

  const kirim = useCallback(
    async (isian: IsianPengumuman, slugAplikasi: string | null): Promise<Pengumuman> => {
      const terkirim = await kirimPengumuman({
        judul: isian.judul,
        isi: isian.pesan,
        slugAplikasi,
      })

      // Backend mengurutkan terbaru lebih dulu; yang baru dikirim pasti paling depan.
      setDaftar((lama) => [terkirim, ...lama])
      return terkirim
    },
    [],
  )

  const nilai = useMemo<NilaiPengumuman>(
    () => ({ daftar, memuat, pesanGagal, muatUlang, kirim }),
    [daftar, memuat, pesanGagal, muatUlang, kirim],
  )

  return <KonteksPengumuman value={nilai}>{children}</KonteksPengumuman>
}
