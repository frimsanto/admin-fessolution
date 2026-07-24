import { Router } from 'express';

import { asyncHandler } from '../../middlewares/async-handler';
import { getRingkasan, getStatistikTenant } from './dashboard.controller';

const router = Router();

router.get('/ringkasan', asyncHandler(getRingkasan));
router.get('/statistik-tenant', asyncHandler(getStatistikTenant));

export default router;
