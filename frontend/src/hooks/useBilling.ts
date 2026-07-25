import { useCallback, useEffect, useState } from 'react'

import {
  ambilPeringatanMasaAktif,
  ambilRiwayatPembayaran,
  ambilStatusLangganan,
} from '@/services/billing'
import type { PeringatanResponse, StatusLanggananResponse } from '@/types/billing'
import type { DaftarPembayaranResponse } from '@/types/pembayaran'

type KeadaanBilling = {
  memuat: boolean
  statusLangganan: StatusLanggananResponse | null
  peringatan: PeringatanResponse | null
  riwayat: DaftarPembayaranResponse | null
  pesanGagal: string | null
}

const AWAL: KeadaanBilling = {
  memuat: true,
  statusLangganan: null,
  peringatan: null,
  riwayat: null,
  pesanGagal: null,
}

/**
 * Tiga bagian halaman Billing dimuat sekaligus supaya isinya tidak muncul
 * bertahap dengan tiga indikator berbeda. Satu permintaan gagal berarti seluruh
 * halaman menampilkan kegagalan — lebih jujur daripada menampilkan sebagian
 * angka yang tidak konsisten satu sama lain.
 */
export function useBilling() {
  const [keadaan, setKeadaan] = useState<KeadaanBilling>(AWAL)
  const [pemicuUlang, setPemicuUlang] = useState(0)

  const muatUlang = useCallback(() => setPemicuUlang((n) => n + 1), [])

  useEffect(() => {
    const kontrol = new AbortController()
    setKeadaan((lama) => ({ ...lama, memuat: true, pesanGagal: null }))

    Promise.all([
      ambilStatusLangganan(undefined, kontrol.signal),
      ambilPeringatanMasaAktif(undefined, kontrol.signal),
      ambilRiwayatPembayaran({}, kontrol.signal),
    ])
      .then(([statusLangganan, peringatan, riwayat]) => {
        setKeadaan({
          memuat: false,
          statusLangganan,
          peringatan,
          riwayat,
          pesanGagal: null,
        })
      })
      .catch((err: unknown) => {
        if (kontrol.signal.aborted) return

        setKeadaan({
          ...AWAL,
          memuat: false,
          pesanGagal: err instanceof Error ? err.message : 'Gagal memuat data billing',
        })
      })

    return () => kontrol.abort()
  }, [pemicuUlang])

  return { ...keadaan, muatUlang }
}
