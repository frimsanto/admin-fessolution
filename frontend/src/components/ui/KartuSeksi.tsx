import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { varianItem } from '@/lib/motion'

type Props = {
  judul: string
  deskripsi?: string
  aksi?: ReactNode
  children: ReactNode
  /** Hilangkan padding isi — berguna untuk tabel/daftar yang menempel ke tepi kartu. */
  isiRapat?: boolean
  className?: string
}

/** Kartu bersekat untuk mengelompokkan isi halaman. */
export function KartuSeksi({
  judul,
  deskripsi,
  aksi,
  children,
  isiRapat = false,
  className = '',
}: Props) {
  return (
    <motion.section
      variants={varianItem}
      className={`overflow-hidden rounded-2xl border border-hairline bg-surface ${className}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4">
        <div>
          <h2 className="text-sm font-medium text-ink">{judul}</h2>
          {deskripsi && <p className="mt-0.5 text-xs text-ink-faint">{deskripsi}</p>}
        </div>
        {aksi}
      </header>

      <div className={isiRapat ? '' : 'p-5'}>{children}</div>
    </motion.section>
  )
}

/** Isi kosong yang seragam untuk seksi yang belum ada datanya. */
export function SeksiKosong({ pesan }: { pesan: string }) {
  return <p className="py-8 text-center text-sm text-ink-faint">{pesan}</p>
}
