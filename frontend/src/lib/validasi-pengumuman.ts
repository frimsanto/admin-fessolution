import type { IsianPengumuman } from '@/types/pengumuman'

export type GalatPengumuman = Partial<Record<keyof IsianPengumuman, string>>

export const JUDUL_MIN = 3
export const JUDUL_MAKS = 100
export const PESAN_MIN = 10
export const PESAN_MAKS = 1000

/**
 * Validasi formulir pengumuman. Mengembalikan objek kosong kalau semuanya sah.
 * Sasaran tidak divalidasi: null adalah pilihan yang sah (seluruh aplikasi).
 */
export function validasiPengumuman(isian: IsianPengumuman): GalatPengumuman {
  const galat: GalatPengumuman = {}

  const judul = isian.judul.trim()
  const pesan = isian.pesan.trim()

  if (judul === '') {
    galat.judul = 'Judul pengumuman wajib diisi.'
  } else if (judul.length < JUDUL_MIN) {
    galat.judul = `Judul pengumuman minimal ${JUDUL_MIN} karakter.`
  } else if (judul.length > JUDUL_MAKS) {
    galat.judul = `Judul pengumuman maksimal ${JUDUL_MAKS} karakter.`
  }

  if (pesan === '') {
    galat.pesan = 'Isi pengumuman wajib diisi.'
  } else if (pesan.length < PESAN_MIN) {
    galat.pesan = `Isi pengumuman minimal ${PESAN_MIN} karakter.`
  } else if (pesan.length > PESAN_MAKS) {
    galat.pesan = `Isi pengumuman maksimal ${PESAN_MAKS} karakter.`
  }

  return galat
}

export function adaGalat(galat: GalatPengumuman): boolean {
  return Object.keys(galat).length > 0
}
