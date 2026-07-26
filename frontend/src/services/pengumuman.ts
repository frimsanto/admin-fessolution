import { apiGet, apiPost } from '@/lib/api'
import type { DaftarPengumumanResponse, Pengumuman } from '@/types/pengumuman'

/**
 * GET /api/broadcast
 * → { success, message, data: { total, daftar: Pengumuman[] } }
 *
 * Backend sudah mengurutkan createdAt DESC.
 */
export function ambilRiwayatPengumuman(signal?: AbortSignal): Promise<DaftarPengumumanResponse> {
  return apiGet<DaftarPengumumanResponse>('/broadcast', signal)
}

/**
 * POST /api/broadcast   body: { judul, isi, sasaran, aplikasiSlug? }
 * → { success, message, data: Pengumuman }
 *
 * `slugAplikasi` null berarti dikirim ke seluruh platform (sasaran SEMUA);
 * kalau diisi, pengumuman hanya untuk tenant aplikasi tersebut.
 */
export function kirimPengumuman(
  isian: { judul: string; isi: string; slugAplikasi: string | null },
  signal?: AbortSignal,
): Promise<Pengumuman> {
  return apiPost<Pengumuman>(
    '/broadcast',
    isian.slugAplikasi === null
      ? { judul: isian.judul, isi: isian.isi, sasaran: 'SEMUA' }
      : {
          judul: isian.judul,
          isi: isian.isi,
          sasaran: 'PER_APLIKASI',
          aplikasiSlug: isian.slugAplikasi,
        },
    signal,
  )
}
