import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getDaftarTenant, getDetailTenant } from './tenant.controller.js'

const router = Router()

router.get('/', asyncHandler(getDaftarTenant))
router.get('/:id', asyncHandler(getDetailTenant))

export default router
