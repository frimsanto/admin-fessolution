import { useEffect, useRef, useState } from 'react'

import { ModalDasar, TombolBatal } from '@/components/ui/ModalDasar'
import {
  adaGalat,
  buatAplikasiBaru,
  buatSlug,
  validasiAplikasiBaru,
  type GalatAplikasi,
} from '@/lib/validasi-aplikasi'
import type { Aplikasi } from '@/types/aplikasi'

type Props = {
  terbuka: boolean
  /** Dipakai untuk mengecek duplikasi nama dan slug. */
  daftar: Aplikasi[]
  onSimpan: (aplikasi: Aplikasi) => void
  onBatal: () => void
}

export function ModalTambahAplikasi({ terbuka, daftar, onSimpan, onBatal }: Props) {
  const [nama, setNama] = useState('')
  const [slug, setSlug] = useState('')
  // Slug ikut nama sampai super admin mengubahnya sendiri.
  const [slugManual, setSlugManual] = useState(false)
  const [galat, setGalat] = useState<GalatAplikasi>({})

  const kolomNama = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!terbuka) return
    setNama('')
    setSlug('')
    setSlugManual(false)
    setGalat({})
  }, [terbuka])

  function ubahNama(nilai: string) {
    setNama(nilai)
    if (!slugManual) setSlug(buatSlug(nilai))
  }

  function simpan() {
    const hasil = validasiAplikasiBaru({ nama, slug }, daftar)
    setGalat(hasil)
    if (adaGalat(hasil)) return

    onSimpan(buatAplikasiBaru({ nama, slug }))
  }

  return (
    <ModalDasar
      terbuka={terbuka}
      judul="Tambah aplikasi baru"
      idJudul="judul-modal-aplikasi"
      fokusAwal={kolomNama}
      onTutup={onBatal}
      footer={
        <>
          <TombolBatal onClick={onBatal} />
          <button
            type="button"
            onClick={simpan}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Simpan aplikasi
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p>Daftarkan produk SaaS baru yang akan dikelola platform.</p>

        <div>
          <label htmlFor="nama-aplikasi" className="mb-1.5 block text-xs text-ink-muted">
            Nama aplikasi
          </label>
          <input
            ref={kolomNama}
            id="nama-aplikasi"
            type="text"
            value={nama}
            onChange={(e) => ubahNama(e.target.value)}
            placeholder="Contoh: LaundryOS"
            aria-invalid={galat.nama !== undefined}
            aria-describedby={galat.nama ? 'galat-nama-aplikasi' : undefined}
            className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50"
          />
          {galat.nama && (
            <p id="galat-nama-aplikasi" role="alert" className="mt-1.5 text-xs text-expired">
              {galat.nama}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="slug-aplikasi" className="mb-1.5 block text-xs text-ink-muted">
            Slug <span className="text-ink-faint">(dipakai di URL dan integrasi)</span>
          </label>
          <input
            id="slug-aplikasi"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugManual(true)
              setSlug(e.target.value)
            }}
            placeholder="laundryos"
            aria-invalid={galat.slug !== undefined}
            aria-describedby={galat.slug ? 'galat-slug-aplikasi' : undefined}
            className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-accent/50"
          />
          {galat.slug ? (
            <p id="galat-slug-aplikasi" role="alert" className="mt-1.5 text-xs text-expired">
              {galat.slug}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-ink-faint">
              Terisi otomatis dari nama, tapi masih bisa diubah.
            </p>
          )}
        </div>
      </div>
    </ModalDasar>
  )
}
