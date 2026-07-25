import { apiGet } from '@/lib/api'
import type { DaftarTenantResponse } from '@/types/tenant'

/**
 * Kontrak yang diasumsikan halaman ini (belum ada di backend):
 *
 *   GET /api/tenant
 *   → { success, message, data: { total: number, daftar: Tenant[] } }
 *
 * Task backend "Manajemen Tenant" nanti harus memenuhi bentuk ini.
 */
export function ambilDaftarTenant(signal?: AbortSignal): Promise<DaftarTenantResponse> {
  return apiGet<DaftarTenantResponse>('/tenant', signal)
}
