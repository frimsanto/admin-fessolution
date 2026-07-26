import { useCallback, useEffect, useState } from 'react'

const KUNCI = 'sidebar-terbuka'

/**
 * Baca pilihan terakhir dari localStorage. Sinkron, jadi sidebar tidak sempat
 * tampil sempit lebih dulu lalu melebar sendiri saat halaman dimuat ulang.
 */
function pulihkanPilihan(): boolean {
  try {
    return localStorage.getItem(KUNCI) === 'ya'
  } catch {
    // localStorage bisa ditolak (mode privat); anggap saja tertutup.
    return false
  }
}

/**
 * Keadaan buka/tutup sidebar. Pilihannya diingat antar kunjungan supaya
 * super admin tidak perlu membukanya lagi setiap kali halaman dimuat ulang.
 */
export function useSidebar() {
  const [terbuka, setTerbuka] = useState<boolean>(pulihkanPilihan)

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI, terbuka ? 'ya' : 'tidak')
    } catch {
      // Gagal menyimpan bukan alasan untuk merusak tampilan.
    }
  }, [terbuka])

  const alihkan = useCallback(() => setTerbuka((lama) => !lama), [])

  return { terbuka, alihkan }
}
