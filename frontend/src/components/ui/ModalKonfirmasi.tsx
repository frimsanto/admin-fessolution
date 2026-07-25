import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

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
  const pemicuSebelumnya = useRef<Element | null>(null)

  // Dibaca oleh handler Escape tanpa perlu memicu ulang effect (yang akan
  // memindahkan fokus di tengah penyimpanan).
  const prosesRef = useRef(sedangProses)
  prosesRef.current = sedangProses

  useEffect(() => {
    if (!terbuka) return

    pemicuSebelumnya.current = document.activeElement
    tombolKonfirmasi.current?.focus()

    const saatKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !prosesRef.current) onBatal()
    }

    document.addEventListener('keydown', saatKeyDown)
    const overflowAwal = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', saatKeyDown)
      document.body.style.overflow = overflowAwal
      // Kembalikan fokus ke elemen yang membuka modal.
      if (pemicuSebelumnya.current instanceof HTMLElement) {
        pemicuSebelumnya.current.focus()
      }
    }
  }, [terbuka, onBatal])

  return (
    <AnimatePresence>
      {terbuka && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => !sedangProses && onBatal()}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-modal-konfirmasi"
            aria-busy={sedangProses}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-hairline-strong bg-elevated p-6 shadow-2xl shadow-black/60"
          >
            <h2 id="judul-modal-konfirmasi" className="font-semibold text-ink">
              {judul}
            </h2>

            <div className="mt-2 text-sm text-ink-muted">{deskripsi}</div>

            {galat && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-expired/30 bg-expired/10 px-3 py-2 text-sm text-expired"
              >
                {galat}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onBatal}
                disabled={sedangProses}
                className="rounded-lg border border-hairline px-4 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-50"
              >
                Batal
              </button>

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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
