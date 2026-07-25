/** Isian formulir login super admin. */
export type IsianLogin = {
  email: string
  password: string
}

/**
 * Akun super admin yang sedang masuk.
 *
 * Mengikuti model `SuperAdmin` di backend, tanpa `passwordHash` — hash tidak
 * pernah dikirim ke frontend.
 */
export type SuperAdmin = {
  id: string
  nama: string
  email: string
}

/** Balasan `POST /api/auth/login`. */
export type HasilLogin = {
  token: string
  admin: SuperAdmin
}
