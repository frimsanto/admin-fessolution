/**
 * Kontrak pengumuman broadcast, mengikuti model `BroadcastNotification` di
 * backend. Endpointnya belum ada — task backend fitur ini masih antre.
 */

/** Isian formulir kirim pengumuman. */
export type IsianPengumuman = {
  /** null berarti dikirim ke seluruh aplikasi. */
  appId: string | null
  judul: string
  pesan: string
}
