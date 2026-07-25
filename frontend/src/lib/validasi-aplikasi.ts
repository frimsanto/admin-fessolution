import type { Aplikasi, IsianAplikasiBaru } from '@/types/aplikasi'

export type GalatAplikasi = Partial<Record<keyof IsianAplikasiBaru, string>>

const POLA_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Ubah nama jadi slug: huruf kecil, tanpa aksen, spasi jadi tanda hubung. */
export function buatSlug(nama: string): string {
  return nama
    .normalize('NFD')
    // Buang tanda diakritik hasil normalisasi (mis. é → e).
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function samakan(teks: string): string {
  return teks.trim().toLowerCase()
}

/**
 * Validasi formulir aplikasi baru, termasuk cek duplikasi terhadap daftar yang
 * sudah ada. Mengembalikan objek kosong kalau semuanya sah.
 *
 * Cek duplikasi di sini hanya untuk umpan balik cepat — backend tetap menolak
 * dengan 409 kalau ada yang menyelip di antara pemuatan daftar dan penyimpanan.
 */
export function validasiAplikasiBaru(
  isian: IsianAplikasiBaru,
  daftar: Aplikasi[],
): GalatAplikasi {
  const galat: GalatAplikasi = {}

  const nama = isian.nama.trim()
  const slug = isian.slug.trim()

  if (nama === '') {
    galat.nama = 'Nama aplikasi wajib diisi.'
  } else if (nama.length < 2) {
    galat.nama = 'Nama aplikasi minimal 2 karakter.'
  } else {
    const kembar = daftar.find((aplikasi) => samakan(aplikasi.nama) === samakan(nama))
    if (kembar) galat.nama = `Nama "${kembar.nama}" sudah dipakai aplikasi lain.`
  }

  if (slug === '') {
    galat.slug = 'Slug wajib diisi.'
  } else if (!POLA_SLUG.test(slug)) {
    galat.slug = 'Slug hanya boleh huruf kecil, angka, dan tanda hubung. Contoh: laundry-os.'
  } else {
    const kembar = daftar.find((aplikasi) => samakan(aplikasi.slug) === samakan(slug))
    if (kembar) galat.slug = `Slug "${slug}" sudah dipakai oleh ${kembar.nama}.`
  }

  return galat
}

export function adaGalat(galat: GalatAplikasi): boolean {
  return Object.keys(galat).length > 0
}
