import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { KartuAplikasi } from '@/components/aplikasi/KartuAplikasi'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { ModalKonfirmasi } from '@/components/ui/ModalKonfirmasi'
import { DAFTAR_APLIKASI_TIRUAN } from '@/data/aplikasi-tiruan'
import { varianDaftar } from '@/lib/motion'
import type { Aplikasi } from '@/types/aplikasi'

export function DaftarAplikasiPage() {
  // Data tiruan — diganti panggilan API saat endpoint aplikasi tersedia.
  const [daftar, setDaftar] = useState<Aplikasi[]>(DAFTAR_APLIKASI_TIRUAN)
  const [akanDinonaktifkan, setAkanDinonaktifkan] = useState<Aplikasi | null>(null)
  const [pemberitahuan, setPemberitahuan] = useState<string | null>(null)

  const berjalan = daftar.filter((aplikasi) => aplikasi.aktif).length

  function terapkanStatus(target: Aplikasi, aktif: boolean) {
    setDaftar((lama) =>
      lama.map((aplikasi) => (aplikasi.appId === target.appId ? { ...aplikasi, aktif } : aplikasi)),
    )
    setPemberitahuan(
      `${target.nama} sekarang ${aktif ? 'berjalan' : 'nonaktif'}. Perubahan ini belum tersimpan — endpoint aplikasi belum tersedia.`,
    )
  }

  function ubahStatus(target: Aplikasi) {
    // Menonaktifkan aplikasi berdampak ke semua tenantnya, jadi minta konfirmasi.
    // Mengaktifkan kembali tidak merugikan siapa pun, jadi langsung diterapkan.
    if (target.aktif) {
      setAkanDinonaktifkan(target)
      return
    }
    terapkanStatus(target, true)
  }

  return (
    <>
      <JudulHalaman
        judul="Manajemen Aplikasi"
        deskripsi={`${berjalan} dari ${daftar.length} aplikasi sedang berjalan.`}
      />

      <AnimatePresence>
        {pemberitahuan && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink"
          >
            <span>{pemberitahuan}</span>
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

      <motion.div
        variants={varianDaftar}
        initial="awal"
        animate="tampil"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {daftar.map((aplikasi) => (
          <KartuAplikasi key={aplikasi.appId} aplikasi={aplikasi} onUbahStatus={ubahStatus} />
        ))}
      </motion.div>

      <ModalKonfirmasi
        terbuka={akanDinonaktifkan !== null}
        judul="Nonaktifkan aplikasi ini?"
        bahaya
        labelKonfirmasi="Ya, nonaktifkan"
        onBatal={() => setAkanDinonaktifkan(null)}
        onKonfirmasi={() => {
          if (akanDinonaktifkan) terapkanStatus(akanDinonaktifkan, false)
          setAkanDinonaktifkan(null)
        }}
        deskripsi={
          akanDinonaktifkan && (
            <>
              <span className="font-medium text-ink">{akanDinonaktifkan.nama}</span> akan berhenti
              melayani seluruh{' '}
              <span className="font-medium text-ink">
                {akanDinonaktifkan.jumlahTenant} tenant
              </span>{' '}
              yang memakainya, termasuk {akanDinonaktifkan.jumlahTenantAktif} yang berlangganan
              aktif. Aplikasi bisa dijalankan lagi kapan saja.
            </>
          )
        }
      />
    </>
  )
}
