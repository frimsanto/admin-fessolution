import { sisaHari } from '@/lib/format'
import type { StatusTenant, Tenant } from '@/types/tenant'

/** Tenant dengan status inilah yang jadi aktif setelah pembayaran dikonfirmasi. */
const STATUS_MENUNGGU: StatusTenant[] = ['TRIAL', 'EXPIRED']

/** Perpanjangan bawaan sekali konfirmasi pembayaran. */
export const HARI_PERPANJANGAN = 30

export function menungguKonfirmasi(tenant: Tenant): boolean {
  return STATUS_MENUNGGU.includes(tenant.status)
}

/**
 * Tenant yang menunggu konfirmasi pembayaran manual, yang paling mendesak
 * (masa aktif paling dekat habis atau sudah lewat paling lama) di urutan atas.
 */
export function tenantMenungguKonfirmasi(
  daftar: Tenant[],
  sekarang: Date = new Date(),
): Tenant[] {
  return daftar
    .filter(menungguKonfirmasi)
    .sort(
      (a, b) =>
        sisaHari(a.tanggalBerakhir, sekarang) - sisaHari(b.tanggalBerakhir, sekarang) ||
        a.namaBisnis.localeCompare(b.namaBisnis, 'id'),
    )
}

/**
 * Tanggal berakhir setelah konfirmasi. Kalau masa aktifnya sudah lewat,
 * perpanjangan dihitung dari hari ini — bukan dari tanggal lama yang sudah basi.
 */
export function tanggalSetelahPerpanjangan(
  tanggalBerakhir: string,
  hari: number = HARI_PERPANJANGAN,
  sekarang: Date = new Date(),
): string {
  const lama = new Date(tanggalBerakhir)
  const mulai = lama.getTime() > sekarang.getTime() ? lama : sekarang
  return new Date(mulai.getTime() + hari * 86_400_000).toISOString()
}

/** Hasil tenant setelah pembayaran dikonfirmasi: aktif dan masa berlakunya diperpanjang. */
export function tenantSetelahKonfirmasi(
  tenant: Tenant,
  hari: number = HARI_PERPANJANGAN,
  sekarang: Date = new Date(),
): Tenant {
  return {
    ...tenant,
    status: 'AKTIF',
    tanggalBerakhir: tanggalSetelahPerpanjangan(tenant.tanggalBerakhir, hari, sekarang),
  }
}
