/**
 * Klien HTTP untuk API Super Admin.
 * Token JWT super admin disimpan di localStorage dengan key `admin-token`.
 * Auth belum dibuat — helper ini sudah siap dipakai saat endpointnya menyusul.
 */

export const KUNCI_TOKEN = 'admin-token'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '/api' : 'https://admin.fessolution.my.id/api')

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T | null
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function ambilToken(): string | null {
  return localStorage.getItem(KUNCI_TOKEN)
}

export function simpanToken(token: string): void {
  localStorage.setItem(KUNCI_TOKEN, token)
}

export function hapusToken(): void {
  localStorage.removeItem(KUNCI_TOKEN)
}

/**
 * Rangkai query string dari parameter opsional. Nilai `undefined` atau string
 * kosong dibuang supaya URL-nya tidak berisi filter yang sebenarnya tidak dipakai.
 */
export function kueri(param: Record<string, string | number | undefined>): string {
  const isi = new URLSearchParams()
  for (const [kunci, nilai] of Object.entries(param)) {
    if (nilai === undefined || nilai === '') continue
    isi.set(kunci, String(nilai))
  }
  const teks = isi.toString()
  return teks === '' ? '' : `?${teks}`
}

type OpsiMinta = {
  metode?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  isi?: unknown
  signal?: AbortSignal
}

async function minta<T>(path: string, { metode = 'GET', isi, signal }: OpsiMinta = {}): Promise<T> {
  const token = ambilToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method: metode,
    signal,
    headers: {
      Accept: 'application/json',
      ...(isi === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(isi === undefined ? {} : { body: JSON.stringify(isi) }),
  })

  let body: ApiResponse<T> | null = null
  try {
    body = (await res.json()) as ApiResponse<T>
  } catch {
    // Respons bukan JSON — biarkan null, ditangani di bawah.
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(body?.message ?? `Permintaan gagal (HTTP ${res.status})`, res.status)
  }

  return body.data as T
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return minta<T>(path, { signal })
}

export function apiPost<T>(path: string, isi: unknown, signal?: AbortSignal): Promise<T> {
  return minta<T>(path, { metode: 'POST', isi, signal })
}

export function apiPatch<T>(path: string, isi: unknown, signal?: AbortSignal): Promise<T> {
  return minta<T>(path, { metode: 'PATCH', isi, signal })
}

/** `isi` boleh dikosongkan — beberapa endpoint PUT hanya membalik keadaan. */
export function apiPut<T>(path: string, isi?: unknown, signal?: AbortSignal): Promise<T> {
  return minta<T>(path, { metode: 'PUT', isi, signal })
}
