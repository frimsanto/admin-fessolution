import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  terbuka: boolean
  judul: string
  deskripsi: ReactNode
  labelKonfirmasi: string
  /** Beri warna peringatan pada tombol konfirmasi (mis. menangguhkan tenant). */
  bahaya?: boolean
  onKonfirmasi: () => void
  onBatal: () => void
}

export function ModalKonfirmasi({
  terbuka,
  judul,
  deskripsi,
  labelKonfirmasi,
  bahaya = false,
  onKonfirmasi,
  onBatal,
}: Props) {
  const tombolKonfirmasi = useRef<HTMLButtonElement>(null)
  const pemicuSebelumnya = useRef<Element | null>(null)

  useEffect(() => {
    if (!terbuka) return

    pemicuSebelumnya.current = document.activeElement
    tombolKonfirmasi.current?.focus()

    const saatKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBatal()
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
            onClick={onBatal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-modal-konfirmasi"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-hairline-strong bg-elevated p-6 shadow-2xl shadow-black/60"
          >
            <h2 id="judul-modal-konfirmasi" className="text-base font-semibold text-ink">
              {judul}
            </h2>

            <div className="mt-2 text-sm text-ink-muted">{deskripsi}</div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onBatal}
                className="rounded-lg border border-hairline px-4 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
              >
                Batal
              </button>

              <button
                ref={tombolKonfirmasi}
                type="button"
                onClick={onKonfirmasi}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 ${
                  bahaya ? 'bg-expired/90' : 'bg-accent'
                }`}
              >
                {labelKonfirmasi}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
