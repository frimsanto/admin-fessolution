import type { Pembayaran } from '@/types/pembayaran'

export function totalNilaiPembayaran(daftar: Pembayaran[]): number {
  return daftar.reduce((jumlah, bayar) => jumlah + bayar.jumlah, 0)
}

/** Terbaru lebih dulu. */
export function urutkanTerbaru(daftar: Pembayaran[]): Pembayaran[] {
  return [...daftar].sort(
    (a, b) => new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime(),
  )
}
