import type { Pembayaran } from '@/types/pembayaran'

/** Terbaru lebih dulu. */
export function urutkanTerbaru(daftar: Pembayaran[]): Pembayaran[] {
  return [...daftar].sort(
    (a, b) => new Date(b.tanggalBayar).getTime() - new Date(a.tanggalBayar).getTime(),
  )
}
