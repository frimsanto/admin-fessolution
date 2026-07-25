import { useCallback, useEffect, useState } from 'react'

import { TENANT_TIRUAN } from '@/data/tenant-tiruan'
import { ambilDaftarTenant } from '@/services/tenant'
import type { Tenant } from '@/types/tenant'

type KeadaanTenant = {
  memuat: boolean
  daftar: Tenant[]
  pesanGagal: string | null
  /** true kalau isinya data tiruan karena API belum tersedia (khusus mode dev). */
  pakaiDataTiruan: boolean
}

const AWAL: KeadaanTenant = {
  memuat: true,
  daftar: [],
  pesanGagal: null,
  pakaiDataTiruan: false,
}

export function useDaftarTenant() {
  const [keadaan, setKeadaan] = useState<KeadaanTenant>(AWAL)
  const [pemicuUlang, setPemicuUlang] = useState(0)

  const muatUlang = useCallback(() => setPemicuUlang((n) => n + 1), [])

  useEffect(() => {
    const kontrol = new AbortController()
    setKeadaan((lama) => ({ ...lama, memuat: true, pesanGagal: null }))

    ambilDaftarTenant(kontrol.signal)
      .then((hasil) => {
        setKeadaan({
          memuat: false,
          daftar: hasil.daftar,
          pesanGagal: null,
          pakaiDataTiruan: false,
        })
      })
      .catch((err: unknown) => {
        if (kontrol.signal.aborted) return

        // Backend endpoint /api/tenant belum ada. Selama pengembangan, jatuhkan ke
        // data tiruan supaya halaman tetap bisa ditinjau — dan katakan terus terang
        // lewat banner. Di production kegagalan tetap ditampilkan sebagai error.
        if (import.meta.env.DEV) {
          setKeadaan({
            memuat: false,
            daftar: TENANT_TIRUAN,
            pesanGagal: null,
            pakaiDataTiruan: true,
          })
          return
        }

        setKeadaan({
          memuat: false,
          daftar: [],
          pesanGagal: err instanceof Error ? err.message : 'Gagal memuat data tenant',
          pakaiDataTiruan: false,
        })
      })

    return () => kontrol.abort()
  }, [pemicuUlang])

  return { ...keadaan, muatUlang }
}
