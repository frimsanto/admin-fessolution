import type { Request, Response } from 'express'

import { AppError } from '../../middlewares/error-handler.js'
import { kirimSukses } from '../../utils/api-response.js'
import { uuidSah } from '../../utils/uuid.js'
import {
  adalahGagal,
  ambilDaftarAplikasi,
  buatAplikasi,
  POLA_SLUG,
  toggleStatusAplikasi,
} from './aplikasi.service.js'

/** GET /api/apps */
export async function getDaftarAplikasi(_req: Request, res: Response): Promise<void> {
  const hasil = await ambilDaftarAplikasi()
  kirimSukses(res, hasil, 'Daftar aplikasi berhasil diambil')
}

const NAMA_MIN = 2
const NAMA_MAKS = 60
const SLUG_MAKS = 40

function bacaTeks(nilai: unknown, nama: string): string {
  if (typeof nilai !== 'string') {
    throw new AppError(`Field ${nama} wajib diisi`, 400)
  }
  const bersih = nilai.trim()
  if (bersih === '') {
    throw new AppError(`Field ${nama} wajib diisi`, 400)
  }
  return bersih
}

/** POST /api/apps — body: { nama, slug } */
export async function postAplikasi(req: Request, res: Response): Promise<void> {
  const isi = (req.body ?? {}) as Record<string, unknown>

  const nama = bacaTeks(isi.nama, 'nama')
  if (nama.length < NAMA_MIN) {
    throw new AppError(`Nama aplikasi minimal ${NAMA_MIN} karakter`, 400)
  }
  if (nama.length > NAMA_MAKS) {
    throw new AppError(`Nama aplikasi maksimal ${NAMA_MAKS} karakter`, 400)
  }

  const slug = bacaTeks(isi.slug, 'slug')
  if (slug.length > SLUG_MAKS) {
    throw new AppError(`Slug maksimal ${SLUG_MAKS} karakter`, 400)
  }
  if (!POLA_SLUG.test(slug)) {
    throw new AppError(
      'Slug hanya boleh huruf kecil, angka, dan tanda hubung. Contoh: laundry-os.',
      400,
    )
  }

  const hasil = await buatAplikasi({ nama, slug })
  if (adalahGagal(hasil)) {
    // 409 Conflict: permintaannya sah, tapi bentrok dengan data yang sudah ada.
    throw new AppError(hasil.pesan, 409)
  }

  kirimSukses(res, hasil, `Aplikasi ${hasil.nama} berhasil ditambahkan`, 201)
}

/** PUT /api/apps/:id/toggle */
export async function putToggleAplikasi(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  if (!id || !uuidSah(id)) {
    throw new AppError('Aplikasi tidak ditemukan', 404)
  }

  const aplikasi = await toggleStatusAplikasi(id)
  if (!aplikasi) {
    throw new AppError('Aplikasi tidak ditemukan', 404)
  }

  kirimSukses(
    res,
    aplikasi,
    `${aplikasi.nama} sekarang ${aplikasi.aktif ? 'berjalan' : 'nonaktif'}`,
  )
}
