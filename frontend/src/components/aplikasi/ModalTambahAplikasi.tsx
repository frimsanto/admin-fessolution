import { useEffect, useRef, useState } from 'react'

import { Loader2 } from 'lucide-react'

import { ModalDasar, TombolBatal } from '@/components/ui/ModalDasar'
import { adaGalat, buatSlug, validasiAplikasiBaru, type GalatAplikasi } from '@/lib/validasi-aplikasi'
import type { Aplikasi, IsianAplikasiBaru } from '@/types/aplikasi'

type Props = {
  terbuka: boolean
  /** Dipakai untuk mengecek duplikasi nama dan slug sebelum dikirim. */
  daftar: Aplikasi[]
  /** Permintaan sedang dikirim — modal dikunci. */
  sedangProses?: boolean
  /** Pesan kegagalan dari server (mis. slug bentrok), agar isian bisa diperbaiki. */
  galatServer?: string | null
  onSimpan: (isian: IsianAplikasiBaru) => void
  onBatal: () => void
}

export function ModalTambahAplikasi({
  terbuka,
  daftar,
  sedangProses = false,
  galatServer = null,
  onSimpan,
  onBatal,
}: Props) {
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

    onSimpan({ nama: nama.trim(), slug: slug.trim() })
  }

  return (
    <ModalDasar
      terbuka={terbuka}
      judul="Tambah aplikasi baru"
      idJudul="judul-modal-aplikasi"
      fokusAwal={kolomNama}
      onTutup={onBatal}
      sedangProses={sedangProses}
      footer={
        <>
          <TombolBatal onClick={onBatal} nonaktif={sedangProses} />
          <button
            type="button"
            onClick={simpan}
            disabled={sedangProses}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sedangProses && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {sedangProses ? 'Menyimpan…' : 'Simpan aplikasi'}
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
            disabled={sedangProses}
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
            disabled={sedangProses}
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

        {galatServer && (
          <p
            role="alert"
            className="rounded-lg border border-expired/30 bg-expired/10 px-3 py-2 text-sm text-expired"
          >
            {galatServer}
          </p>
        )}
      </div>
    </ModalDasar>
  )
}
