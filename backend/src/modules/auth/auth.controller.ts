import type { Request, Response } from 'express'

import { bacaHeaderBearer } from '../../middlewares/require-auth.js'
import { AppError } from '../../middlewares/error-handler.js'
import { kirimSukses } from '../../utils/api-response.js'
import { daftarHitamkanToken, masukSuperAdmin } from './auth.service.js'

/** Ambil field string wajib dari body; 400 kalau kosong atau bukan string. */
function teksWajib(nilai: unknown, nama: string): string {
  if (nilai === undefined || nilai === null || nilai === '') {
    throw new AppError(`Field ${nama} wajib diisi`, 400)
  }
  if (typeof nilai !== 'string') {
    throw new AppError(`Field ${nama} harus berupa teks`, 400)
  }
  const bersih = nilai.trim()
  if (bersih === '') {
    throw new AppError(`Field ${nama} wajib diisi`, 400)
  }
  return bersih
}

/** POST /api/auth/login — body: { email, password } */
export async function postLogin(req: Request, res: Response): Promise<void> {
  const isi = req.body as { email?: unknown; password?: unknown } | undefined

  const email = teksWajib(isi?.email, 'email')
  // Password tidak di-trim: spasi di ujung pun bagian dari passwordnya.
  const password = isi?.password
  if (password === undefined || password === null || password === '') {
    throw new AppError('Field password wajib diisi', 400)
  }
  if (typeof password !== 'string') {
    throw new AppError('Field password harus berupa teks', 400)
  }

  const hasil = await masukSuperAdmin(email, password)
  if (!hasil) {
    throw new AppError('Email atau password salah', 401)
  }

  kirimSukses(res, hasil, 'Berhasil masuk')
}

/** POST /api/auth/logout — header: Authorization: Bearer <token> */
export async function postLogout(req: Request, res: Response): Promise<void> {
  const token = bacaHeaderBearer(req.headers.authorization)
  if (!token) {
    throw new AppError('Token tidak ditemukan', 401)
  }

  await daftarHitamkanToken(token)

  kirimSukses(res, { pesan: 'berhasil logout' }, 'Berhasil logout')
}
