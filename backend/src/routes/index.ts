import { Router } from 'express';

import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Super Admin FES Solution aktif', data: null });
});

router.use('/dashboard', dashboardRoutes);

export default router;
