import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { getRiwayatBroadcast, postBroadcast } from './broadcast.controller.js'

const router = Router()

router.get('/', asyncHandler(getRiwayatBroadcast))
router.post('/', asyncHandler(postBroadcast))

export default router
