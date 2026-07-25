import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import {
  getDaftarNotifikasi,
  patchNotifikasiDibaca,
  patchSemuaNotifikasiDibaca,
} from './notifikasi.controller.js'

const router = Router()

router.get('/', asyncHandler(getDaftarNotifikasi))
// Didaftarkan lebih dulu supaya tidak tertangkap pola `/:id`.
router.patch('/baca-semua', asyncHandler(patchSemuaNotifikasiDibaca))
router.patch('/:id/baca', asyncHandler(patchNotifikasiDibaca))

export default router
