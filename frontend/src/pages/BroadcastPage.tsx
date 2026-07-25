import { motion } from 'framer-motion'

import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { varianDaftar } from '@/lib/motion'

/**
 * Halaman Notifikasi & Broadcast.
 *
 * Kerangka halamannya dulu: dua seksi yang jadi tempat formulir pengumuman dan
 * riwayat pengiriman. Isinya menyusul pada task-task berikutnya di fitur ini.
 */
export function BroadcastPage() {
  return (
    <>
      <JudulHalaman
        judul="Notifikasi & Broadcast"
        deskripsi="Kirim pengumuman ke seluruh tenant atau ke satu aplikasi tertentu."
      />

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <KartuSeksi
          judul="Kirim pengumuman"
          deskripsi="Pilih sasaran pengumuman, lalu tulis judul dan isinya."
        >
          <SeksiKosong pesan="Formulir pengumuman belum dibuat." />
        </KartuSeksi>

        <KartuSeksi
          judul="Riwayat pengumuman"
          deskripsi="Pengumuman yang sudah pernah dikirim super admin."
          isiRapat
        >
          <SeksiKosong pesan="Riwayat pengumuman belum dibuat." />
        </KartuSeksi>
      </motion.div>
    </>
  )
}
