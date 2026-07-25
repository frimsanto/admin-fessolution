import type { BarisStatusLangganan } from '@/types/billing'
import type { StatusTenant } from '@/types/tenant'

/**
 * Lengkapi rincian status dengan persentasenya.
 *
 * `GET /api/billing/status-langganan` sudah mengirim persen, tapi
 * `GET /api/apps/:id/stats` hanya mengirim jumlah per status — helper ini
 * menyamakan keduanya supaya bisa dipakai komponen ringkasan yang sama.
 */
export function keBarisRingkasan(
  rincian: { status: StatusTenant; jumlah: number }[],
  total: number,
): BarisStatusLangganan[] {
  return rincian.map(({ status, jumlah }) => ({
    status,
    jumlah,
    persen: total === 0 ? 0 : Math.round((jumlah / total) * 100),
  }))
}
