import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/context/auth-context'

/**
 * Seluruh isi panel ada di balik guard ini: tanpa sesi, permintaan halaman
 * apa pun dialihkan ke login.
 *
 * Alamat yang tadi diminta ikut dibawa lewat state `dari`, jadi setelah masuk
 * pengguna kembali ke tempat yang dituju — bukan selalu ke dashboard.
 */
export function RuteTerlindungi() {
  const { sudahMasuk } = useAuth()
  const location = useLocation()

  if (!sudahMasuk) {
    return (
      <Navigate to="/login" replace state={{ dari: `${location.pathname}${location.search}` }} />
    )
  }

  return <Outlet />
}
