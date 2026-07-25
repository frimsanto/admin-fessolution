import { useRef } from 'react'

import { ModalDasar } from '@/components/ui/ModalDasar'
import { formatTanggal } from '@/lib/format'
import { labelSasaran } from '@/lib/pengumuman'
import type { Pengumuman } from '@/types/pengumuman'

type Props = {
  /** Pengumuman yang sedang dibuka; null berarti modal tertutup. */
  pengumuman: Pengumuman | null
  onTutup: () => void
}

/** Isi utuh sebuah pengumuman — daftar riwayat hanya memangkasnya dua baris. */
export function ModalDetailPengumuman({ pengumuman, onTutup }: Props) {
  const tombolTutup = useRef<HTMLButtonElement>(null)

  return (
    <ModalDasar
      terbuka={pengumuman !== null}
      judul={pengumuman?.judul ?? 'Detail pengumuman'}
      idJudul="judul-modal-pengumuman"
      fokusAwal={tombolTutup}
      onTutup={onTutup}
      footer={
        <button
          ref={tombolTutup}
          type="button"
          onClick={onTutup}
          className="rounded-lg border border-hairline px-4 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
        >
          Tutup
        </button>
      }
    >
      {pengumuman && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
            <span>{labelSasaran(pengumuman)}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Dikirim {formatTanggal(pengumuman.dikirimPada)}</span>
          </div>

          {/* pre-line supaya paragraf yang ditulis super admin tidak menyatu. */}
          <p className="whitespace-pre-line text-sm text-ink-muted">{pengumuman.pesan}</p>
        </div>
      )}
    </ModalDasar>
  )
}
