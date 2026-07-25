import type { Pengumuman } from '@/types/pengumuman'

/** Terbaru lebih dulu. */
export function urutkanTerbaru(daftar: Pengumuman[]): Pengumuman[] {
  return [...daftar].sort(
    (a, b) => new Date(b.dikirimPada).getTime() - new Date(a.dikirimPada).getTime(),
  )
}

/** Nama aplikasi sasaran, atau "Semua aplikasi" kalau dikirim ke seluruh platform. */
export function labelSasaran(pengumuman: Pengumuman): string {
  return pengumuman.aplikasi?.nama ?? 'Semua aplikasi'
}
