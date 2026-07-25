import type { Request, Response } from 'express'

import { AppError } from '../../middlewares/error-handler.js'
import { kirimSukses } from '../../utils/api-response.js'
import {
  adalahGagal,
  ambilRiwayatBroadcast,
  DAFTAR_SASARAN,
  DAFTAR_STATUS,
  kirimBroadcast,
  sasaranSah,
  statusSah,
  type FilterBroadcast,
} from './broadcast.service.js'

/** Ambil satu nilai query; array (mis. ?status=A&status=B) ditolak. */
function satuNilai(nilai: unknown, nama: string): string | undefined {
  if (nilai === undefined) return undefined
  if (typeof nilai !== 'string') {
    throw new AppError(`Parameter ${nama} hanya boleh diisi satu nilai`, 400)
  }
  const bersih = nilai.trim()
  return bersih === '' ? undefined : bersih
}

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

function teksOpsional(nilai: unknown, nama: string): string | undefined {
  if (nilai === undefined || nilai === null || nilai === '') return undefined
  if (typeof nilai !== 'string') {
    throw new AppError(`Field ${nama} harus berupa teks`, 400)
  }
  const bersih = nilai.trim()
  return bersih === '' ? undefined : bersih
}

type BodyBroadcast = {
  judul?: unknown
  isi?: unknown
  sasaran?: unknown
  aplikasiSlug?: unknown
  tenantId?: unknown
  status?: unknown
}

/** POST /api/broadcast — body: { judul, isi, sasaran, aplikasiSlug?, tenantId?, status? } */
export async function postBroadcast(req: Request, res: Response): Promise<void> {
  const body = (req.body ?? {}) as BodyBroadcast

  const judul = teksWajib(body.judul, 'judul')
  const isi = teksWajib(body.isi, 'isi')
  const sasaran = teksWajib(body.sasaran, 'sasaran')

  if (!sasaranSah(sasaran)) {
    throw new AppError(
      `Sasaran "${sasaran}" tidak dikenal. Pilihan: ${DAFTAR_SASARAN.join(', ')}`,
      400,
    )
  }

  const status = teksOpsional(body.status, 'status')
  if (status !== undefined && !statusSah(status)) {
    throw new AppError(
      `Status "${status}" tidak dikenal. Pilihan: ${DAFTAR_STATUS.join(', ')}`,
      400,
    )
  }

  const hasil = await kirimBroadcast({
    judul,
    isi,
    sasaran,
    aplikasiSlug: teksOpsional(body.aplikasiSlug, 'aplikasiSlug'),
    tenantId: teksOpsional(body.tenantId, 'tenantId'),
    ...(status !== undefined ? { status } : {}),
  })

  if (adalahGagal(hasil)) {
    throw new AppError(hasil.pesan, 400)
  }

  kirimSukses(res, hasil, `Pengumuman terkirim ke ${hasil.jumlahPenerima} tenant`, 201)
}

/** GET /api/broadcast?sasaran=<SASARAN>&status=<STATUS> */
export async function getRiwayatBroadcast(req: Request, res: Response): Promise<void> {
  const sasaran = satuNilai(req.query.sasaran, 'sasaran')
  const status = satuNilai(req.query.status, 'status')

  if (sasaran !== undefined && !sasaranSah(sasaran)) {
    throw new AppError(
      `Sasaran "${sasaran}" tidak dikenal. Pilihan: ${DAFTAR_SASARAN.join(', ')}`,
      400,
    )
  }
  if (status !== undefined && !statusSah(status)) {
    throw new AppError(
      `Status "${status}" tidak dikenal. Pilihan: ${DAFTAR_STATUS.join(', ')}`,
      400,
    )
  }

  const filter: FilterBroadcast = { sasaran, status }
  const hasil = await ambilRiwayatBroadcast(filter)

  kirimSukses(res, hasil, 'Riwayat pengumuman berhasil diambil')
}
