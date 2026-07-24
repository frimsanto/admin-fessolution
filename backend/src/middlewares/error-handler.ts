import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { kirimGagal } from '../utils/api-response';

/** Error aplikasi dengan status HTTP eksplisit. */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  kirimGagal(res, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`, 404);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    kirimGagal(res, err.message, err.status);
    return;
  }

  const pesan = err instanceof Error ? err.message : 'Kesalahan tidak diketahui';
  console.error('[error]', err);

  kirimGagal(
    res,
    env.isProduction ? 'Terjadi kesalahan pada server' : `Terjadi kesalahan pada server: ${pesan}`,
    500,
  );
}
