import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { ModalDetailPengumuman } from '@/components/broadcast/ModalDetailPengumuman'
import { SeksiKosong } from '@/components/ui/KartuSeksi'
import { formatTanggal } from '@/lib/format'
import { labelSasaran, urutkanTerbaru } from '@/lib/pengumuman'
import type { Pengumuman } from '@/types/pengumuman'

type Props = {
  daftar: Pengumuman[]
  /** Tampilkan hanya sekian teratas; kosongkan untuk menampilkan semuanya. */
  batas?: number
}

export function DaftarRiwayatPengumuman({ daftar, batas }: Props) {
  const [dipilih, setDipilih] = useState<Pengumuman | null>(null)

  if (daftar.length === 0) {
    return <SeksiKosong pesan="Belum ada pengumuman yang dikirim." />
  }

  const terurut = urutkanTerbaru(daftar)
  const tampil = batas === undefined ? terurut : terurut.slice(0, batas)

  return (
    <>
      <ul className="divide-y divide-hairline">
        {tampil.map((pengumuman) => (
          <li key={pengumuman.id}>
            <button
              type="button"
              onClick={() => setDipilih(pengumuman)}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{pengumuman.judul}</p>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
                  <span>{labelSasaran(pengumuman)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{formatTanggal(pengumuman.createdAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{pengumuman.jumlahPenerima} tenant</span>
                  {pengumuman.status === 'DRAFT' && (
                    <span className="rounded border border-hairline px-1.5 py-0.5">Draf</span>
                  )}
                </div>

                {/* Isi dipangkas dua baris; versi utuhnya ada di modal detail. */}
                <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{pengumuman.isi}</p>
              </div>

              <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <ModalDetailPengumuman pengumuman={dipilih} onTutup={() => setDipilih(null)} />
    </>
  )
}
