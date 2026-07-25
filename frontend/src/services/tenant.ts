import { apiGet } from '@/lib/api'
import type { DaftarTenantResponse, Tenant } from '@/types/tenant'

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

/**
 * Kontrak yang diasumsikan (belum ada di backend):
 *
 *   GET /api/tenant/:id
 *   → { success, message, data: Tenant }   — 404 kalau tenant tidak ada
 */
export function ambilDetailTenant(id: string, signal?: AbortSignal): Promise<Tenant> {
  return apiGet<Tenant>(`/tenant/${encodeURIComponent(id)}`, signal)
}
