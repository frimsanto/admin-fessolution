import { Router } from 'express';

import { asyncHandler } from '../middlewares/async-handler.js'
import { requireAuth } from '../middlewares/require-auth.js'
import aplikasiRoutes from '../modules/aplikasi/aplikasi.routes.js'
import authRoutes from '../modules/auth/auth.routes.js'
import billingRoutes from '../modules/billing/billing.routes.js'
import broadcastRoutes from '../modules/broadcast/broadcast.routes.js'
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js'
import notifikasiRoutes from '../modules/notifikasi/notifikasi.routes.js'
import tenantRoutes from '../modules/tenant/tenant.routes.js';

const router = Router();

// --- Rute publik: didaftarkan sebelum guard, jadi tidak butuh token. ---

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Super Admin FES Solution aktif', data: null });
});

router.use('/auth', authRoutes)

// --- Mulai dari sini semua endpoint wajib membawa token super admin. ---

router.use(asyncHandler(requireAuth))

router.use('/dashboard', dashboardRoutes)
router.use('/tenant', tenantRoutes)
router.use('/billing', billingRoutes)
router.use('/apps', aplikasiRoutes);
router.use('/notifikasi', notifikasiRoutes)
router.use('/broadcast', broadcastRoutes)

export default router;
