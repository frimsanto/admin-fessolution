import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { TabelTenant } from '@/components/tenant/TabelTenant'
import { TENANT_TIRUAN } from '@/data/tenant-tiruan'

export function DaftarTenantPage() {
  // Data tiruan — diganti panggilan API pada task "Hubungkan halaman daftar tenant ke API".
  const daftar = TENANT_TIRUAN

  return (
    <>
      <JudulHalaman
        judul="Manajemen Tenant"
        deskripsi={`${daftar.length} tenant terdaftar di seluruh aplikasi platform.`}
        aksi={
          <span className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs text-ink-faint">
            Data tiruan
          </span>
        }
      />

      <TabelTenant daftar={daftar} />
    </>
  )
}
