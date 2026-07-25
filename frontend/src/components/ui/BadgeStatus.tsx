import { LABEL_STATUS, type StatusTenant } from '@/types/tenant'

const GAYA: Record<StatusTenant, { titik: string; teks: string; latar: string; garis: string }> = {
  TRIAL: {
    titik: 'bg-trial',
    teks: 'text-trial',
    latar: 'bg-trial/10',
    garis: 'border-trial/25',
  },
  AKTIF: {
    titik: 'bg-aktif',
    teks: 'text-aktif',
    latar: 'bg-aktif/10',
    garis: 'border-aktif/25',
  },
  SUSPENDED: {
    titik: 'bg-suspended',
    teks: 'text-suspended',
    latar: 'bg-suspended/10',
    garis: 'border-suspended/25',
  },
  EXPIRED: {
    titik: 'bg-expired',
    teks: 'text-expired',
    latar: 'bg-expired/10',
    garis: 'border-expired/25',
  },
}

export function BadgeStatus({ status }: { status: StatusTenant }) {
  const gaya = GAYA[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${gaya.latar} ${gaya.garis} ${gaya.teks}`}
    >
      <span className={`size-1.5 rounded-full ${gaya.titik}`} aria-hidden="true" />
      {LABEL_STATUS[status]}
    </span>
  )
}
