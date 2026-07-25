import {
  BroadcastStatus,
  BroadcastTarget,
  TenantStatus,
} from '../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'
import { keBroadcastDto, PILIH_BROADCAST, type BroadcastDto } from './broadcast.mapper.js'

/**
 * Yang dihitung sebagai penerima: tenant yang langganannya masih berjalan.
 * Tenant SUSPENDED/EXPIRED tidak dihitung — panelnya sudah tidak mereka pakai.
 */
const STATUS_PENERIMA: TenantStatus[] = [TenantStatus.TRIAL, TenantStatus.AKTIF]

export type IsianBroadcast = {
  judul: string
  isi: string
  sasaran: BroadcastTarget
  /** Wajib untuk sasaran PER_APLIKASI. */
  aplikasiSlug?: string
  /** Wajib untuk sasaran PER_TENANT. */
  tenantId?: string
  status?: BroadcastStatus
}

/** Sasaran yang ditolak beserta alasannya. */
export type GagalBroadcast = { pesan: string }

export function adalahGagal(hasil: BroadcastDto | GagalBroadcast): hasil is GagalBroadcast {
  return 'pesan' in hasil
}

/**
 * Kirim pengumuman massal. Jumlah penerima dihitung saat kirim lalu dibekukan
 * pada barisnya — riwayat harus menunjukkan berapa tenant yang menerima waktu
 * itu, bukan berapa yang ada sekarang.
 */
export async function kirimBroadcast(
  isian: IsianBroadcast,
): Promise<BroadcastDto | GagalBroadcast> {
  let appId: string | null = null
  let tenantId: string | null = null
  let jumlahPenerima = 0

  if (isian.sasaran === BroadcastTarget.PER_APLIKASI) {
    const slug = isian.aplikasiSlug?.trim()
    if (!slug) {
      return { pesan: 'Field aplikasiSlug wajib diisi untuk sasaran PER_APLIKASI' }
    }

    const aplikasi = await prisma.app.findUnique({ where: { slug }, select: { id: true } })
    if (!aplikasi) {
      return { pesan: `Aplikasi dengan slug "${slug}" tidak ditemukan` }
    }

    appId = aplikasi.id
    jumlahPenerima = await prisma.tenant.count({
      where: { appId: aplikasi.id, status: { in: STATUS_PENERIMA } },
    })
  } else if (isian.sasaran === BroadcastTarget.PER_TENANT) {
    const id = isian.tenantId?.trim()
    if (!id) {
      return { pesan: 'Field tenantId wajib diisi untuk sasaran PER_TENANT' }
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      select: { id: true, appId: true, status: true },
    })
    if (!tenant) {
      return { pesan: 'Tenant tidak ditemukan' }
    }

    tenantId = tenant.id
    appId = tenant.appId
    jumlahPenerima = STATUS_PENERIMA.includes(tenant.status) ? 1 : 0
  } else {
    jumlahPenerima = await prisma.tenant.count({ where: { status: { in: STATUS_PENERIMA } } })
  }

  const dibuat = await prisma.broadcastNotification.create({
    data: {
      appId,
      tenantId,
      title: isian.judul.trim(),
      message: isian.isi.trim(),
      target: isian.sasaran,
      recipientCount: jumlahPenerima,
      status: isian.status ?? BroadcastStatus.TERKIRIM,
    },
    select: PILIH_BROADCAST,
  })

  return keBroadcastDto(dibuat)
}

export type FilterBroadcast = {
  sasaran?: BroadcastTarget
  status?: BroadcastStatus
}

export type RiwayatBroadcast = {
  total: number
  daftar: BroadcastDto[]
}

/** Riwayat pengumuman, terbaru lebih dulu. */
export async function ambilRiwayatBroadcast(
  filter: FilterBroadcast = {},
): Promise<RiwayatBroadcast> {
  const daftar = await prisma.broadcastNotification.findMany({
    where: {
      ...(filter.sasaran ? { target: filter.sasaran } : {}),
      ...(filter.status ? { status: filter.status } : {}),
    },
    select: PILIH_BROADCAST,
    orderBy: { createdAt: 'desc' },
  })

  return {
    total: daftar.length,
    daftar: daftar.map(keBroadcastDto),
  }
}

const SASARAN_SAH = Object.values(BroadcastTarget) as string[]
const STATUS_SAH = Object.values(BroadcastStatus) as string[]

export function sasaranSah(nilai: string): nilai is BroadcastTarget {
  return SASARAN_SAH.includes(nilai)
}

export function statusSah(nilai: string): nilai is BroadcastStatus {
  return STATUS_SAH.includes(nilai)
}

export const DAFTAR_SASARAN = SASARAN_SAH
export const DAFTAR_STATUS = STATUS_SAH
