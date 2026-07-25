import type { NextFunction, Request, Response } from 'express'

import { bacaToken, tokenDidaftarHitam } from '../modules/auth/auth.service.js'
import { kirimGagal } from '../utils/api-response.js'

/** Ambil token dari header `Authorization: Bearer <token>`; null kalau bentuknya lain. */
export function bacaHeaderBearer(header: string | undefined): string | null {
  if (!header) return null

  const [skema, ...sisa] = header.trim().split(/\s+/)
  if (skema?.toLowerCase() !== 'bearer') return null

  const token = sisa.join(' ').trim()
  return token === '' ? null : token
}

/**
 * Penjaga seluruh endpoint panel: token wajib ada, sah, dan belum di-logout.
 * Yang lolos mendapat `req.admin` berisi isi tokennya.
 *
 * Semua penolakan dijawab 401 dengan pesan yang sama — klien hanya perlu tahu
 * sesinya tidak berlaku, bukan bagian mana yang gagal.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = bacaHeaderBearer(req.headers.authorization)
  if (!token) {
    kirimGagal(res, 'Token tidak ditemukan. Silakan masuk lagi.', 401)
    return
  }

  const isi = bacaToken(token)
  if (!isi) {
    kirimGagal(res, 'Sesi berakhir. Silakan masuk lagi.', 401)
    return
  }

  try {
    if (await tokenDidaftarHitam(token)) {
      kirimGagal(res, 'Sesi sudah berakhir karena logout. Silakan masuk lagi.', 401)
      return
    }
  } catch (err) {
    next(err)
    return
  }

  req.admin = isi
  next()
}
