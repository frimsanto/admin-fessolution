import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { formatTanggal, labelSisaHari, sisaHari } from '@/lib/format'
import { varianDaftar, varianItem } from '@/lib/motion'
import type { Tenant } from '@/types/tenant'

const KOLOM = ['Bisnis', 'Aplikasi', 'Status', 'Bergabung', 'Masa berlaku']

function warnaSisaHari(tanggalBerakhir: string): string {
  const sisa = sisaHari(tanggalBerakhir)
  if (sisa < 0) return 'text-expired'
  if (sisa <= 7) return 'text-suspended'
  return 'text-ink-faint'
}

type Props = {
  daftar: Tenant[]
  /** Ganti nilainya untuk memutar ulang animasi munculnya baris (mis. saat filter berubah). */
  kunciAnimasi?: string
  pesanKosong?: { judul: string; detail: string }
}

const KOSONG_BAWAAN = {
  judul: 'Belum ada tenant',
  detail: 'Tenant akan muncul di sini begitu ada yang mendaftar ke salah satu aplikasi.',
}

export function TabelTenant({ daftar, kunciAnimasi, pesanKosong }: Props) {
  if (daftar.length === 0) {
    const { judul, detail } = pesanKosong ?? KOSONG_BAWAAN

    return (
      <div className="rounded-2xl border border-hairline bg-surface px-6 py-16 text-center">
        <p className="text-sm font-medium text-ink">{judul}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-faint">{detail}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-208 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline">
              {KOLOM.map((kolom) => (
                <th
                  key={kolom}
                  scope="col"
                  className="px-5 py-3.5 text-xs font-medium tracking-wide text-ink-faint uppercase"
                >
                  {kolom}
                </th>
              ))}
              <th scope="col" className="w-10">
                <span className="sr-only">Buka detail</span>
              </th>
            </tr>
          </thead>

          <motion.tbody key={kunciAnimasi} variants={varianDaftar} initial="awal" animate="tampil">
            {daftar.map((tenant) => (
              <motion.tr
                key={tenant.id}
                variants={varianItem}
                className="border-b border-hairline transition-colors last:border-0 hover:bg-surface-hover"
              >
                <td className="px-5 py-4">
                  <Link
                    to={`/tenant/${tenant.id}`}
                    className="font-medium text-ink transition-colors hover:text-accent-bright"
                  >
                    {tenant.namaBisnis}
                  </Link>
                  <div className="mt-0.5 text-xs text-ink-faint">{tenant.emailPemilik}</div>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-md border border-hairline-strong bg-elevated px-2 py-1 text-xs font-medium text-ink-muted">
                    {tenant.aplikasi.nama}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <BadgeStatus status={tenant.status} />
                </td>

                <td className="px-5 py-4 text-ink-muted tabular-nums">
                  {formatTanggal(tenant.tanggalDaftar)}
                </td>

                <td className="px-5 py-4">
                  <div className="text-ink-muted tabular-nums">
                    {formatTanggal(tenant.tanggalBerakhir)}
                  </div>
                  <div className={`mt-0.5 text-xs ${warnaSisaHari(tenant.tanggalBerakhir)}`}>
                    {labelSisaHari(tenant.tanggalBerakhir)}
                  </div>
                </td>

                <td className="pr-4">
                  <Link
                    to={`/tenant/${tenant.id}`}
                    aria-label={`Buka detail ${tenant.namaBisnis}`}
                    className="grid size-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-elevated hover:text-ink"
                  >
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}
