import type { AplikasiRingkas, StatusTenant, Tenant } from '@/types/tenant'

export const SEMUA = 'SEMUA' as const

export type PilihanAplikasi = typeof SEMUA | string
export type PilihanStatus = typeof SEMUA | StatusTenant

export type FilterTenant = {
  /** slug aplikasi, atau SEMUA */
  aplikasi: PilihanAplikasi
  status: PilihanStatus
}

export const FILTER_AWAL: FilterTenant = { aplikasi: SEMUA, status: SEMUA }

export const URUTAN_STATUS: StatusTenant[] = ['TRIAL', 'AKTIF', 'SUSPENDED', 'EXPIRED']

export function saringTenant(daftar: Tenant[], filter: FilterTenant): Tenant[] {
  return daftar.filter(
    (tenant) =>
      (filter.aplikasi === SEMUA || tenant.aplikasi.slug === filter.aplikasi) &&
      (filter.status === SEMUA || tenant.status === filter.status),
  )
}

export function adaFilterAktif(filter: FilterTenant): boolean {
  return filter.aplikasi !== SEMUA || filter.status !== SEMUA
}

/** Aplikasi unik yang benar-benar punya tenant, diurutkan menurut nama. */
export function aplikasiDariTenant(daftar: Tenant[]): AplikasiRingkas[] {
  const peta = new Map<string, AplikasiRingkas>()
  for (const tenant of daftar) {
    peta.set(tenant.aplikasi.slug, tenant.aplikasi)
  }
  return [...peta.values()].sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
}

/**
 * Jumlah tenant per opsi filter. Dihitung dengan filter lain tetap berlaku,
 * supaya angkanya mencerminkan apa yang benar-benar akan tampil saat diklik.
 */
export function hitungPerAplikasi(daftar: Tenant[], filter: FilterTenant): Map<string, number> {
  const cocokStatus = daftar.filter(
    (tenant) => filter.status === SEMUA || tenant.status === filter.status,
  )

  const hasil = new Map<string, number>([[SEMUA, cocokStatus.length]])
  for (const tenant of cocokStatus) {
    hasil.set(tenant.aplikasi.slug, (hasil.get(tenant.aplikasi.slug) ?? 0) + 1)
  }
  return hasil
}

export function hitungPerStatus(daftar: Tenant[], filter: FilterTenant): Map<string, number> {
  const cocokAplikasi = daftar.filter(
    (tenant) => filter.aplikasi === SEMUA || tenant.aplikasi.slug === filter.aplikasi,
  )

  const hasil = new Map<string, number>([[SEMUA, cocokAplikasi.length]])
  for (const tenant of cocokAplikasi) {
    hasil.set(tenant.status, (hasil.get(tenant.status) ?? 0) + 1)
  }
  return hasil
}
