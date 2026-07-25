import type { AplikasiRingkas } from '@/types/tenant'

/** Kontrak data pembayaran — dipakai halaman billing dan nanti oleh endpoint backend. */
export type Pembayaran = {
  id: string
  tenantId: string
  /** Ikut dikirim backend supaya daftar tidak perlu menggabungkan data sendiri. */
  namaBisnis: string
  aplikasi: AplikasiRingkas
  /** Rupiah penuh, bukan sen. */
  jumlah: number
  /** ISO 8601 */
  tanggalBayar: string
  catatanAdmin: string | null
}

/** Bentuk respons `GET /api/pembayaran` yang diasumsikan halaman ini. */
export type DaftarPembayaranResponse = {
  total: number
  totalNilai: number
  daftar: Pembayaran[]
}
