import type { Request, Response } from 'express'

import { kirimSukses } from '../../utils/api-response.js'
import { ambilDaftarAplikasi } from './aplikasi.service.js'

/** GET /api/apps */
export async function getDaftarAplikasi(_req: Request, res: Response): Promise<void> {
  const hasil = await ambilDaftarAplikasi()
  kirimSukses(res, hasil, 'Daftar aplikasi berhasil diambil')
}
