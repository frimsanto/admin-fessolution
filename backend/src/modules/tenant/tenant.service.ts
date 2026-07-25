import { TenantStatus } from '../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'
import { keTenantDto, PILIH_TENANT, type TenantDto } from './tenant.mapper.js'

export type FilterDaftarTenant = {
  /** Slug aplikasi, mis. `cafeos`. */
  slugAplikasi?: string
  status?: TenantStatus
}

export type DaftarTenantHasil = {
  total: number
  daftar: TenantDto[]
}

/**
 * Daftar tenant untuk halaman Manajemen Tenant, bisa disaring per aplikasi dan
 * per status. Diurutkan menurut masa aktif terdekat supaya yang perlu
 * ditindaklanjuti muncul lebih dulu.
 */
export async function ambilDaftarTenant(
  filter: FilterDaftarTenant = {},
): Promise<DaftarTenantHasil> {
  const where = {
    ...(filter.slugAplikasi ? { app: { slug: filter.slugAplikasi } } : {}),
    ...(filter.status ? { status: filter.status } : {}),
  }

  const daftar = await prisma.tenant.findMany({
    where,
    select: PILIH_TENANT,
    orderBy: [{ expiredDate: 'asc' }, { businessName: 'asc' }],
  })

  return {
    total: daftar.length,
    daftar: daftar.map(keTenantDto),
  }
}

/** Detail satu tenant; null kalau tidak ada. */
export async function ambilDetailTenant(id: string): Promise<TenantDto | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    select: PILIH_TENANT,
  })

  return tenant ? keTenantDto(tenant) : null
}

const STATUS_SAH = Object.values(TenantStatus) as string[]

export function statusSah(nilai: string): nilai is TenantStatus {
  return STATUS_SAH.includes(nilai)
}

export const DAFTAR_STATUS = STATUS_SAH
