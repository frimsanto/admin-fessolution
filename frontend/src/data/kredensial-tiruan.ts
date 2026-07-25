import type { SuperAdmin } from '@/types/auth'

/**
 * Kredensial tiruan sementara — endpoint `POST /api/auth/login` belum ada di
 * backend (task-nya masih antre di layer backend).
 *
 * Sengaja ditampilkan di halaman login supaya panel tetap bisa dibuka selama
 * pengembangan. Hapus berkas ini begitu login asli tersambung.
 */
export const KREDENSIAL_TIRUAN = {
  email: 'admin@fessolution.my.id',
  password: 'superadmin123',
} as const

export const SUPER_ADMIN_TIRUAN: SuperAdmin = {
  id: '5e9b1c74-2a83-4f16-b0d9-7c4e8a1f2b60',
  email: KREDENSIAL_TIRUAN.email,
}
