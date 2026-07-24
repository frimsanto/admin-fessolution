import type { Response } from 'express';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export function kirimSukses<T>(
  res: Response,
  data: T,
  message = 'Berhasil',
  status = 200,
): Response<ApiResponse<T>> {
  return res.status(status).json({ success: true, message, data });
}

export function kirimGagal(
  res: Response,
  message: string,
  status = 400,
): Response<ApiResponse<never>> {
  return res.status(status).json({ success: false, message, data: null });
}
