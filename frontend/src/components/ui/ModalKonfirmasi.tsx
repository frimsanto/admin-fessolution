import { Loader2 } from 'lucide-react'
import { useRef, type ReactNode } from 'react'

import { ModalDasar, TombolBatal } from '@/components/ui/ModalDasar'

type Props = {
  terbuka: boolean
  judul: string
  deskripsi: ReactNode
  labelKonfirmasi: string
  /** Beri warna peringatan pada tombol konfirmasi (mis. menangguhkan tenant). */
  bahaya?: boolean
  /** Permintaan sedang berjalan — tombol dikunci dan modal tidak bisa ditutup. */
  sedangProses?: boolean
  /** Pesan kegagalan dari server, ditampilkan di dalam modal agar bisa dicoba lagi. */
  galat?: string | null
  onKonfirmasi: () => void
  onBatal: () => void
}

export function ModalKonfirmasi({
  terbuka,
  judul,
  deskripsi,
  labelKonfirmasi,
  bahaya = false,
  sedangProses = false,
  galat = null,
  onKonfirmasi,
  onBatal,
}: Props) {
  const tombolKonfirmasi = useRef<HTMLButtonElement>(null)

  return (
    <ModalDasar
      terbuka={terbuka}
      judul={judul}
      idJudul="judul-modal-konfirmasi"
      sedangProses={sedangProses}
      fokusAwal={tombolKonfirmasi}
      onTutup={onBatal}
      footer={
        <>
          <TombolBatal onClick={onBatal} nonaktif={sedangProses} />

          <button
            ref={tombolKonfirmasi}
            type="button"
            onClick={onKonfirmasi}
            disabled={sedangProses}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 ${
              bahaya ? 'bg-expired/90' : 'bg-accent'
            }`}
          >
            {sedangProses && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {sedangProses ? 'Menyimpan…' : labelKonfirmasi}
          </button>
        </>
      }
    >
      {deskripsi}

      {galat && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-expired/30 bg-expired/10 px-3 py-2 text-sm text-expired"
        >
          {galat}
        </p>
      )}
    </ModalDasar>
  )
}
