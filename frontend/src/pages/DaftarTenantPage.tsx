import { useMemo, useState } from 'react'

import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { FilterTenant } from '@/components/tenant/FilterTenant'
import { TabelTenant } from '@/components/tenant/TabelTenant'
import { TENANT_TIRUAN } from '@/data/tenant-tiruan'
import {
  adaFilterAktif,
  FILTER_AWAL,
  saringTenant,
  type FilterTenant as NilaiFilter,
} from '@/lib/filter-tenant'

export function DaftarTenantPage() {
  // Data tiruan — diganti panggilan API pada task "Hubungkan halaman daftar tenant ke API".
  const semuaTenant = TENANT_TIRUAN

  const [filter, setFilter] = useState<NilaiFilter>(FILTER_AWAL)

  const daftar = useMemo(() => saringTenant(semuaTenant, filter), [semuaTenant, filter])
  const disaring = adaFilterAktif(filter)

  const deskripsi = disaring
    ? `Menampilkan ${daftar.length} dari ${semuaTenant.length} tenant.`
    : `${semuaTenant.length} tenant terdaftar di seluruh aplikasi platform.`

  return (
    <>
      <JudulHalaman
        judul="Manajemen Tenant"
        deskripsi={deskripsi}
        aksi={
          <span className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs text-ink-faint">
            Data tiruan
          </span>
        }
      />

      <FilterTenant semuaTenant={semuaTenant} nilai={filter} onUbah={setFilter} />

      <TabelTenant
        daftar={daftar}
        kunciAnimasi={`${filter.aplikasi}-${filter.status}`}
        pesanKosong={
          disaring
            ? {
                judul: 'Tidak ada tenant yang cocok',
                detail: 'Coba longgarkan filter aplikasi atau statusnya.',
              }
            : undefined
        }
      />
    </>
  )
}
