import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { SeksiKosong } from '@/components/ui/KartuSeksi'
import { formatTanggal, sisaHari } from '@/lib/format'
import { AMBANG_HARI, tenantAkanHabis } from '@/lib/peringatan-masa-aktif'
import type { Tenant } from '@/types/tenant'

function labelMendesak(sisa: number): string {
  if (sisa === 0) return 'Berakhir hari ini'
  if (sisa === 1) return 'Besok'
  return `${sisa} hari lagi`
}

export function DaftarPeringatan({ daftar }: { daftar: Tenant[] }) {
  const perlu = tenantAkanHabis(daftar)

  if (perlu.length === 0) {
    return (
      <SeksiKosong
        pesan={`Tidak ada tenant yang masa aktifnya habis dalam ${AMBANG_HARI} hari ke depan.`}
      />
    )
  }

  return (
    <ul className="divide-y divide-hairline">
      {perlu.map((tenant) => {
        const sisa = sisaHari(tenant.tanggalBerakhir)
        // Dua hari terakhir dianggap paling mendesak.
        const mendesak = sisa <= 1

        return (
          <li key={tenant.id}>
            <Link
              to={`/tenant/${tenant.id}`}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-hover"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{tenant.namaBisnis}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
                  <span>{tenant.aplikasi.nama}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{formatTanggal(tenant.tanggalBerakhir)}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <BadgeStatus status={tenant.status} />
                <span
                  className={`text-xs font-medium ${mendesak ? 'text-expired' : 'text-suspended'}`}
                >
                  {labelMendesak(sisa)}
                </span>
                <ChevronRight className="size-4 text-ink-faint" aria-hidden="true" />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
