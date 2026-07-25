import { Link } from 'react-router-dom'

import { SeksiKosong } from '@/components/ui/KartuSeksi'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { urutkanTerbaru } from '@/lib/pembayaran'
import type { Pembayaran } from '@/types/pembayaran'

export function RiwayatPembayaran({ daftar }: { daftar: Pembayaran[] }) {
  if (daftar.length === 0) {
    return <SeksiKosong pesan="Belum ada pembayaran yang tercatat." />
  }

  return (
    <ul className="divide-y divide-hairline">
      {urutkanTerbaru(daftar).map((bayar) => (
        <li key={bayar.id} className="px-5 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/tenant/${bayar.tenantId}`}
                className="truncate text-sm font-medium text-ink transition-colors hover:text-accent-bright"
              >
                {bayar.namaBisnis}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
                <span>{bayar.aplikasi.nama}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{formatTanggal(bayar.tanggalBayar)}</span>
              </div>
            </div>

            {/* Kolom nominal sejajar vertikal, jadi tabular-nums memang tepat di sini. */}
            <div className="shrink-0 text-sm font-medium text-ink tabular-nums">
              {formatRupiah(bayar.jumlah)}
            </div>
          </div>

          {bayar.catatanAdmin && (
            <p className="mt-2 border-l-2 border-hairline-strong pl-2.5 text-xs text-ink-muted">
              {bayar.catatanAdmin}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
