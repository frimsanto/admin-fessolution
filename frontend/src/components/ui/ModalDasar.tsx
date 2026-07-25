import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

type Props = {
  terbuka: boolean
  judul: string
  /** id unik supaya aria-labelledby menunjuk ke judul modal ini. */
  idJudul: string
  children: ReactNode
  /** Baris tombol di bawah. */
  footer: ReactNode
  /** Permintaan sedang berjalan — modal tidak bisa ditutup. */
  sedangProses?: boolean
  /** Elemen yang difokuskan saat modal terbuka. */
  fokusAwal?: RefObject<HTMLElement | null>
  onTutup: () => void
}

/**
 * Kerangka modal: latar gelap, panel, kunci scroll, Escape untuk menutup,
 * dan fokus dikembalikan ke pemicunya. Dipakai semua modal aplikasi supaya
 * perilakunya seragam.
 */
export function ModalDasar({
  terbuka,
  judul,
  idJudul,
  children,
  footer,
  sedangProses = false,
  fokusAwal,
  onTutup,
}: Props) {
  const pemicuSebelumnya = useRef<Element | null>(null)

  // Dibaca handler Escape tanpa memicu ulang effect (yang akan memindahkan fokus).
  const prosesRef = useRef(sedangProses)
  prosesRef.current = sedangProses

  useEffect(() => {
    if (!terbuka) return

    pemicuSebelumnya.current = document.activeElement
    fokusAwal?.current?.focus()

    const saatKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !prosesRef.current) onTutup()
    }

    document.addEventListener('keydown', saatKeyDown)
    const overflowAwal = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', saatKeyDown)
      document.body.style.overflow = overflowAwal
      if (pemicuSebelumnya.current instanceof HTMLElement) {
        pemicuSebelumnya.current.focus()
      }
    }
  }, [terbuka, onTutup, fokusAwal])

  return (
    <AnimatePresence>
      {terbuka && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => !sedangProses && onTutup()}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={idJudul}
            aria-busy={sedangProses}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-hairline-strong bg-elevated p-6 shadow-2xl shadow-black/60"
          >
            <h2 id={idJudul} className="font-semibold text-ink">
              {judul}
            </h2>

            <div className="mt-2 text-sm text-ink-muted">{children}</div>

            <div className="mt-6 flex justify-end gap-2">{footer}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function TombolBatal({
  onClick,
  nonaktif = false,
}: {
  onClick: () => void
  nonaktif?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={nonaktif}
      className="rounded-lg border border-hairline px-4 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-50"
    >
      Batal
    </button>
  )
}
