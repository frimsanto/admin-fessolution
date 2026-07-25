import { apiPost } from '@/lib/api'
import type { HasilLogin, IsianLogin } from '@/types/auth'

/**
 * POST /api/auth/login   body: { email, password }
 * → { success, message, data: { token, admin: { id, nama, email } } }
 *
 * 401 kalau kredensialnya ditolak, 400 kalau bodynya kurang.
 */
export function masukApi(isian: IsianLogin, signal?: AbortSignal): Promise<HasilLogin> {
  return apiPost<HasilLogin>('/auth/login', isian, signal)
}

/**
 * POST /api/auth/logout   header: Authorization: Bearer <token>
 * → { success, message, data: { pesan } }
 *
 * Tokennya dimasukkan ke daftar hitam di server, jadi token yang sama tidak
 * bisa dipakai lagi walaupun masa berlakunya belum habis.
 */
export function keluarApi(signal?: AbortSignal): Promise<{ pesan: string }> {
  return apiPost<{ pesan: string }>('/auth/logout', undefined, signal)
}
