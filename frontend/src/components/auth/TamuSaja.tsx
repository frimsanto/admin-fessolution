import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/context/auth-context'

type StateRute = { dari?: string } | null

/**
 * Rute khusus tamu — halaman login. Yang sudah masuk tidak perlu melihatnya
 * lagi, jadi dilempar ke dashboard (atau kembali ke halaman yang tadi diminta
 * sebelum diminta login).
 */
export function TamuSaja() {
  const { sudahMasuk } = useAuth()
  const location = useLocation()

  if (sudahMasuk) {
    const tujuan = (location.state as StateRute)?.dari ?? '/'
    return <Navigate to={tujuan} replace />
  }

  return <Outlet />
}
