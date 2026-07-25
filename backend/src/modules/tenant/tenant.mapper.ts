import type { TenantStatus } from '../../generated/prisma/enums.js'

/** Bentuk tenant yang dikirim ke frontend (lihat frontend/src/types/tenant.ts). */
export type TenantDto = {
  id: string
  namaBisnis: string
  emailPemilik: string
  aplikasi: {
    appId: string
    nama: string
    slug: string
  }
  status: TenantStatus
  tanggalDaftar: string
  tanggalBerakhir: string
}

type TenantDenganAplikasi = {
  id: string
  businessName: string
  ownerEmail: string
  status: TenantStatus
  joinedDate: Date
  expiredDate: Date
  app: { id: string; name: string; slug: string }
}

/** Kolom yang wajib diambil agar `keTenantDto` bisa bekerja. */
export const PILIH_TENANT = {
  id: true,
  businessName: true,
  ownerEmail: true,
  status: true,
  joinedDate: true,
  expiredDate: true,
  app: { select: { id: true, name: true, slug: true } },
} as const

export function keTenantDto(tenant: TenantDenganAplikasi): TenantDto {
  return {
    id: tenant.id,
    namaBisnis: tenant.businessName,
    emailPemilik: tenant.ownerEmail,
    aplikasi: {
      appId: tenant.app.id,
      nama: tenant.app.name,
      slug: tenant.app.slug,
    },
    status: tenant.status,
    tanggalDaftar: tenant.joinedDate.toISOString(),
    tanggalBerakhir: tenant.expiredDate.toISOString(),
  }
}
