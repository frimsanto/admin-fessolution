import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getDaftarAplikasi, postAplikasi } from './aplikasi.controller.js'

const router = Router()

router.get('/', asyncHandler(getDaftarAplikasi))
router.post('/', asyncHandler(postAplikasi))

export default router
