import type { Request, Response } from 'express';

import { kirimSukses } from '../../utils/api-response.js';
import {
  ambilDaftarAplikasi,
  ambilRingkasanDashboard,
  ambilStatistikTenant,
} from './dashboard.service.js';

/** GET /api/dashboard/ringkasan */
export async function getRingkasan(_req: Request, res: Response): Promise<void> {
  const ringkasan = await ambilRingkasanDashboard();
  kirimSukses(res, ringkasan, 'Ringkasan dashboard berhasil diambil');
}

/** GET /api/dashboard/statistik-tenant */
export async function getStatistikTenant(_req: Request, res: Response): Promise<void> {
  const statistik = await ambilStatistikTenant();
  kirimSukses(res, statistik, 'Statistik tenant berhasil diambil');
}

/** GET /api/dashboard/daftar-aplikasi */
export async function getDaftarAplikasi(_req: Request, res: Response): Promise<void> {
  const aplikasi = await ambilDaftarAplikasi();
  kirimSukses(res, aplikasi, 'Daftar aplikasi berhasil diambil');
}
