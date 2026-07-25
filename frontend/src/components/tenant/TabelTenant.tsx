import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { formatTanggal, labelSisaHari, sisaHari } from '@/lib/format'
import { varianDaftar, varianItem } from '@/lib/motion'
import type { Tenant } from '@/types/tenant'

const KOLOM = ['Bisnis', 'Aplikasi', 'Status', 'Bergabung', 'Masa berlaku']

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

function warnaSisaHari(tanggalBerakhir: string): string {
  const sisa = sisaHari(tanggalBerakhir)
  if (sisa < 0) return 'text-expired'
  if (sisa <= 7) return 'text-suspended'
  return 'text-ink-faint'
}

function ChipAplikasi({ nama }: { nama: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-hairline-strong bg-elevated px-2 py-1 text-xs font-medium text-ink-muted">
      {nama}
    </span>
  )
}

/** Tampilan tabel — dipakai mulai layar lebar (lg). */
function TampilanTabel({ daftar, kunciAnimasi }: { daftar: Tenant[]; kunciAnimasi?: string }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-hairline bg-surface lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl border-collapse text-left text-sm">
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
                  <ChipAplikasi nama={tenant.aplikasi.nama} />
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

/** Tampilan kartu — dipakai di layar sempit supaya tidak perlu geser ke samping. */
function TampilanKartu({ daftar, kunciAnimasi }: { daftar: Tenant[]; kunciAnimasi?: string }) {
  return (
    <motion.ul
      key={kunciAnimasi}
      variants={varianDaftar}
      initial="awal"
      animate="tampil"
      className="grid gap-3 sm:grid-cols-2 lg:hidden"
    >
      {daftar.map((tenant) => (
        <motion.li
          key={tenant.id}
          variants={varianItem}
          className="rounded-2xl border border-hairline bg-surface p-4 transition-colors hover:bg-surface-hover"
        >
          <Link to={`/tenant/${tenant.id}`} className="block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-medium text-ink">{tenant.namaBisnis}</div>
                <div className="mt-0.5 truncate text-xs text-ink-faint">{tenant.emailPemilik}</div>
              </div>
              <ChevronRight className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden="true" />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <BadgeStatus status={tenant.status} />
              <ChipAplikasi nama={tenant.aplikasi.nama} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-3 text-xs">
              <div>
                <dt className="text-ink-faint">Bergabung</dt>
                <dd className="mt-0.5 text-ink-muted tabular-nums">
                  {formatTanggal(tenant.tanggalDaftar)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint">Masa berlaku</dt>
                <dd className="mt-0.5 text-ink-muted tabular-nums">
                  {formatTanggal(tenant.tanggalBerakhir)}
                </dd>
                <dd className={`mt-0.5 ${warnaSisaHari(tenant.tanggalBerakhir)}`}>
                  {labelSisaHari(tenant.tanggalBerakhir)}
                </dd>
              </div>
            </dl>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  )
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
    <>
      <TampilanTabel daftar={daftar} kunciAnimasi={kunciAnimasi} />
      <TampilanKartu daftar={daftar} kunciAnimasi={kunciAnimasi} />
    </>
  )
}
