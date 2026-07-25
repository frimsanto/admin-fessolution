import type { Request, Response } from 'express'

import { AppError } from '../../middlewares/error-handler.js'
import { kirimSukses } from '../../utils/api-response.js'
import { uuidSah } from '../../utils/uuid.js'
import {
  AMBANG_HARI,
  ambilPeringatanMasaAktif,
  ambilRiwayatPembayaran,
  ambilStatusLangganan,
  konfirmasiPembayaran,
} from './billing.service.js'

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

/** Ambang wajar supaya query tidak diminta menarik data bertahun-tahun. */
const AMBANG_MAKS = 365

/** GET /api/billing/peringatan?hari=7 */
export async function getPeringatanMasaAktif(req: Request, res: Response): Promise<void> {
  const hariMentah = req.query.hari
  if (hariMentah !== undefined && typeof hariMentah !== 'string') {
    throw new AppError('Parameter hari hanya boleh diisi satu nilai', 400)
  }

  let ambang = AMBANG_HARI
  if (typeof hariMentah === 'string' && hariMentah.trim() !== '') {
    const angka = Number(hariMentah)
    if (!Number.isInteger(angka) || angka < 0 || angka > AMBANG_MAKS) {
      throw new AppError(
        `Parameter hari harus bilangan bulat antara 0 dan ${AMBANG_MAKS}`,
        400,
      )
    }
    ambang = angka
  }

  const hasil = await ambilPeringatanMasaAktif(ambang)
  kirimSukses(res, hasil, 'Peringatan masa aktif berhasil diambil')
}

/** GET /api/billing/pembayaran?tenantId=<uuid>&aplikasi=<slug> */
export async function getRiwayatPembayaran(req: Request, res: Response): Promise<void> {
  const tenantId = req.query.tenantId
  if (tenantId !== undefined && typeof tenantId !== 'string') {
    throw new AppError('Parameter tenantId hanya boleh diisi satu nilai', 400)
  }
  if (typeof tenantId === 'string' && tenantId.trim() !== '' && !uuidSah(tenantId.trim())) {
    throw new AppError('Parameter tenantId bukan UUID yang sah', 400)
  }

  const hasil = await ambilRiwayatPembayaran({
    tenantId: typeof tenantId === 'string' && tenantId.trim() !== '' ? tenantId.trim() : undefined,
    slugAplikasi: slugOpsional(req),
  })

  kirimSukses(res, hasil, 'Riwayat pembayaran berhasil diambil')
}

/** Batas atas mengikuti kolom Decimal(14,2) di database. */
const JUMLAH_MAKS = 999_999_999_999.99
const CATATAN_MAKS = 200

/** POST /api/billing/konfirmasi-pembayaran — body: { tenantId, jumlah, catatanAdmin?, hariPerpanjangan? } */
export async function postKonfirmasiPembayaran(req: Request, res: Response): Promise<void> {
  const isi = (req.body ?? {}) as Record<string, unknown>

  const tenantId = isi.tenantId
  if (typeof tenantId !== 'string' || !uuidSah(tenantId)) {
    throw new AppError('Tenant tidak ditemukan', 404)
  }

  const jumlah = isi.jumlah
  if (jumlah === undefined || jumlah === null || jumlah === '') {
    throw new AppError('Field jumlah wajib diisi', 400)
  }
  if (typeof jumlah !== 'number' || !Number.isFinite(jumlah)) {
    throw new AppError('Field jumlah harus berupa angka', 400)
  }
  if (jumlah <= 0) {
    throw new AppError('Jumlah pembayaran harus lebih dari nol', 400)
  }
  if (jumlah > JUMLAH_MAKS) {
    throw new AppError('Jumlah pembayaran melebihi batas yang bisa disimpan', 400)
  }

  const catatanMentah = isi.catatanAdmin
  if (catatanMentah !== undefined && catatanMentah !== null && typeof catatanMentah !== 'string') {
    throw new AppError('Field catatanAdmin harus berupa teks', 400)
  }
  const catatanAdmin =
    typeof catatanMentah === 'string' && catatanMentah.trim() !== ''
      ? catatanMentah.trim()
      : null
  if (catatanAdmin && catatanAdmin.length > CATATAN_MAKS) {
    throw new AppError(`Catatan admin maksimal ${CATATAN_MAKS} karakter`, 400)
  }

  const hariMentah = isi.hariPerpanjangan
  if (hariMentah !== undefined) {
    if (typeof hariMentah !== 'number' || !Number.isInteger(hariMentah) || hariMentah <= 0) {
      throw new AppError('Field hariPerpanjangan harus bilangan bulat positif', 400)
    }
  }

  const hasil = await konfirmasiPembayaran({
    tenantId,
    jumlah,
    catatanAdmin,
    hariPerpanjangan: hariMentah as number | undefined,
  })

  if (!hasil) {
    throw new AppError('Tenant tidak ditemukan', 404)
  }

  kirimSukses(res, hasil, 'Pembayaran berhasil dikonfirmasi', 201)
}
