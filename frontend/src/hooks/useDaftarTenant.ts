import { useCallback, useEffect, useState } from 'react'

import { ambilDaftarTenant } from '@/services/tenant'
import type { Tenant } from '@/types/tenant'

type KeadaanTenant = {
  memuat: boolean
  daftar: Tenant[]
  pesanGagal: string | null
}

const AWAL: KeadaanTenant = {
  memuat: true,
  daftar: [],
  pesanGagal: null,
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
        setKeadaan({ memuat: false, daftar: hasil.daftar, pesanGagal: null })
      })
      .catch((err: unknown) => {
        if (kontrol.signal.aborted) return

        setKeadaan({
          memuat: false,
          daftar: [],
          pesanGagal: err instanceof Error ? err.message : 'Gagal memuat data tenant',
        })
      })

    return () => kontrol.abort()
  }, [pemicuUlang])

  return { ...keadaan, muatUlang }
}
