import { URUTAN_STATUS } from '@/lib/filter-tenant'
import type { StatusTenant, Tenant } from '@/types/tenant'

export type BarisRingkasan = {
  status: StatusTenant
  jumlah: number
  /** Persentase dibulatkan, 0 kalau tidak ada tenant sama sekali. */
  persen: number
}

export type RingkasanLangganan = {
  total: number
  baris: BarisRingkasan[]
}

/** Kelompokkan tenant menurut status langganan, urut trial → aktif → ditangguhkan → kedaluwarsa. */
export function hitungRingkasanLangganan(daftar: Tenant[]): RingkasanLangganan {
  const jumlahPerStatus = new Map<StatusTenant, number>()
  for (const tenant of daftar) {
    jumlahPerStatus.set(tenant.status, (jumlahPerStatus.get(tenant.status) ?? 0) + 1)
  }

  const total = daftar.length

  return {
    total,
    baris: URUTAN_STATUS.map((status) => {
      const jumlah = jumlahPerStatus.get(status) ?? 0
      return {
        status,
        jumlah,
        persen: total === 0 ? 0 : Math.round((jumlah / total) * 100),
      }
    }),
  }
}
