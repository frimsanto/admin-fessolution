/** Sasaran pengumuman, sama dengan enum `BroadcastTarget` di backend. */
export type SasaranPengumuman = 'SEMUA' | 'PER_APLIKASI' | 'PER_TENANT'

/** Status pengumuman, sama dengan enum `BroadcastStatus` di backend. */
export type StatusPengumuman = 'TERKIRIM' | 'DRAFT'

/**
 * Pengumuman broadcast seperti yang dikembalikan `GET /api/broadcast`.
 * Bentuknya mengikuti mapper backend (broadcast.mapper.ts).
 */
export type Pengumuman = {
  id: string
  judul: string
  isi: string
  sasaran: SasaranPengumuman
  /** Terisi hanya untuk sasaran PER_APLIKASI. */
  aplikasiSlug: string | null
  /** Terisi hanya untuk sasaran PER_TENANT. */
  tenantId: string | null
  /** Jumlah penerima saat pengumuman dikirim — dibekukan oleh backend. */
  jumlahPenerima: number
  status: StatusPengumuman
  /** ISO 8601 */
  createdAt: string
  /** Nama aplikasi atau tenant sasaran; null untuk sasaran SEMUA. */
  namaSasaran: string | null
}

/** Bentuk respons daftar riwayat. */
export type DaftarPengumumanResponse = {
  total: number
  daftar: Pengumuman[]
}

/**
 * Isian formulir kirim pengumuman. Formulir hanya memegang id aplikasi;
 * penerjemahan ke `sasaran` + `aplikasiSlug` yang dimengerti backend
 * dilakukan di lapisan service.
 */
export type IsianPengumuman = {
  /** null berarti dikirim ke seluruh aplikasi. */
  appId: string | null
  judul: string
  pesan: string
}
