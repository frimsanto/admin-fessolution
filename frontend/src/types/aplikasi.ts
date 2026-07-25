import type { StatusTenant } from '@/types/tenant'

/**
 * Kontrak data aplikasi. Bentuknya sengaja sama persis dengan yang sudah
 * dikembalikan backend di `GET /api/dashboard/daftar-aplikasi`.
 */
export type Aplikasi = {
  appId: string
  nama: string
  slug: string
  /** true = aplikasi sedang berjalan (status global aktif). */
  aktif: boolean
  jumlahTenant: number
  jumlahTenantAktif: number
  /** ISO 8601 */
  dibuatPada: string
}

/** Bentuk respons `GET /api/apps`. */
export type DaftarAplikasiResponse = {
  total: number
  berjalan: number
  nonaktif: number
  daftar: Aplikasi[]
}

/** Isian `POST /api/apps`. */
export type IsianAplikasiBaru = {
  nama: string
  slug: string
}

/** Bentuk respons `GET /api/apps/:id/stats`. */
export type StatistikAplikasiResponse = {
  aplikasi: Aplikasi
  totalPendapatan: number
  jumlahPembayaran: number
  /** null kalau aplikasi ini belum pernah menerima pembayaran. */
  pembayaranTerakhir: string | null
  totalTenant: number
  tenantAktif: number
  /** Rincian tenant menurut status, urutannya tetap dari backend. */
  statusLangganan: { status: StatusTenant; jumlah: number }[]
}
