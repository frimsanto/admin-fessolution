import { TenantStatus } from '../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'
import { keTenantDto, PILIH_TENANT, type TenantDto } from '../tenant/tenant.mapper.js'
import { kePembayaranDto, PILIH_PEMBAYARAN, type PembayaranDto } from './billing.mapper.js'

/** Perpanjangan bawaan sekali konfirmasi pembayaran, sama dengan di frontend. */
export const HARI_PERPANJANGAN = 30

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

/** Ambang bawaan peringatan masa aktif, sama dengan di frontend. */
export const AMBANG_HARI = 7

/** Hanya langganan yang masih berjalan yang perlu diperingatkan. */
const STATUS_DIPANTAU: TenantStatus[] = [TenantStatus.TRIAL, TenantStatus.AKTIF]

export type PeringatanMasaAktif = {
  ambangHari: number
  total: number
  daftar: TenantDto[]
}

/**
 * Tenant yang masa aktifnya berakhir dalam `ambang` hari ke depan, paling
 * mendesak lebih dulu. Yang sudah lewat tidak masuk karena penanganannya
 * berbeda — itu urusan konfirmasi pembayaran.
 */
export async function ambilPeringatanMasaAktif(
  ambang: number = AMBANG_HARI,
  sekarang: Date = new Date(),
): Promise<PeringatanMasaAktif> {
  const batas = new Date(sekarang.getTime() + ambang * 24 * 60 * 60 * 1000)

  const daftar = await prisma.tenant.findMany({
    where: {
      status: { in: STATUS_DIPANTAU },
      expiredDate: { gte: sekarang, lte: batas },
    },
    select: PILIH_TENANT,
    orderBy: [{ expiredDate: 'asc' }, { businessName: 'asc' }],
  })

  return {
    ambangHari: ambang,
    total: daftar.length,
    daftar: daftar.map(keTenantDto),
  }
}

export type FilterRiwayat = {
  tenantId?: string
  /** Slug aplikasi, mis. `cafeos`. */
  slugAplikasi?: string
}

export type RiwayatPembayaran = {
  total: number
  /** Jumlah seluruh nominal pada hasil yang tersaring. */
  totalNilai: number
  daftar: PembayaranDto[]
}

/**
 * Riwayat pembayaran, terbaru lebih dulu. Bisa disaring per tenant atau per
 * aplikasi. `totalNilai` mengikuti filter yang sama, bukan total keseluruhan.
 */
export async function ambilRiwayatPembayaran(
  filter: FilterRiwayat = {},
): Promise<RiwayatPembayaran> {
  const where = {
    ...(filter.tenantId ? { tenantId: filter.tenantId } : {}),
    ...(filter.slugAplikasi ? { tenant: { app: { slug: filter.slugAplikasi } } } : {}),
  }

  const daftar = await prisma.payment.findMany({
    where,
    select: PILIH_PEMBAYARAN,
    orderBy: [{ paymentDate: 'desc' }, { createdAt: 'desc' }],
  })

  const hasil = daftar.map(kePembayaranDto)

  return {
    total: hasil.length,
    totalNilai: hasil.reduce((jumlah, bayar) => jumlah + bayar.jumlah, 0),
    daftar: hasil,
  }
}

/**
 * Tanggal berakhir setelah konfirmasi. Kalau masa aktifnya sudah lewat,
 * perpanjangan dihitung dari sekarang — bukan dari tanggal lama yang sudah basi.
 */
export function tanggalSetelahPerpanjangan(
  tanggalBerakhir: Date,
  hari: number,
  sekarang: Date = new Date(),
): Date {
  const mulai = tanggalBerakhir.getTime() > sekarang.getTime() ? tanggalBerakhir : sekarang
  return new Date(mulai.getTime() + hari * 24 * 60 * 60 * 1000)
}

export type IsianKonfirmasi = {
  tenantId: string
  jumlah: number
  catatanAdmin?: string | null
  hariPerpanjangan?: number
}

export type HasilKonfirmasi = {
  tenant: TenantDto
  pembayaran: PembayaranDto
}

/**
 * Konfirmasi pembayaran manual: catat pembayarannya, aktifkan tenant, dan
 * perpanjang masa berlakunya. Ketiganya dalam satu transaksi supaya tidak
 * pernah ada pembayaran tercatat tanpa tenant ikut diperpanjang.
 * Mengembalikan null kalau tenantnya tidak ada.
 */
export async function konfirmasiPembayaran(
  isian: IsianKonfirmasi,
  sekarang: Date = new Date(),
): Promise<HasilKonfirmasi | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: isian.tenantId },
    select: { id: true, expiredDate: true },
  })
  if (!tenant) return null

  const hari = isian.hariPerpanjangan ?? HARI_PERPANJANGAN
  const berakhirBaru = tanggalSetelahPerpanjangan(tenant.expiredDate, hari, sekarang)

  const [pembayaran, tenantBaru] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        tenantId: tenant.id,
        amount: isian.jumlah,
        paymentDate: sekarang,
        adminNote: isian.catatanAdmin ?? null,
      },
      select: PILIH_PEMBAYARAN,
    }),
    prisma.tenant.update({
      where: { id: tenant.id },
      data: { status: TenantStatus.AKTIF, expiredDate: berakhirBaru },
      select: PILIH_TENANT,
    }),
  ])

  return {
    tenant: keTenantDto(tenantBaru),
    pembayaran: kePembayaranDto(pembayaran),
  }
}
