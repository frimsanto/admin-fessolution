import type { ReactNode } from 'react'

type Props = {
  judul: string
  deskripsi?: string
  aksi?: ReactNode
}

export function JudulHalaman({ judul, deskripsi, aksi }: Props) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{judul}</h1>
        {deskripsi && <p className="mt-1.5 text-sm text-ink-muted">{deskripsi}</p>}
      </div>
      {aksi}
    </header>
  )
}
