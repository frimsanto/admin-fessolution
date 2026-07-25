import { TenantStatus } from '../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'

/** Urutan tetap, sama dengan yang dipakai frontend. */
export const URUTAN_STATUS: TenantStatus[] = [
  TenantStatus.TRIAL,
  TenantStatus.AKTIF,
  TenantStatus.SUSPENDED,
  TenantStatus.EXPIRED,
]

export type BarisStatusLangganan = {
  status: TenantStatus
  jumlah: number
  /** Persentase dibulatkan; 0 kalau belum ada tenant sama sekali. */
  persen: number
}

export type StatusLangganan = {
  total: number
  baris: BarisStatusLangganan[]
}

/**
 * Pengelompokan tenant menurut status langganan untuk halaman Billing.
 * Status yang belum punya tenant tetap dikembalikan dengan jumlah 0 supaya
 * tampilan tidak berubah-ubah jumlah kolomnya.
 */
export async function ambilStatusLangganan(slugAplikasi?: string): Promise<StatusLangganan> {
  const where = slugAplikasi ? { app: { slug: slugAplikasi } } : {}

  const perStatus = await prisma.tenant.groupBy({
    by: ['status'],
    where,
    _count: { _all: true },
  })

  const jumlahPerStatus = new Map<TenantStatus, number>(
    perStatus.map((baris) => [baris.status, baris._count._all]),
  )

  const total = perStatus.reduce((jumlah, baris) => jumlah + baris._count._all, 0)

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
