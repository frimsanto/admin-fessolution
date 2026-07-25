import { useCallback, useEffect, useState } from 'react'

import { ambilDaftarAplikasi } from '@/services/aplikasi'
import type { Aplikasi } from '@/types/aplikasi'

type KeadaanAplikasi = {
  memuat: boolean
  daftar: Aplikasi[]
  pesanGagal: string | null
}

const AWAL: KeadaanAplikasi = {
  memuat: true,
  daftar: [],
  pesanGagal: null,
}

export function useDaftarAplikasi() {
  const [keadaan, setKeadaan] = useState<KeadaanAplikasi>(AWAL)
  const [pemicuUlang, setPemicuUlang] = useState(0)

  const muatUlang = useCallback(() => setPemicuUlang((n) => n + 1), [])

  /**
   * Pasang aplikasi hasil toggle/tambah ke daftar tanpa memuat ulang seluruh
   * halaman — backend sudah mengembalikan bentuk yang sama dengan `GET /api/apps`.
   */
  const gantiAplikasi = useCallback((aplikasi: Aplikasi) => {
    setKeadaan((lama) => ({
      ...lama,
      daftar: lama.daftar.map((item) => (item.appId === aplikasi.appId ? aplikasi : item)),
    }))
  }, [])

  const tambahKeDaftar = useCallback((aplikasi: Aplikasi) => {
    setKeadaan((lama) => ({ ...lama, daftar: [aplikasi, ...lama.daftar] }))
  }, [])

  useEffect(() => {
    const kontrol = new AbortController()
    setKeadaan((lama) => ({ ...lama, memuat: true, pesanGagal: null }))

    ambilDaftarAplikasi(kontrol.signal)
      .then((hasil) => {
        setKeadaan({ memuat: false, daftar: hasil.daftar, pesanGagal: null })
      })
      .catch((err: unknown) => {
        if (kontrol.signal.aborted) return

        setKeadaan({
          memuat: false,
          daftar: [],
          pesanGagal: err instanceof Error ? err.message : 'Gagal memuat daftar aplikasi',
        })
      })

    return () => kontrol.abort()
  }, [pemicuUlang])

  return { ...keadaan, muatUlang, gantiAplikasi, tambahKeDaftar }
}
