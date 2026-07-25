import type { IsiToken } from '../modules/auth/auth.service.js'

/**
 * `req.admin` diisi oleh middleware `requireAuth`. Opsional karena rute publik
 * (health, auth) tidak melewatinya — controller di balik guard boleh
 * menganggapnya selalu ada.
 */
declare global {
  namespace Express {
    interface Request {
      admin?: IsiToken
    }
  }
}

export {}
