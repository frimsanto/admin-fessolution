import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getStatusLangganan, postKonfirmasiPembayaran } from './billing.controller.js'

const router = Router()

router.get('/status-langganan', asyncHandler(getStatusLangganan))
router.post('/konfirmasi-pembayaran', asyncHandler(postKonfirmasiPembayaran))

export default router
