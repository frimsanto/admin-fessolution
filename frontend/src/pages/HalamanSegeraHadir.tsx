import { motion } from 'framer-motion'
import { Construction } from 'lucide-react'

import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { varianItem } from '@/lib/motion'

type Props = {
  judul: string
  deskripsi: string
  catatan?: string
}

/** Penampung sementara untuk halaman yang task-nya belum dikerjakan. */
export function HalamanSegeraHadir({ judul, deskripsi, catatan }: Props) {
  return (
    <>
      <JudulHalaman judul={judul} deskripsi={deskripsi} />

      <motion.div
        variants={varianItem}
        initial="awal"
        animate="tampil"
        className="rounded-2xl border border-hairline bg-surface px-6 py-16 text-center"
      >
        <div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-accent-soft">
          <Construction className="size-5 text-accent-bright" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-ink">Halaman ini belum dibuat</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-faint">
          {catatan ?? 'Menunggu task-nya dikerjakan.'}
        </p>
      </motion.div>
    </>
  )
}
