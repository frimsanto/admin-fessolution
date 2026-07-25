import { useMemo, useState } from 'react'

import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { FilterTenant } from '@/components/tenant/FilterTenant'
import { TabelTenant } from '@/components/tenant/TabelTenant'
import { BannerDataTiruan, KeadaanGagal, KerangkaTabel } from '@/components/ui/KeadaanMuat'
import { useDaftarTenant } from '@/hooks/useDaftarTenant'
import {
  adaFilterAktif,
  FILTER_AWAL,
  saringTenant,
  type FilterTenant as NilaiFilter,
} from '@/lib/filter-tenant'

export function DaftarTenantPage() {
  const { memuat, daftar: semuaTenant, pesanGagal, pakaiDataTiruan, muatUlang } = useDaftarTenant()

  const [filter, setFilter] = useState<NilaiFilter>(FILTER_AWAL)

  const daftar = useMemo(() => saringTenant(semuaTenant, filter), [semuaTenant, filter])
  const disaring = adaFilterAktif(filter)

  const deskripsi = memuat
    ? 'Memuat data tenant…'
    : pesanGagal
      ? 'Data tenant tidak dapat ditampilkan.'
      : disaring
        ? `Menampilkan ${daftar.length} dari ${semuaTenant.length} tenant.`
        : `${semuaTenant.length} tenant terdaftar di seluruh aplikasi platform.`

  return (
    <>
      <JudulHalaman
        judul="Manajemen Tenant"
        deskripsi={deskripsi}
        aksi={
          pakaiDataTiruan && (
            <span className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs text-ink-faint">
              Data tiruan
            </span>
          )
        }
      />

      {pakaiDataTiruan && <BannerDataTiruan />}

      {memuat ? (
        <KerangkaTabel />
      ) : pesanGagal ? (
        <KeadaanGagal pesan={pesanGagal} onCobaLagi={muatUlang} />
      ) : (
        <>
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
      )}
    </>
  )
}
