import { motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'

import {
  adaGalat,
  JUDUL_MAKS,
  PESAN_MAKS,
  validasiPengumuman,
  type GalatPengumuman,
} from '@/lib/validasi-pengumuman'
import type { Aplikasi } from '@/types/aplikasi'
import type { IsianPengumuman } from '@/types/pengumuman'

/** Nilai sasaran "seluruh aplikasi"; dikirim ke backend sebagai appId null. */
const SEMUA = 'SEMUA'

type Props = {
  /** Pilihan sasaran. Kosong selama daftar aplikasi belum dimuat. */
  daftarAplikasi: Aplikasi[]
  sedangMengirim?: boolean
  /** Pesan kegagalan dari server, ditampilkan di bawah tombol kirim. */
  galatServer?: string | null
  onKirim: (isian: IsianPengumuman) => void
}

type PropsSasaran = {
  label: string
  jumlahTenant: number
  aktif: boolean
  nonaktif: boolean
  onClick: () => void
}

function PilihanSasaran({ label, jumlahTenant, aktif, nonaktif, onClick }: PropsSasaran) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={aktif}
      disabled={nonaktif}
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
        aktif
          ? 'border-accent/40 text-accent-bright'
          : 'border-hairline text-ink-muted hover:bg-surface-hover hover:text-ink'
      }`}
    >
      {aktif && (
        <motion.span
          layoutId="penanda-sasaran-pengumuman"
          className="absolute inset-0 rounded-lg bg-accent-soft"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative">{label}</span>
      <span className="relative text-xs tabular-nums opacity-70">{jumlahTenant}</span>
    </button>
  )
}

export function FormPengumuman({
  daftarAplikasi,
  sedangMengirim = false,
  galatServer = null,
  onKirim,
}: Props) {
  const [sasaran, setSasaran] = useState<string>(SEMUA)
  const [judul, setJudul] = useState('')
  const [pesan, setPesan] = useState('')
  const [galat, setGalat] = useState<GalatPengumuman>({})

  const totalTenant = daftarAplikasi.reduce((jumlah, item) => jumlah + item.jumlahTenant, 0)
  const terpilih = daftarAplikasi.find((item) => item.appId === sasaran)
  const penerima = sasaran === SEMUA ? totalTenant : (terpilih?.jumlahTenant ?? 0)

  function kirim() {
    const isian: IsianPengumuman = {
      appId: sasaran === SEMUA ? null : sasaran,
      judul: judul.trim(),
      pesan: pesan.trim(),
    }

    const hasil = validasiPengumuman(isian)
    setGalat(hasil)
    if (adaGalat(hasil)) return

    onKirim(isian)
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        kirim()
      }}
    >
      <div role="radiogroup" aria-label="Sasaran pengumuman">
        <span className="mb-2 block text-xs text-ink-muted">Sasaran</span>

        <div className="flex flex-wrap items-center gap-2">
          <PilihanSasaran
            label="Semua aplikasi"
            jumlahTenant={totalTenant}
            aktif={sasaran === SEMUA}
            nonaktif={sedangMengirim}
            onClick={() => setSasaran(SEMUA)}
          />

          {daftarAplikasi.map((aplikasi) => (
            <PilihanSasaran
              key={aplikasi.appId}
              label={aplikasi.nama}
              jumlahTenant={aplikasi.jumlahTenant}
              aktif={sasaran === aplikasi.appId}
              nonaktif={sedangMengirim}
              onClick={() => setSasaran(aplikasi.appId)}
            />
          ))}
        </div>

        <p className="mt-2 text-xs text-ink-faint">
          {/* Angka ini yang menahan pengumuman salah sasaran, jadi ditampilkan
              terus — bukan hanya saat sasarannya satu aplikasi. */}
          Akan dikirim ke <span className="tabular-nums">{penerima}</span> tenant.
        </p>
      </div>

      <div>
        <label htmlFor="judul-pengumuman" className="mb-1.5 block text-xs text-ink-muted">
          Judul
        </label>
        <input
          id="judul-pengumuman"
          type="text"
          value={judul}
          maxLength={JUDUL_MAKS}
          disabled={sedangMengirim}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Contoh: Pemeliharaan server Sabtu malam"
          aria-invalid={galat.judul !== undefined}
          aria-describedby={galat.judul ? 'galat-judul-pengumuman' : undefined}
          className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 disabled:opacity-60"
        />
        {galat.judul ? (
          <p id="galat-judul-pengumuman" role="alert" className="mt-1.5 text-xs text-expired">
            {galat.judul}
          </p>
        ) : (
          <p className="mt-1.5 text-right text-xs text-ink-faint tabular-nums">
            {judul.length}/{JUDUL_MAKS}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="pesan-pengumuman" className="mb-1.5 block text-xs text-ink-muted">
          Isi pengumuman
        </label>
        <textarea
          id="pesan-pengumuman"
          rows={5}
          value={pesan}
          maxLength={PESAN_MAKS}
          disabled={sedangMengirim}
          onChange={(e) => setPesan(e.target.value)}
          placeholder="Tulis pengumuman yang akan diterima tenant."
          aria-invalid={galat.pesan !== undefined}
          aria-describedby={galat.pesan ? 'galat-pesan-pengumuman' : undefined}
          className="w-full resize-y rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 disabled:opacity-60"
        />
        {galat.pesan ? (
          <p id="galat-pesan-pengumuman" role="alert" className="mt-1.5 text-xs text-expired">
            {galat.pesan}
          </p>
        ) : (
          <p className="mt-1.5 text-right text-xs text-ink-faint tabular-nums">
            {pesan.length}/{PESAN_MAKS}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {galatServer && (
          <p role="alert" className="mr-auto text-sm text-expired">
            {galatServer}
          </p>
        )}

        <button
          type="submit"
          disabled={sedangMengirim}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {sedangMengirim ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {sedangMengirim ? 'Mengirim…' : 'Kirim pengumuman'}
        </button>
      </div>
    </form>
  )
}
