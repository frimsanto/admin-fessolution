import { motion } from 'framer-motion'
import { ChartNoAxesColumn, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { formatTanggal } from '@/lib/format'
import { varianItem } from '@/lib/motion'
import type { Aplikasi } from '@/types/aplikasi'

type Props = {
  aplikasi: Aplikasi
  onUbahStatus: (aplikasi: Aplikasi) => void
}

export function KartuAplikasi({ aplikasi, onUbahStatus }: Props) {
  const idLabel = `status-${aplikasi.slug}`

  return (
    <motion.article
      variants={varianItem}
      className="flex flex-col rounded-2xl border border-hairline bg-surface p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-medium text-ink">{aplikasi.nama}</h2>
          <p className="mt-0.5 truncate font-mono text-xs text-ink-faint">{aplikasi.slug}</p>
        </div>

        {/* Status tidak hanya diwakili warna — ada teksnya juga. */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            id={idLabel}
            className={`text-xs font-medium ${aplikasi.aktif ? 'text-aktif' : 'text-ink-faint'}`}
          >
            {aplikasi.aktif ? 'Berjalan' : 'Nonaktif'}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={aplikasi.aktif}
            aria-labelledby={idLabel}
            onClick={() => onUbahStatus(aplikasi)}
            className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
              aplikasi.aktif ? 'bg-accent' : 'bg-elevated ring-1 ring-hairline-strong'
            }`}
          >
            <span className="sr-only">
              {aplikasi.aktif ? `Nonaktifkan ${aplikasi.nama}` : `Aktifkan ${aplikasi.nama}`}
            </span>
            <span
              aria-hidden="true"
              className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${
                aplikasi.aktif ? 'left-4.5' : 'left-0.5 opacity-60'
              }`}
            />
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-hairline bg-elevated/40 px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs text-ink-faint">
            <Users className="size-3.5" aria-hidden="true" />
            Tenant
          </dt>
          <dd className="mt-1 text-xl font-semibold text-ink">{aplikasi.jumlahTenant}</dd>
        </div>

        <div className="rounded-xl border border-hairline bg-elevated/40 px-3 py-2.5">
          <dt className="text-xs text-ink-faint">Tenant aktif</dt>
          <dd className="mt-1 text-xl font-semibold text-ink">{aplikasi.jumlahTenantAktif}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-ink-faint">
        Terdaftar sejak <span className="tabular-nums">{formatTanggal(aplikasi.dibuatPada)}</span>
      </p>

      <Link
        to={`/aplikasi/${aplikasi.slug}/statistik`}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-hairline px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
      >
        <ChartNoAxesColumn className="size-4" aria-hidden="true" />
        Lihat statistik
      </Link>
    </motion.article>
  )
}
