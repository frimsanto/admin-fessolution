import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getStatusLangganan } from './billing.controller.js'

const router = Router()

router.get('/status-langganan', asyncHandler(getStatusLangganan))

export default router
