import { TenantStatus } from '../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'
import { tambahHari } from '../../utils/tanggal.js'

/** Jenis notifikasi sistem yang bisa dihitung dari data yang sudah ada. */
export const TIPE_NOTIFIKASI = ['LANGGANAN_HABIS', 'PEMBAYARAN_MENUNGGU', 'TENANT_BARU'] as const

export type TipeNotifikasi = (typeof TIPE_NOTIFIKASI)[number]

export type NotifikasiDto = {
  id: string
  tipe: TipeNotifikasi
  judul: string
  isi: string
  sudahDibaca: boolean
  /** ISO 8601 — saat kejadiannya jadi relevan, bukan saat baris dibuat. */
  createdAt: string
  metadata?: Record<string, unknown>
}

export type DaftarNotifikasi = {
  total: number
  belumDibaca: number
  daftar: NotifikasiDto[]
}

/** Ambang peringatan masa aktif, sama dengan yang dipakai halaman Billing. */
const AMBANG_HABIS_HARI = 7

/** Tenant yang baru bergabung dianggap "baru" selama sehari. */
const AMBANG_BARU_JAM = 24

const MS_PER_HARI = 24 * 60 * 60 * 1000

/** Langganan yang masih berjalan — hanya ini yang perlu diperingatkan. */
const STATUS_BERJALAN: TenantStatus[] = [TenantStatus.TRIAL, TenantStatus.AKTIF]

/**
 * Id notifikasi: `<TIPE>:<tenantId>`. Sengaja deterministik supaya tanda
 * "sudah dibaca" tetap menempel pada notifikasi yang sama di permintaan
 * berikutnya, walaupun notifikasinya sendiri tidak pernah disimpan.
 */
export function idNotifikasi(tipe: TipeNotifikasi, tenantId: string): string {
  return `${tipe}:${tenantId}`
}

function selisihHari(dari: Date, ke: Date): number {
  return Math.ceil((ke.getTime() - dari.getTime()) / MS_PER_HARI)
}

type TenantNotifikasi = {
  id: string
  businessName: string
  ownerEmail: string
  status: TenantStatus
  joinedDate: Date
  expiredDate: Date
  app: { name: string; slug: string }
}

const PILIH_TENANT_NOTIFIKASI = {
  id: true,
  businessName: true,
  ownerEmail: true,
  status: true,
  joinedDate: true,
  expiredDate: true,
  app: { select: { name: true, slug: true } },
} as const

function metadataTenant(tenant: TenantNotifikasi): Record<string, unknown> {
  return {
    tenantId: tenant.id,
    namaBisnis: tenant.businessName,
    emailPemilik: tenant.ownerEmail,
    aplikasi: { nama: tenant.app.name, slug: tenant.app.slug },
    status: tenant.status,
  }
}

/**
 * Susun notifikasi sistem dari data tenant & pembayaran yang sudah ada.
 * Tidak ada tabel notifikasi — daftarnya dihitung ulang setiap permintaan,
 * jadi tidak pernah basi.
 */
