import type { AplikasiRingkas } from '@/types/tenant'

/**
 * Kontrak pengumuman broadcast, mengikuti model `BroadcastNotification` di
 * backend. Endpointnya belum ada — task backend fitur ini masih antre.
 */
export type Pengumuman = {
  id: string
  /** null berarti pengumuman dikirim ke seluruh aplikasi. */
  aplikasi: AplikasiRingkas | null
  judul: string
  pesan: string
  /** ISO 8601 */
  dikirimPada: string
}

/** Bentuk respons daftar riwayat yang diasumsikan halaman ini. */
export type DaftarPengumumanResponse = {
  total: number
  daftar: Pengumuman[]
}

/** Isian formulir kirim pengumuman. */
export type IsianPengumuman = {
  /** null berarti dikirim ke seluruh aplikasi. */
  appId: string | null
  judul: string
  pesan: string
}
