import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DaftarRiwayatPengumuman } from '@/components/broadcast/DaftarRiwayatPengumuman'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi } from '@/components/ui/KartuSeksi'
import { usePengumuman } from '@/context/pengumuman-context'
import { varianDaftar } from '@/lib/motion'

/**
 * Riwayat lengkap pengumuman yang pernah dikirim, termasuk yang baru dikirim
 * pada sesi ini. Sumbernya masih state di memori — endpoint riwayat broadcast
 * belum ada di backend.
 */
export function RiwayatPengumumanPage() {
  const { daftar } = usePengumuman()

  return (
    <>
      <Link
        to="/broadcast"
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke Broadcast
      </Link>

      <JudulHalaman
        judul="Riwayat Pengumuman"
        deskripsi={`${daftar.length} pengumuman pernah dikirim ke tenant.`}
      />

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <KartuSeksi
          judul="Semua pengumuman"
          deskripsi="Terbaru lebih dulu."
          isiRapat
        >
          <DaftarRiwayatPengumuman daftar={daftar} />
        </KartuSeksi>
      </motion.div>
    </>
  )
}
