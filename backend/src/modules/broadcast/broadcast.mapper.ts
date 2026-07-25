import type { BroadcastStatus, BroadcastTarget } from '../../generated/prisma/enums.js'

/** Bentuk broadcast yang dikirim ke frontend. */
export type BroadcastDto = {
  id: string
  judul: string
  isi: string
  sasaran: BroadcastTarget
  /** Terisi hanya untuk sasaran PER_APLIKASI. */
  aplikasiSlug: string | null
  /** Terisi hanya untuk sasaran PER_TENANT. */
  tenantId: string | null
  jumlahPenerima: number
  status: BroadcastStatus
  createdAt: string
  /** Nama aplikasi/tenant sasaran, untuk ditampilkan tanpa permintaan susulan. */
  namaSasaran: string | null
}

type BroadcastDenganRelasi = {
  id: string
  title: string
  message: string
  target: BroadcastTarget
  tenantId: string | null
  recipientCount: number
  status: BroadcastStatus
  createdAt: Date
  app: { name: string; slug: string } | null
  tenant: { businessName: string } | null
}

/** Kolom yang wajib diambil agar `keBroadcastDto` bisa bekerja. */
export const PILIH_BROADCAST = {
  id: true,
  title: true,
  message: true,
  target: true,
  tenantId: true,
  recipientCount: true,
  status: true,
  createdAt: true,
  app: { select: { name: true, slug: true } },
  tenant: { select: { businessName: true } },
} as const

export function keBroadcastDto(broadcast: BroadcastDenganRelasi): BroadcastDto {
  return {
    id: broadcast.id,
    judul: broadcast.title,
    isi: broadcast.message,
    sasaran: broadcast.target,
    aplikasiSlug: broadcast.app?.slug ?? null,
    tenantId: broadcast.tenantId,
    jumlahPenerima: broadcast.recipientCount,
    status: broadcast.status,
    createdAt: broadcast.createdAt.toISOString(),
    // Tenant lebih dulu: broadcast PER_TENANT juga menyimpan appId tenantnya,
    // tapi yang perlu ditampilkan adalah nama bisnisnya, bukan nama aplikasi.
    namaSasaran: broadcast.tenant?.businessName ?? broadcast.app?.name ?? null,
  }
}
