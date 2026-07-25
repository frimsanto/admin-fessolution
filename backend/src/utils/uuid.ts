const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Kolom id memakai tipe uuid di PostgreSQL, jadi nilai yang bukan UUID akan
 * membuat query gagal. Diperiksa lebih dulu supaya bisa dijawab rapi.
 */
export function uuidSah(nilai: string): boolean {
  return POLA_UUID.test(nilai)
}
