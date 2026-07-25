import { Router } from 'express'

import { asyncHandler } from '../../middlewares/async-handler.js'
import { postLogin, postLogout } from './auth.controller.js'

const router = Router()

router.post('/login', asyncHandler(postLogin))
router.post('/logout', asyncHandler(postLogout))

export default router
