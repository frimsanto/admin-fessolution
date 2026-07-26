import type { Pengumuman } from '@/types/pengumuman'

/** Terbaru lebih dulu. */
export function urutkanTerbaru(daftar: Pengumuman[]): Pengumuman[] {
  return [...daftar].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/**
 * Nama sasaran untuk ditampilkan: nama aplikasi atau tenantnya, atau
 * "Semua aplikasi" kalau dikirim ke seluruh platform.
 */
export function labelSasaran(pengumuman: Pengumuman): string {
  if (pengumuman.sasaran === 'SEMUA') return 'Semua aplikasi'
  return pengumuman.namaSasaran ?? pengumuman.aplikasiSlug ?? 'Sasaran tidak dikenal'
}
