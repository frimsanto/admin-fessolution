import type { IsianLogin } from '@/types/auth'

export type GalatLogin = Partial<Record<keyof IsianLogin, string>>

/** Cukup untuk menangkap salah ketik; keabsahan sebenarnya urusan backend. */
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_MIN = 8

/** Validasi bentuk isian login. Objek kosong berarti semuanya sah. */
export function validasiLogin(isian: IsianLogin): GalatLogin {
  const galat: GalatLogin = {}

  const email = isian.email.trim()

  if (email === '') {
    galat.email = 'Email wajib diisi.'
  } else if (!POLA_EMAIL.test(email)) {
    galat.email = 'Format email tidak sah. Contoh: admin@fessolution.my.id.'
  }

  if (isian.password === '') {
    galat.password = 'Password wajib diisi.'
  } else if (isian.password.length < PASSWORD_MIN) {
    galat.password = `Password minimal ${PASSWORD_MIN} karakter.`
  }

  return galat
}

export function adaGalat(galat: GalatLogin): boolean {
  return Object.keys(galat).length > 0
}
