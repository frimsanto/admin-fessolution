import type { StatusTenant } from '@/types/tenant'

/**
 * Aturan ubah status manual oleh super admin (PRD: suspend atau aktifkan kembali).
 * Tenant yang sedang ditangguhkan bisa diaktifkan lagi; selain itu aksinya menangguhkan.
 */
export function akanDitangguhkan(status: StatusTenant): boolean {
  return status !== 'SUSPENDED'
}

export function statusSetelahUbah(status: StatusTenant): StatusTenant {
  return akanDitangguhkan(status) ? 'SUSPENDED' : 'AKTIF'
}
