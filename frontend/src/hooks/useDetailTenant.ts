import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '@/lib/api'
import { ambilDetailTenant } from '@/services/tenant'
import type { Tenant } from '@/types/tenant'

type KeadaanDetail = {
  memuat: boolean
  tenant: Tenant | null
  /** Backend menjawab 404 — tenant memang tidak ada. */
  tidakDitemukan: boolean
  pesanGagal: string | null
}

const AWAL: KeadaanDetail = {
  memuat: true,
  tenant: null,
  tidakDitemukan: false,
  pesanGagal: null,
}

export function useDetailTenant(id: string | undefined) {
  const [keadaan, setKeadaan] = useState<KeadaanDetail>(AWAL)
  const [pemicuUlang, setPemicuUlang] = useState(0)

  const muatUlang = useCallback(() => setPemicuUlang((n) => n + 1), [])

  useEffect(() => {
    if (!id) {
      setKeadaan({ ...AWAL, memuat: false, tidakDitemukan: true })
      return
    }

    const kontrol = new AbortController()
    setKeadaan((lama) => ({ ...lama, memuat: true, pesanGagal: null }))

    ambilDetailTenant(id, kontrol.signal)
      .then((tenant) => {
        setKeadaan({
          memuat: false,
          tenant,
          tidakDitemukan: false,
          pesanGagal: null,
        })
      })
      .catch((err: unknown) => {
        if (kontrol.signal.aborted) return

        // 404 adalah jawaban yang sah: tenantnya memang tidak ada.
        if (err instanceof ApiError && err.status === 404) {
          setKeadaan({ ...AWAL, memuat: false, tidakDitemukan: true })
          return
        }

        setKeadaan({
          ...AWAL,
          memuat: false,
          pesanGagal: err instanceof Error ? err.message : 'Gagal memuat detail tenant',
        })
      })

    return () => kontrol.abort()
  }, [id, pemicuUlang])

  return { ...keadaan, muatUlang }
}
