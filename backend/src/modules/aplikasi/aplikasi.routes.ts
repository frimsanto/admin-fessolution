import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getDaftarAplikasi } from './aplikasi.controller.js'

const router = Router()

router.get('/', asyncHandler(getDaftarAplikasi))

export default router
