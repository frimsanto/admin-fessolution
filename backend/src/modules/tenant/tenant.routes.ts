import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getDaftarTenant } from './tenant.controller.js'

const router = Router()

router.get('/', asyncHandler(getDaftarTenant))

export default router
