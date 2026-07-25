import { sisaHari } from '@/lib/format'
import type { StatusTenant, Tenant } from '@/types/tenant'

/** Hanya langganan yang masih berjalan yang perlu diperingatkan. */
const STATUS_DIPANTAU: StatusTenant[] = ['TRIAL', 'AKTIF']

export const AMBANG_HARI = 7

/**
 * Tenant yang masa aktifnya berakhir dalam `ambang` hari ke depan, paling
 * mendesak lebih dulu. Sejalan dengan hitungan backend pada statistik dashboard:
 * yang sudah lewat tidak dihitung di sini karena penanganannya berbeda.
 */
export function tenantAkanHabis(
  daftar: Tenant[],
  ambang: number = AMBANG_HARI,
  sekarang: Date = new Date(),
): Tenant[] {
  return daftar
    .filter((tenant) => {
      if (!STATUS_DIPANTAU.includes(tenant.status)) return false
      const sisa = sisaHari(tenant.tanggalBerakhir, sekarang)
      return sisa >= 0 && sisa <= ambang
    })
    .sort(
      (a, b) =>
        sisaHari(a.tanggalBerakhir, sekarang) - sisaHari(b.tanggalBerakhir, sekarang) ||
        a.namaBisnis.localeCompare(b.namaBisnis, 'id'),
    )
}
