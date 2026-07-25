import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/auth-context'
import { pasangPenanganSesiBerakhir } from '@/lib/api'

/**
 * Menyambungkan penolakan 401 dari lapisan API ke router: sesi dibuang dan
 * pengguna diarahkan ke halaman login, membawa halaman asalnya supaya bisa
 * dikembalikan setelah masuk lagi.
 *
 * Tidak menggambar apa pun — dipasang sekali di dalam router.
 */
export function InterceptorSesi() {
  const { buangSesi } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    pasangPenanganSesiBerakhir(() => {
      // Dibaca saat 401 terjadi, bukan saat efek dipasang, supaya alamatnya
      // benar-benar halaman yang sedang dibuka.
      const sekarang = window.location.pathname

      // Sudah di halaman login — 401 di sini berarti kredensialnya salah,
      // bukan sesi habis. Jangan dialihkan supaya tidak berputar.
      if (sekarang === '/login') return

      buangSesi()
      navigate('/login', { replace: true, state: { dari: sekarang } })
    })

    return () => pasangPenanganSesiBerakhir(null)
  }, [buangSesi, navigate])

  return null
}
