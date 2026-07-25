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
  if (daftar.length === 0) {
    return <SeksiKosong pesan="Belum ada pengumuman yang dikirim." />
  }

  const terurut = urutkanTerbaru(daftar)
  const tampil = batas === undefined ? terurut : terurut.slice(0, batas)

  return (
    <ul className="divide-y divide-hairline">
      {tampil.map((pengumuman) => (
        <li key={pengumuman.id} className="px-5 py-3.5">
          <p className="text-sm font-medium text-ink">{pengumuman.judul}</p>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
            <span>{labelSasaran(pengumuman)}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{formatTanggal(pengumuman.dikirimPada)}</span>
          </div>

          {/* Isi dipangkas dua baris; versi utuhnya lewat tampilan detail. */}
          <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{pengumuman.pesan}</p>
        </li>
      ))}
    </ul>
  )
}
