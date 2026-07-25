import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DaftarRiwayatPengumuman } from '@/components/broadcast/DaftarRiwayatPengumuman'
import { FormPengumuman } from '@/components/broadcast/FormPengumuman'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { KeadaanGagal } from '@/components/ui/KeadaanMuat'
import { usePengumuman } from '@/context/pengumuman-context'
import { useDaftarAplikasi } from '@/hooks/useDaftarAplikasi'
import { varianDaftar } from '@/lib/motion'
import { labelSasaran } from '@/lib/pengumuman'
import type { IsianPengumuman } from '@/types/pengumuman'

/**
 * Halaman Notifikasi & Broadcast.
 *
 * Pengirimannya belum tersambung ke backend — endpoint broadcast belum ada,
 * jadi pemberitahuan sukses menyebutkan itu terus terang. Penyambungannya
 * task tersendiri.
 */
export function BroadcastPage() {
  // Sasaran pengumuman diambil dari daftar aplikasi yang sebenarnya — endpoint
  // /api/apps sudah tersedia, jadi tidak perlu data tiruan di sini.
  const { memuat, daftar, pesanGagal, muatUlang } = useDaftarAplikasi()
  const { daftar: riwayat, kirim } = usePengumuman()

  const [pemberitahuan, setPemberitahuan] = useState<string | null>(null)
  // Ganti key = formulir dipasang ulang, jadi isiannya bersih setelah terkirim.
  const [kunciForm, setKunciForm] = useState(0)

  function kirimPengumuman(isian: IsianPengumuman) {
    const aplikasi = daftar.find((item) => item.appId === isian.appId)

    const penerima =
      isian.appId === null
        ? daftar.reduce((jumlah, item) => jumlah + item.jumlahTenant, 0)
        : (aplikasi?.jumlahTenant ?? 0)

    // Aplikasi lengkap (nama + slug) dibutuhkan riwayat; formulir hanya tahu id.
    const terkirim = kirim(
      isian,
      aplikasi ? { appId: aplikasi.appId, nama: aplikasi.nama, slug: aplikasi.slug } : null,
    )

    setPemberitahuan(
      `Pengumuman "${terkirim.judul}" dikirim ke ${labelSasaran(terkirim)} — ${penerima} tenant. Belum benar-benar tersimpan: endpoint broadcast belum tersedia di backend.`,
    )
    setKunciForm((n) => n + 1)
  }

  return (
    <>
      <JudulHalaman
        judul="Notifikasi & Broadcast"
        deskripsi="Kirim pengumuman ke seluruh tenant atau ke satu aplikasi tertentu."
      />

      <AnimatePresence>
        {pemberitahuan && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent-bright" aria-hidden="true" />
            <span className="flex-1">{pemberitahuan}</span>
            <button
              type="button"
              onClick={() => setPemberitahuan(null)}
              className="shrink-0 text-xs text-ink-faint transition-colors hover:text-ink"
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <KartuSeksi
          judul="Kirim pengumuman"
          deskripsi="Pilih sasaran pengumuman, lalu tulis judul dan isinya."
        >
          {memuat ? (
            <SeksiKosong pesan="Memuat daftar aplikasi…" />
          ) : pesanGagal ? (
            <KeadaanGagal
              judul="Gagal memuat daftar aplikasi"
              pesan={pesanGagal}
              onCobaLagi={muatUlang}
            />
          ) : (
            <FormPengumuman
              key={kunciForm}
              daftarAplikasi={daftar}
              onKirim={kirimPengumuman}
            />
          )}
        </KartuSeksi>

        <KartuSeksi
          judul="Riwayat pengumuman"
          deskripsi="Pengumuman terakhir yang dikirim super admin."
          aksi={
            <Link
              to="/broadcast/riwayat"
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline px-2.5 py-1 text-xs text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
            >
              Lihat semua
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
          isiRapat
        >
          <DaftarRiwayatPengumuman daftar={riwayat} batas={3} />
        </KartuSeksi>
      </motion.div>
    </>
  )
}
