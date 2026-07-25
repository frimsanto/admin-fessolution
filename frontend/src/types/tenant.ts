/** Kontrak data tenant — dipakai halaman ini dan nanti oleh endpoint backend. */

export type StatusTenant = 'TRIAL' | 'AKTIF' | 'SUSPENDED' | 'EXPIRED'

export type AplikasiRingkas = {
  appId: string
  nama: string
  slug: string
}

export type Tenant = {
  id: string
  namaBisnis: string
  emailPemilik: string
  aplikasi: AplikasiRingkas
  status: StatusTenant
  /** ISO 8601 */
  tanggalDaftar: string
  /** ISO 8601 */
  tanggalBerakhir: string
}

/** Bentuk respons `GET /api/tenant` yang diasumsikan halaman ini. */
export type DaftarTenantResponse = {
  total: number
  daftar: Tenant[]
}

export const LABEL_STATUS: Record<StatusTenant, string> = {
  TRIAL: 'Trial',
  AKTIF: 'Aktif',
  SUSPENDED: 'Ditangguhkan',
  EXPIRED: 'Kedaluwarsa',
}
