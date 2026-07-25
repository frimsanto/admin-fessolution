import type { Request, Response } from 'express'

import { AppError } from '../../middlewares/error-handler.js'
import { kirimSukses } from '../../utils/api-response.js'
import { uuidSah } from '../../utils/uuid.js'
import {
  ambilDaftarTenant,
  ambilDetailTenant,
  DAFTAR_STATUS,
  statusSah,
  ubahStatusTenant,
  type FilterDaftarTenant,
} from './tenant.service.js'

/** Ambil satu nilai query; array (mis. ?status=A&status=B) ditolak. */
function satuNilai(nilai: unknown, nama: string): string | undefined {
  if (nilai === undefined) return undefined
  if (typeof nilai !== 'string') {
    throw new AppError(`Parameter ${nama} hanya boleh diisi satu nilai`, 400)
  }
  const bersih = nilai.trim()
  return bersih === '' ? undefined : bersih
}

function bacaFilter(req: Request): FilterDaftarTenant {
  const slugAplikasi = satuNilai(req.query.aplikasi, 'aplikasi')
  const status = satuNilai(req.query.status, 'status')

  if (status !== undefined && !statusSah(status)) {
    throw new AppError(
      `Status "${status}" tidak dikenal. Pilihan: ${DAFTAR_STATUS.join(', ')}`,
      400,
    )
  }

  return { slugAplikasi, status }
}

/** GET /api/tenant?aplikasi=<slug>&status=<STATUS> */
export async function getDaftarTenant(req: Request, res: Response): Promise<void> {
  const hasil = await ambilDaftarTenant(bacaFilter(req))
  kirimSukses(res, hasil, 'Daftar tenant berhasil diambil')
}

/** GET /api/tenant/:id */
export async function getDetailTenant(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  // id bukan UUID pasti tidak akan ketemu — jawab 404, bukan error database.
  if (!id || !uuidSah(id)) {
    throw new AppError('Tenant tidak ditemukan', 404)
  }

  const tenant = await ambilDetailTenant(id)
  if (!tenant) {
    throw new AppError('Tenant tidak ditemukan', 404)
  }

  kirimSukses(res, tenant, 'Detail tenant berhasil diambil')
}

/** PATCH /api/tenant/:id/status — body: { status } */
export async function patchStatusTenant(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  if (!id || !uuidSah(id)) {
    throw new AppError('Tenant tidak ditemukan', 404)
  }

  const isi = req.body as { status?: unknown } | undefined
  const status = isi?.status

  if (status === undefined || status === null || status === '') {
    throw new AppError('Field status wajib diisi', 400)
  }
  if (typeof status !== 'string' || !statusSah(status)) {
    throw new AppError(
      `Status "${String(status)}" tidak dikenal. Pilihan: ${DAFTAR_STATUS.join(', ')}`,
      400,
    )
  }

  const tenant = await ubahStatusTenant(id, status)
  if (!tenant) {
    throw new AppError('Tenant tidak ditemukan', 404)
  }

  kirimSukses(res, tenant, `Status tenant diubah menjadi ${status}`)
}