async function susunNotifikasi(sekarang: Date): Promise<NotifikasiDto[]> {
  const batasHabis = tambahHari(AMBANG_HABIS_HARI, sekarang)
  const batasBaru = new Date(sekarang.getTime() - AMBANG_BARU_JAM * 60 * 60 * 1000)

  const [akanHabis, menungguBayar, tenantBaru] = await Promise.all([
    // Masa aktif berakhir dalam 7 hari ke depan.
    prisma.tenant.findMany({
      where: {
        status: { in: STATUS_BERJALAN },
        expiredDate: { gte: sekarang, lte: batasHabis },
      },
      select: PILIH_TENANT_NOTIFIKASI,
      orderBy: [{ expiredDate: 'asc' }, { businessName: 'asc' }],
    }),
    // Masa aktifnya sudah lewat tapi belum disetop — menunggu konfirmasi
    // pembayaran dari super admin.
    prisma.tenant.findMany({
      where: {
        status: { in: [...STATUS_BERJALAN, TenantStatus.EXPIRED] },
        expiredDate: { lt: sekarang },
      },
      select: PILIH_TENANT_NOTIFIKASI,
      orderBy: [{ expiredDate: 'desc' }, { businessName: 'asc' }],
    }),
    // Bergabung dalam 24 jam terakhir.
    prisma.tenant.findMany({
      where: { joinedDate: { gte: batasBaru } },
      select: PILIH_TENANT_NOTIFIKASI,
      orderBy: [{ joinedDate: 'desc' }],
    }),
  ])

  const hasil: NotifikasiDto[] = []

  for (const tenant of akanHabis) {
    const sisaHari = selisihHari(sekarang, tenant.expiredDate)
    hasil.push({
      id: idNotifikasi('LANGGANAN_HABIS', tenant.id),
      tipe: 'LANGGANAN_HABIS',
      judul: `Langganan ${tenant.businessName} segera berakhir`,
      isi:
        sisaHari <= 1
          ? `Masa aktif ${tenant.businessName} (${tenant.app.name}) berakhir hari ini.`
          : `Masa aktif ${tenant.businessName} (${tenant.app.name}) berakhir dalam ${sisaHari} hari.`,
      sudahDibaca: false,
      // Peringatan ini mulai relevan saat tenant masuk jendela 7 hari.
      createdAt: new Date(tenant.expiredDate.getTime() - AMBANG_HABIS_HARI * MS_PER_HARI).toISOString(),
      metadata: {
        ...metadataTenant(tenant),
        tanggalBerakhir: tenant.expiredDate.toISOString(),
        sisaHari,
      },
    })
  }

  for (const tenant of menungguBayar) {
    const lewatHari = Math.abs(selisihHari(tenant.expiredDate, sekarang))
    hasil.push({
      id: idNotifikasi('PEMBAYARAN_MENUNGGU', tenant.id),
      tipe: 'PEMBAYARAN_MENUNGGU',
      judul: `Pembayaran ${tenant.businessName} menunggu konfirmasi`,
      isi: `Masa aktif ${tenant.businessName} (${tenant.app.name}) sudah lewat ${lewatHari} hari dan menunggu konfirmasi pembayaran.`,
      sudahDibaca: false,
      createdAt: tenant.expiredDate.toISOString(),
      metadata: {
        ...metadataTenant(tenant),
        tanggalBerakhir: tenant.expiredDate.toISOString(),
        lewatHari,
      },
    })
  }

  for (const tenant of tenantBaru) {
    hasil.push({
      id: idNotifikasi('TENANT_BARU', tenant.id),
      tipe: 'TENANT_BARU',
      judul: `Tenant baru: ${tenant.businessName}`,
      isi: `${tenant.businessName} baru bergabung di ${tenant.app.name} dengan status ${tenant.status}.`,
      sudahDibaca: false,
      createdAt: tenant.joinedDate.toISOString(),
      metadata: {
        ...metadataTenant(tenant),
        tanggalDaftar: tenant.joinedDate.toISOString(),
      },
    })
  }

  // Terbaru lebih dulu — sama seperti daftar notifikasi pada umumnya.
  hasil.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return hasil
}

async function idSudahDibaca(adminId: string): Promise<Set<string>> {
  const baris = await prisma.notificationRead.findMany({
    where: { adminId },
    select: { notificationId: true },
  })
  return new Set(baris.map((item) => item.notificationId))
}

/** Daftar notifikasi untuk satu admin, lengkap dengan penanda sudah dibaca. */
export async function ambilDaftarNotifikasi(
  adminId: string,
  sekarang: Date = new Date(),
): Promise<DaftarNotifikasi> {
  const [notifikasi, dibaca] = await Promise.all([
    susunNotifikasi(sekarang),
    idSudahDibaca(adminId),
  ])

  const daftar = notifikasi.map((item) => ({ ...item, sudahDibaca: dibaca.has(item.id) }))

  return {
    total: daftar.length,
    belumDibaca: daftar.filter((item) => !item.sudahDibaca).length,
    daftar,
  }
}

/**
 * Tandai satu notifikasi sebagai sudah dibaca. Mengembalikan false kalau
 * idnya tidak cocok dengan notifikasi mana pun yang sedang berlaku — supaya
 * tabel penanda tidak terisi id karangan.
 */
export async function tandaiSudahDibaca(
  adminId: string,
  notifikasiId: string,
  sekarang: Date = new Date(),
): Promise<boolean> {
  const notifikasi = await susunNotifikasi(sekarang)
  if (!notifikasi.some((item) => item.id === notifikasiId)) return false

  await prisma.notificationRead.upsert({
    where: { notificationId_adminId: { notificationId: notifikasiId, adminId } },
    update: {},
    create: { notificationId: notifikasiId, adminId },
  })

  return true
}

/** Tandai semua notifikasi yang sedang berlaku; mengembalikan jumlah yang baru ditandai. */
export async function tandaiSemuaSudahDibaca(
  adminId: string,
  sekarang: Date = new Date(),
): Promise<number> {
  const [notifikasi, dibaca] = await Promise.all([
    susunNotifikasi(sekarang),
    idSudahDibaca(adminId),
  ])

  const belum = notifikasi.filter((item) => !dibaca.has(item.id))
  if (belum.length === 0) return 0

  await prisma.notificationRead.createMany({
    data: belum.map((item) => ({ notificationId: item.id, adminId })),
    skipDuplicates: true,
  })

  return belum.length
}
