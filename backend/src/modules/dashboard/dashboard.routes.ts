import { Router } from 'express';

import { asyncHandler } from '../../middlewares/async-handler';
import { getDaftarAplikasi, getRingkasan, getStatistikTenant } from './dashboard.controller';

const router = Router();

router.get('/ringkasan', asyncHandler(getRingkasan));
router.get('/statistik-tenant', asyncHandler(getStatistikTenant));
router.get('/daftar-aplikasi', asyncHandler(getDaftarAplikasi));

export default router;
