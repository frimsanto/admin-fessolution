import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '@/lib/api'
import { ambilStatistikAplikasi } from '@/services/aplikasi'
import { ambilRiwayatPembayaran } from '@/services/billing'
import type { StatistikAplikasiResponse } from '@/types/aplikasi'
import type { DaftarPembayaranResponse } from '@/types/pembayaran'

type KeadaanStatistik = {
  memuat: boolean
  statistik: StatistikAplikasiResponse | null
  /** Riwayat pembayaran aplikasi ini saja. */
  riwayat: DaftarPembayaranResponse | null
  /** Backend menjawab 404 — aplikasinya memang tidak ada. */
  tidakDitemukan: boolean
  pesanGagal: string | null
}

const AWAL: KeadaanStatistik = {
  memuat: true,
  statistik: null,
  riwayat: null,
  tidakDitemukan: false,
  pesanGagal: null,
}

/**
 * Statistik satu aplikasi. Endpoint `stats` tidak memuat rincian pembayarannya,
 * jadi riwayatnya diambil dari endpoint billing dengan filter slug yang sama.
 */
export function useStatistikAplikasi(slug: string | undefined) {
  const [keadaan, setKeadaan] = useState<KeadaanStatistik>(AWAL)
  const [pemicuUlang, setPemicuUlang] = useState(0)

  const muatUlang = useCallback(() => setPemicuUlang((n) => n + 1), [])

  useEffect(() => {
    if (!slug) {
      setKeadaan({ ...AWAL, memuat: false, tidakDitemukan: true })
      return
    }

    const kontrol = new AbortController()
    setKeadaan((lama) => ({ ...lama, memuat: true, pesanGagal: null }))

    Promise.all([
      ambilStatistikAplikasi(slug, kontrol.signal),
      ambilRiwayatPembayaran({ aplikasi: slug }, kontrol.signal),
    ])
      .then(([statistik, riwayat]) => {
        setKeadaan({
          memuat: false,
          statistik,
          riwayat,
          tidakDitemukan: false,
          pesanGagal: null,
        })
      })
      .catch((err: unknown) => {
        if (kontrol.signal.aborted) return

        // 404 adalah jawaban yang sah: aplikasinya memang tidak ada.
        if (err instanceof ApiError && err.status === 404) {
          setKeadaan({ ...AWAL, memuat: false, tidakDitemukan: true })
          return
        }

        setKeadaan({
          ...AWAL,
          memuat: false,
          pesanGagal: err instanceof Error ? err.message : 'Gagal memuat statistik aplikasi',
        })
      })

    return () => kontrol.abort()
  }, [slug, pemicuUlang])

  return { ...keadaan, muatUlang }
}
