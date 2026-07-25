import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import {
  getDaftarAplikasi,
  getStatistikAplikasi,
  postAplikasi,
  putToggleAplikasi,
} from './aplikasi.controller.js'

const router = Router()

router.get('/', asyncHandler(getDaftarAplikasi))
router.post('/', asyncHandler(postAplikasi))
router.get('/:id/stats', asyncHandler(getStatistikAplikasi))
router.put('/:id/toggle', asyncHandler(putToggleAplikasi))

export default router
