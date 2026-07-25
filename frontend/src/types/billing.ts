import type { Pembayaran } from '@/types/pembayaran'
import type { StatusTenant, Tenant } from '@/types/tenant'

/** Satu kelompok status pada ringkasan langganan. */
export type BarisStatusLangganan = {
  status: StatusTenant
  jumlah: number
  /** Persentase dibulatkan; 0 kalau belum ada tenant sama sekali. */
  persen: number
}

/** Bentuk respons `GET /api/billing/status-langganan`. */
export type StatusLanggananResponse = {
  total: number
  /** Seluruh status selalu ada, termasuk yang jumlahnya 0. */
  baris: BarisStatusLangganan[]
}

/** Bentuk respons `GET /api/billing/peringatan`. */
export type PeringatanResponse = {
  /** Ambang hari yang dipakai backend saat menyaring. */
  ambangHari: number
  total: number
  /** Sudah tersaring dan terurut dari backend: yang paling mendesak lebih dulu. */
  daftar: Tenant[]
}

/** Isian `POST /api/billing/konfirmasi-pembayaran`. */
export type IsianKonfirmasi = {
  tenantId: string
  jumlah: number
  catatanAdmin?: string | null
  /** Kosongkan untuk memakai perpanjangan bawaan backend. */
  hariPerpanjangan?: number
}

/** Bentuk respons `POST /api/billing/konfirmasi-pembayaran`. */
export type HasilKonfirmasi = {
  /** Tenant setelah diaktifkan dan diperpanjang. */
  tenant: Tenant
  pembayaran: Pembayaran
}
