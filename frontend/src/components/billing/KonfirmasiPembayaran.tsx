import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ModalCatatanPembayaran,
  type IsianPembayaran,
} from '@/components/billing/ModalCatatanPembayaran'
import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { SeksiKosong } from '@/components/ui/KartuSeksi'
import { formatTanggal } from '@/lib/format'
import { tenantMenungguKonfirmasi } from '@/lib/konfirmasi-pembayaran'
import type { Tenant } from '@/types/tenant'

type Props = {
  daftar: Tenant[]
  /** Dipanggil setelah super admin mengisi dan menyetujui konfirmasi. */
  onKonfirmasi: (tenant: Tenant, isian: IsianPembayaran) => void
}

export function KonfirmasiPembayaran({ daftar, onKonfirmasi }: Props) {
  const [dipilih, setDipilih] = useState<Tenant | null>(null)

  const menunggu = tenantMenungguKonfirmasi(daftar)

  if (menunggu.length === 0) {
    return <SeksiKosong pesan="Tidak ada tenant yang menunggu konfirmasi pembayaran." />
  }

  return (
    <>
      <ul className="divide-y divide-hairline">
        {menunggu.map((tenant) => (
          <li
            key={tenant.id}
            className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-hover"
          >
            <div className="min-w-0 flex-1">
              <Link
                to={`/tenant/${tenant.id}`}
                className="truncate text-sm font-medium text-ink transition-colors hover:text-accent-bright"
              >
                {tenant.namaBisnis}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
                <span>{tenant.aplikasi.nama}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  berakhir {formatTanggal(tenant.tanggalBerakhir)}
                </span>
              </div>
            </div>

            <BadgeStatus status={tenant.status} />

            <button
              type="button"
              onClick={() => setDipilih(tenant)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent-bright transition-colors hover:bg-accent/25"
            >
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              Konfirmasi bayar
            </button>
          </li>
        ))}
      </ul>

      <ModalCatatanPembayaran
        tenant={dipilih}
        onBatal={() => setDipilih(null)}
        onSimpan={(tenant, isian) => {
          onKonfirmasi(tenant, isian)
          setDipilih(null)
        }}
      />
    </>
  )
}
