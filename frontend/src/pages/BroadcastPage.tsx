import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DaftarRiwayatPengumuman } from '@/components/broadcast/DaftarRiwayatPengumuman'
import { FormPengumuman } from '@/components/broadcast/FormPengumuman'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { KeadaanGagal } from '@/components/ui/KeadaanMuat'
import { PENGUMUMAN_TIRUAN } from '@/data/pengumuman-tiruan'
import { useDaftarAplikasi } from '@/hooks/useDaftarAplikasi'
import { varianDaftar } from '@/lib/motion'
import type { IsianPengumuman } from '@/types/pengumuman'

/**
 * Halaman Notifikasi & Broadcast.
 *
 * Formulirnya sudah lengkap, tapi pengirimannya belum tersambung: endpoint
 * broadcast belum ada di backend. Penyambungannya task tersendiri.
 */
export function BroadcastPage() {
  // Sasaran pengumuman diambil dari daftar aplikasi yang sebenarnya — endpoint
  // /api/apps sudah tersedia, jadi tidak perlu data tiruan di sini.
  const { memuat, daftar, pesanGagal, muatUlang } = useDaftarAplikasi()

  const [catatan, setCatatan] = useState<string | null>(null)

  function kirimPengumuman(isian: IsianPengumuman) {
    const sasaran =
      isian.appId === null
        ? 'seluruh aplikasi'
        : (daftar.find((item) => item.appId === isian.appId)?.nama ?? 'aplikasi terpilih')

    setCatatan(
      `Pengumuman "${isian.judul}" untuk ${sasaran} belum benar-benar terkirim — endpoint broadcast belum tersedia di backend.`,
    )
  }

  return (
    <>
      <JudulHalaman
        judul="Notifikasi & Broadcast"
        deskripsi="Kirim pengumuman ke seluruh tenant atau ke satu aplikasi tertentu."
      />

      {catatan && (
        <div
          role="status"
          className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-suspended/30 bg-suspended/10 px-4 py-3 text-sm text-ink"
        >
          <span>{catatan}</span>
          <button
            type="button"
            onClick={() => setCatatan(null)}
            className="shrink-0 text-xs text-ink-faint transition-colors hover:text-ink"
          >
            Tutup
          </button>
        </div>
      )}

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
            <FormPengumuman daftarAplikasi={daftar} onKirim={kirimPengumuman} />
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
          <DaftarRiwayatPengumuman daftar={PENGUMUMAN_TIRUAN} batas={3} />
        </KartuSeksi>
      </motion.div>
    </>
  )
}
