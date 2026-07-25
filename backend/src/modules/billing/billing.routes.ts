import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import {
  getRiwayatPembayaran,
  getStatusLangganan,
  postKonfirmasiPembayaran,
} from './billing.controller.js'

const router = Router()

router.get('/status-langganan', asyncHandler(getStatusLangganan))
router.get('/pembayaran', asyncHandler(getRiwayatPembayaran))
router.post('/konfirmasi-pembayaran', asyncHandler(postKonfirmasiPembayaran))

export default router
