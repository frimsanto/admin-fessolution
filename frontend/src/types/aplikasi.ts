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

/** Bentuk respons `GET /api/aplikasi` yang diasumsikan halaman ini. */
export type DaftarAplikasiResponse = {
  total: number
  berjalan: number
  nonaktif: number
  daftar: Aplikasi[]
}
