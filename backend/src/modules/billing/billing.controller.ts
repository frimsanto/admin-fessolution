import type { Request, Response } from 'express'

import { AppError } from '../../middlewares/error-handler.js'
import { kirimSukses } from '../../utils/api-response.js'
import { ambilStatusLangganan } from './billing.service.js'

function slugOpsional(req: Request): string | undefined {
  const nilai = req.query.aplikasi
  if (nilai === undefined) return undefined
  if (typeof nilai !== 'string') {
    throw new AppError('Parameter aplikasi hanya boleh diisi satu nilai', 400)
  }
  const bersih = nilai.trim()
  return bersih === '' ? undefined : bersih
}

/** GET /api/billing/status-langganan?aplikasi=<slug> */
export async function getStatusLangganan(req: Request, res: Response): Promise<void> {
  const hasil = await ambilStatusLangganan(slugOpsional(req))
  kirimSukses(res, hasil, 'Status langganan berhasil diambil')
}
