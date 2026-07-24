import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Bungkus controller async supaya error-nya diteruskan ke error handler Express
 * (Express 4 tidak menangkap rejected promise secara otomatis).
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
