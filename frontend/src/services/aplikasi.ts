import { apiGet, apiPost, apiPut } from '@/lib/api'
import type {
  Aplikasi,
  DaftarAplikasiResponse,
  IsianAplikasiBaru,
  StatistikAplikasiResponse,
} from '@/types/aplikasi'

/**
 *   GET /api/apps
 *   → { success, message, data: { total, berjalan, nonaktif, daftar } }
 */
export function ambilDaftarAplikasi(signal?: AbortSignal): Promise<DaftarAplikasiResponse> {
  return apiGet<DaftarAplikasiResponse>('/apps', signal)
}

/**
 *   POST /api/apps   body: { nama, slug }
 *   → { success, message, data: Aplikasi }   — 409 kalau nama/slug sudah dipakai
 */
export function tambahAplikasi(isian: IsianAplikasiBaru, signal?: AbortSignal): Promise<Aplikasi> {
  return apiPost<Aplikasi>('/apps', isian, signal)
}

/**
 *   GET /api/apps/:id/stats
 *   → { success, message, data: StatistikAplikasiResponse }   — 404 kalau tidak ada
 *
 * `kunci` boleh UUID maupun slug; halaman statistik memakai slug dari URL.
 */
export function ambilStatistikAplikasi(
  kunci: string,
  signal?: AbortSignal,
): Promise<StatistikAplikasiResponse> {
  return apiGet<StatistikAplikasiResponse>(
    `/apps/${encodeURIComponent(kunci)}/stats`,
    signal,
  )
}

/**
 *   PUT /api/apps/:id/toggle
 *   → { success, message, data: Aplikasi }   — aplikasi setelah statusnya dibalik
 *
 * `appId` harus UUID; backend menolak slug di endpoint ini.
 */
export function toggleStatusAplikasi(appId: string, signal?: AbortSignal): Promise<Aplikasi> {
  return apiPut<Aplikasi>(`/apps/${encodeURIComponent(appId)}/toggle`, undefined, signal)
}
