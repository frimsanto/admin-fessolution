import type { Aplikasi } from '@/types/aplikasi'
import type { Pembayaran } from '@/types/pembayaran'
import type { Tenant } from '@/types/tenant'

export type StatistikAplikasi = {
  totalPendapatan: number
  jumlahPembayaran: number
  /** null kalau aplikasi ini belum pernah menerima pembayaran. */
  pembayaranTerakhir: string | null
  totalTenant: number
  tenantAktif: number
  /** Tenant milik aplikasi ini, untuk rincian status. */
  tenant: Tenant[]
  pembayaran: Pembayaran[]
}

export function hitungStatistikAplikasi(
  aplikasi: Aplikasi,
  semuaTenant: Tenant[],
  semuaPembayaran: Pembayaran[],
): StatistikAplikasi {
  const tenant = semuaTenant.filter((item) => item.aplikasi.slug === aplikasi.slug)
  const pembayaran = semuaPembayaran
    .filter((item) => item.aplikasi.slug === aplikasi.slug)
    .sort((a, b) => new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime())

  return {
    totalPendapatan: pembayaran.reduce((jumlah, item) => jumlah + item.jumlah, 0),
    jumlahPembayaran: pembayaran.length,
    pembayaranTerakhir: pembayaran[0]?.tanggalBayar ?? null,
    totalTenant: tenant.length,
    tenantAktif: tenant.filter((item) => item.status === 'AKTIF').length,
    tenant,
    pembayaran,
  }
}

export function cariAplikasiPerSlug(daftar: Aplikasi[], slug: string | undefined) {
  if (!slug) return undefined
  return daftar.find((aplikasi) => aplikasi.slug === slug)
}
