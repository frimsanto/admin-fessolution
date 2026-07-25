import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import {
  getPeringatanMasaAktif,
  getRiwayatPembayaran,
  getStatusLangganan,
  postKonfirmasiPembayaran,
} from './billing.controller.js'

const router = Router()

router.get('/status-langganan', asyncHandler(getStatusLangganan))
router.get('/peringatan', asyncHandler(getPeringatanMasaAktif))
router.get('/pembayaran', asyncHandler(getRiwayatPembayaran))
router.post('/konfirmasi-pembayaran', asyncHandler(postKonfirmasiPembayaran))

export default router
