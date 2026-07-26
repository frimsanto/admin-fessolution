import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DaftarRiwayatPengumuman } from '@/components/broadcast/DaftarRiwayatPengumuman'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { KeadaanGagal } from '@/components/ui/KeadaanMuat'
import { usePengumuman } from '@/context/pengumuman-context'
import { varianDaftar } from '@/lib/motion'

/**
 * Riwayat lengkap pengumuman yang pernah dikirim, dibaca dari
 * `GET /api/broadcast` — termasuk yang baru dikirim pada sesi ini.
 */
export function RiwayatPengumumanPage() {
  const { daftar, memuat, pesanGagal, muatUlang } = usePengumuman()

  const deskripsi = memuat
    ? 'Memuat riwayat pengumuman…'
    : pesanGagal
      ? 'Riwayat pengumuman tidak dapat ditampilkan.'
      : `${daftar.length} pengumuman pernah dikirim ke tenant.`

  return (
    <>
      <Link
        to="/broadcast"
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke Broadcast
      </Link>

      <JudulHalaman judul="Riwayat Pengumuman" deskripsi={deskripsi} />

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <KartuSeksi judul="Semua pengumuman" deskripsi="Terbaru lebih dulu." isiRapat>
          {memuat ? (
            <SeksiKosong pesan="Memuat riwayat pengumuman…" />
          ) : pesanGagal ? (
            <KeadaanGagal
              judul="Gagal memuat riwayat pengumuman"
              pesan={pesanGagal}
              onCobaLagi={muatUlang}
            />
          ) : (
            <DaftarRiwayatPengumuman daftar={daftar} />
          )}
        </KartuSeksi>
      </motion.div>
    </>
  )
}
