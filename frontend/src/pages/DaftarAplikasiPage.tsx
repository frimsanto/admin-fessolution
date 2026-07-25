import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { Plus } from 'lucide-react'

import { KartuAplikasi } from '@/components/aplikasi/KartuAplikasi'
import { ModalTambahAplikasi } from '@/components/aplikasi/ModalTambahAplikasi'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KeadaanGagal, KerangkaKartu } from '@/components/ui/KeadaanMuat'
import { ModalKonfirmasi } from '@/components/ui/ModalKonfirmasi'
import { useDaftarAplikasi } from '@/hooks/useDaftarAplikasi'
import { varianDaftar } from '@/lib/motion'
import { tambahAplikasi, toggleStatusAplikasi } from '@/services/aplikasi'
import type { Aplikasi, IsianAplikasiBaru } from '@/types/aplikasi'

export function DaftarAplikasiPage() {
  const { memuat, daftar, pesanGagal, muatUlang, gantiAplikasi, tambahKeDaftar } =
    useDaftarAplikasi()

  const [akanDinonaktifkan, setAkanDinonaktifkan] = useState<Aplikasi | null>(null)
  const [formulirTerbuka, setFormulirTerbuka] = useState(false)
  const [pemberitahuan, setPemberitahuan] = useState<string | null>(null)

  const [menyimpanStatus, setMenyimpanStatus] = useState(false)
  /** Galat toggle lewat modal (menonaktifkan) — ditampilkan di dalam modal. */
  const [galatNonaktif, setGalatNonaktif] = useState<string | null>(null)
  /** Galat toggle tanpa modal (mengaktifkan) — ditampilkan sebagai banner halaman. */
  const [galatAksi, setGalatAksi] = useState<string | null>(null)

  const [menyimpanBaru, setMenyimpanBaru] = useState(false)
  const [galatBaru, setGalatBaru] = useState<string | null>(null)

  const berjalan = daftar.filter((aplikasi) => aplikasi.aktif).length

  /** Mengembalikan pesan galat, atau null kalau berhasil. */
  async function jalankanToggle(target: Aplikasi): Promise<string | null> {
    setMenyimpanStatus(true)

    try {
      const diperbarui = await toggleStatusAplikasi(target.appId)
      gantiAplikasi(diperbarui)
      setPemberitahuan(
        `${diperbarui.nama} sekarang ${diperbarui.aktif ? 'berjalan' : 'nonaktif'}.`,
      )
      return null
    } catch (err: unknown) {
      return err instanceof Error ? err.message : 'Gagal mengubah status aplikasi'
    } finally {
      setMenyimpanStatus(false)
    }
  }

  async function ubahStatus(target: Aplikasi) {
    // Menonaktifkan aplikasi berdampak ke semua tenantnya, jadi minta konfirmasi.
    // Mengaktifkan kembali tidak merugikan siapa pun, jadi langsung diterapkan.
    if (target.aktif) {
      setGalatNonaktif(null)
      setAkanDinonaktifkan(target)
      return
    }

    setGalatAksi(await jalankanToggle(target))
  }

  async function konfirmasiNonaktif() {
    if (!akanDinonaktifkan) return

    const galat = await jalankanToggle(akanDinonaktifkan)
    // Modal tetap terbuka saat gagal supaya aksinya bisa langsung dicoba lagi.
    if (galat) {
      setGalatNonaktif(galat)
      return
    }
    setAkanDinonaktifkan(null)
  }

  async function simpanAplikasiBaru(isian: IsianAplikasiBaru) {
    setMenyimpanBaru(true)
    setGalatBaru(null)

    try {
      const aplikasi = await tambahAplikasi(isian)
      tambahKeDaftar(aplikasi)
      setFormulirTerbuka(false)
      setPemberitahuan(`${aplikasi.nama} ditambahkan dan langsung berjalan.`)
    } catch (err: unknown) {
      setGalatBaru(err instanceof Error ? err.message : 'Gagal menambahkan aplikasi')
    } finally {
      setMenyimpanBaru(false)
    }
  }

  const deskripsi = memuat
    ? 'Memuat daftar aplikasi…'
    : pesanGagal
      ? 'Daftar aplikasi tidak dapat ditampilkan.'
      : `${berjalan} dari ${daftar.length} aplikasi sedang berjalan.`

  return (
    <>
      <JudulHalaman
        judul="Manajemen Aplikasi"
        deskripsi={deskripsi}
        aksi={
          <button
            type="button"
            onClick={() => {
              setGalatBaru(null)
              setFormulirTerbuka(true)
            }}
            disabled={memuat || pesanGagal !== null}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" />
            Tambah aplikasi
          </button>
        }
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

        {galatAksi && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-expired/30 bg-expired/10 px-4 py-3 text-sm text-ink"
          >
            <span>{galatAksi}</span>
            <button
              type="button"
              onClick={() => setGalatAksi(null)}
              className="shrink-0 text-xs text-ink-faint transition-colors hover:text-ink"
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {memuat ? (
        <KerangkaKartu />
      ) : pesanGagal ? (
        <KeadaanGagal
          judul="Gagal memuat daftar aplikasi"
          pesan={pesanGagal}
          onCobaLagi={muatUlang}
        />
      ) : (
        <motion.div
          variants={varianDaftar}
          initial="awal"
          animate="tampil"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {daftar.map((aplikasi) => (
            <KartuAplikasi
              key={aplikasi.appId}
              aplikasi={aplikasi}
              onUbahStatus={(target) => void ubahStatus(target)}
            />
          ))}
        </motion.div>
      )}

      <ModalTambahAplikasi
        terbuka={formulirTerbuka}
        daftar={daftar}
        sedangProses={menyimpanBaru}
        galatServer={galatBaru}
        onBatal={() => {
          setFormulirTerbuka(false)
          setGalatBaru(null)
        }}
        onSimpan={(isian) => void simpanAplikasiBaru(isian)}
      />

      <ModalKonfirmasi
        terbuka={akanDinonaktifkan !== null}
        judul="Nonaktifkan aplikasi ini?"
        bahaya
        labelKonfirmasi="Ya, nonaktifkan"
        sedangProses={menyimpanStatus}
        galat={galatNonaktif}
        onBatal={() => {
          setAkanDinonaktifkan(null)
          setGalatNonaktif(null)
        }}
        onKonfirmasi={() => void konfirmasiNonaktif()}
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
