import { Router } from 'express';

import aplikasiRoutes from '../modules/aplikasi/aplikasi.routes.js'
import billingRoutes from '../modules/billing/billing.routes.js'
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js'
import tenantRoutes from '../modules/tenant/tenant.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Super Admin FES Solution aktif', data: null });
});

router.use('/dashboard', dashboardRoutes)
router.use('/tenant', tenantRoutes)
router.use('/billing', billingRoutes)
router.use('/apps', aplikasiRoutes);

export default router;
