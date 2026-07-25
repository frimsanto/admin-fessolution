import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getDaftarTenant, getDetailTenant, patchStatusTenant } from './tenant.controller.js'

const router = Router()

router.get('/', asyncHandler(getDaftarTenant))
router.get('/:id', asyncHandler(getDetailTenant))
router.patch('/:id/status', asyncHandler(patchStatusTenant))

export default router
