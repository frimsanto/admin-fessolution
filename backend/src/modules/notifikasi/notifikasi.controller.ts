import type { Request, Response } from 'express'

import { AppError } from '../../middlewares/error-handler.js'
import { kirimSukses } from '../../utils/api-response.js'
import {
  ambilDaftarNotifikasi,
  tandaiSemuaSudahDibaca,
  tandaiSudahDibaca,
} from './notifikasi.service.js'

/** Id admin dari token; middleware `requireAuth` menjamin isinya ada. */
function adminId(req: Request): string {
  const id = req.admin?.sub
  if (!id) {
    throw new AppError('Sesi tidak dikenali. Silakan masuk lagi.', 401)
  }
  return id
}

/** GET /api/notifikasi */
export async function getDaftarNotifikasi(req: Request, res: Response): Promise<void> {
  const hasil = await ambilDaftarNotifikasi(adminId(req))
  kirimSukses(res, hasil, 'Daftar notifikasi berhasil diambil')
}

/** PATCH /api/notifikasi/:id/baca */
export async function patchNotifikasiDibaca(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  if (!id) {
    throw new AppError('Notifikasi tidak ditemukan', 404)
  }

  const berhasil = await tandaiSudahDibaca(adminId(req), id)
  if (!berhasil) {
    throw new AppError('Notifikasi tidak ditemukan', 404)
  }

  kirimSukses(res, { berhasil: true }, 'Notifikasi ditandai sudah dibaca')
}

/** PATCH /api/notifikasi/baca-semua */
export async function patchSemuaNotifikasiDibaca(req: Request, res: Response): Promise<void> {
  const jumlah = await tandaiSemuaSudahDibaca(adminId(req))
  kirimSukses(
    res,
    { berhasil: true, jumlahDitandai: jumlah },
    jumlah === 0
      ? 'Tidak ada notifikasi yang belum dibaca'
      : `${jumlah} notifikasi ditandai sudah dibaca`,
  )
}
