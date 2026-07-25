import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

import {
  adaFilterAktif,
  aplikasiDariTenant,
  FILTER_AWAL,
  hitungPerAplikasi,
  hitungPerStatus,
  SEMUA,
  URUTAN_STATUS,
  type FilterTenant as NilaiFilter,
} from '@/lib/filter-tenant'
import { LABEL_STATUS, type Tenant } from '@/types/tenant'

type Props = {
  /** Seluruh tenant sebelum disaring — dipakai untuk menghitung angka tiap opsi. */
  semuaTenant: Tenant[]
  nilai: NilaiFilter
  onUbah: (nilai: NilaiFilter) => void
}

type PropsChip = {
  label: string
  jumlah: number
  aktif: boolean
  penandaLayout: string
  onClick: () => void
}

function Chip({ label, jumlah, aktif, penandaLayout, onClick }: PropsChip) {
  const kosong = jumlah === 0

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      disabled={kosong && !aktif}
      className={`relative inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
        aktif
          ? 'border-accent/40 text-accent-bright'
          : kosong
            ? 'cursor-not-allowed border-hairline text-ink-faint/50'
            : 'border-hairline text-ink-muted hover:bg-surface-hover hover:text-ink'
      }`}
    >
      {aktif && (
        <motion.span
          layoutId={penandaLayout}
          className="absolute inset-0 rounded-lg bg-accent-soft"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative">{label}</span>
      <span className="relative text-xs tabular-nums opacity-70">{jumlah}</span>
    </button>
  )
}

export function FilterTenant({ semuaTenant, nilai, onUbah }: Props) {
  const daftarAplikasi = aplikasiDariTenant(semuaTenant)
  const jumlahAplikasi = hitungPerAplikasi(semuaTenant, nilai)
  const jumlahStatus = hitungPerStatus(semuaTenant, nilai)

  return (
    <section
      aria-label="Filter tenant"
      className="mb-5 rounded-2xl border border-hairline bg-surface p-4"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter aplikasi">
          <span className="w-full text-xs font-medium tracking-wide text-ink-faint uppercase sm:w-16 sm:shrink-0">
            Aplikasi
          </span>

          <Chip
            label="Semua"
            jumlah={jumlahAplikasi.get(SEMUA) ?? 0}
            aktif={nilai.aplikasi === SEMUA}
            penandaLayout="filter-aplikasi-aktif"
            onClick={() => onUbah({ ...nilai, aplikasi: SEMUA })}
          />

          {daftarAplikasi.map((aplikasi) => (
            <Chip
              key={aplikasi.slug}
              label={aplikasi.nama}
              jumlah={jumlahAplikasi.get(aplikasi.slug) ?? 0}
              aktif={nilai.aplikasi === aplikasi.slug}
              penandaLayout="filter-aplikasi-aktif"
              onClick={() => onUbah({ ...nilai, aplikasi: aplikasi.slug })}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter status">
          <span className="w-full text-xs font-medium tracking-wide text-ink-faint uppercase sm:w-16 sm:shrink-0">
            Status
          </span>

          <Chip
            label="Semua"
            jumlah={jumlahStatus.get(SEMUA) ?? 0}
            aktif={nilai.status === SEMUA}
            penandaLayout="filter-status-aktif"
            onClick={() => onUbah({ ...nilai, status: SEMUA })}
          />

          {URUTAN_STATUS.map((status) => (
            <Chip
              key={status}
              label={LABEL_STATUS[status]}
              jumlah={jumlahStatus.get(status) ?? 0}
              aktif={nilai.status === status}
              penandaLayout="filter-status-aktif"
              onClick={() => onUbah({ ...nilai, status })}
            />
          ))}

          {adaFilterAktif(nilai) && (
            <button
              type="button"
              onClick={() => onUbah(FILTER_AWAL)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Atur ulang
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
