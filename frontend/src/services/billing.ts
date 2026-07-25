import { apiGet, apiPost, kueri } from '@/lib/api'
import type {
  HasilKonfirmasi,
  IsianKonfirmasi,
  PeringatanResponse,
  StatusLanggananResponse,
} from '@/types/billing'
import type { DaftarPembayaranResponse } from '@/types/pembayaran'

/**
 *   GET /api/billing/status-langganan?aplikasi=<slug>
 *   → { success, message, data: { total, baris } }
 *
 * `slugAplikasi` opsional: kosongkan untuk seluruh platform.
 */
export function ambilStatusLangganan(
  slugAplikasi?: string,
  signal?: AbortSignal,
): Promise<StatusLanggananResponse> {
  return apiGet<StatusLanggananResponse>(
    `/billing/status-langganan${kueri({ aplikasi: slugAplikasi })}`,
    signal,
  )
}

/**
 *   GET /api/billing/peringatan?hari=<n>
 *   → { success, message, data: { ambangHari, total, daftar } }
 *
 * `hari` opsional: kosongkan untuk memakai ambang bawaan backend.
 */
export function ambilPeringatanMasaAktif(
  hari?: number,
  signal?: AbortSignal,
): Promise<PeringatanResponse> {
  return apiGet<PeringatanResponse>(`/billing/peringatan${kueri({ hari })}`, signal)
}

export type FilterRiwayat = {
  tenantId?: string
  /** Slug aplikasi, mis. `cafeos`. */
  aplikasi?: string
}

/**
 *   GET /api/billing/pembayaran?tenantId=<uuid>&aplikasi=<slug>
 *   → { success, message, data: { total, totalNilai, daftar } }
 *
 * `totalNilai` mengikuti filter yang sama, bukan total seluruh platform.
 */
export function ambilRiwayatPembayaran(
  filter: FilterRiwayat = {},
  signal?: AbortSignal,
): Promise<DaftarPembayaranResponse> {
  return apiGet<DaftarPembayaranResponse>(`/billing/pembayaran${kueri({ ...filter })}`, signal)
}

/**
 *   POST /api/billing/konfirmasi-pembayaran
 *   body: { tenantId, jumlah, catatanAdmin?, hariPerpanjangan? }
 *   → { success, message, data: { tenant, pembayaran } }   — 404 kalau tenant tidak ada
 *
 * Backend mencatat pembayaran, mengaktifkan tenant, dan memperpanjang masa
 * berlakunya dalam satu transaksi.
 */
export function konfirmasiPembayaran(
  isian: IsianKonfirmasi,
  signal?: AbortSignal,
): Promise<HasilKonfirmasi> {
  return apiPost<HasilKonfirmasi>('/billing/konfirmasi-pembayaran', isian, signal)
}
