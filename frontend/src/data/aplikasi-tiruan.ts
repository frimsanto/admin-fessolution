import { APLIKASI_TIRUAN, TENANT_TIRUAN } from '@/data/tenant-tiruan'
import type { Aplikasi } from '@/types/aplikasi'

/** Data tiruan sementara — diganti panggilan API saat endpoint aplikasi tersedia. */

const MS_HARI = 86_400_000
const sekarang = Date.now()

/** Status berjalan/nonaktif per slug. LaundryOS sengaja dibuat nonaktif. */
const AKTIF_PER_SLUG: Record<string, boolean> = {
  cafeos: true,
  billiardos: true,
  laundryos: false,
}

const UMUR_HARI: Record<string, number> = {
  cafeos: 540,
  billiardos: 260,
  laundryos: 70,
}

/**
 * Angka tenant diturunkan dari TENANT_TIRUAN, bukan ditulis ulang, supaya
 * kedua data tiruan tidak pernah bertentangan.
 */
export const DAFTAR_APLIKASI_TIRUAN: Aplikasi[] = APLIKASI_TIRUAN.map((aplikasi) => {
  const tenantnya = TENANT_TIRUAN.filter((tenant) => tenant.aplikasi.slug === aplikasi.slug)

  return {
    appId: aplikasi.appId,
    nama: aplikasi.nama,
    slug: aplikasi.slug,
    aktif: AKTIF_PER_SLUG[aplikasi.slug] ?? true,
    jumlahTenant: tenantnya.length,
    jumlahTenantAktif: tenantnya.filter((tenant) => tenant.status === 'AKTIF').length,
    dibuatPada: new Date(sekarang - (UMUR_HARI[aplikasi.slug] ?? 90) * MS_HARI).toISOString(),
  }
}).sort((a, b) => Number(b.aktif) - Number(a.aktif) || a.nama.localeCompare(b.nama, 'id'))
