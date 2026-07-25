import { AlertTriangle, RefreshCw } from 'lucide-react'

/** Kerangka tabel selagi data dimuat. */
export function KerangkaTabel({ baris = 6 }: { baris?: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-hairline bg-surface"
      role="status"
      aria-label="Memuat data"
    >
      {Array.from({ length: baris }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-hairline px-5 py-4 last:border-0"
        >
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-48 animate-pulse rounded bg-white/8" />
            <div className="h-2.5 w-32 animate-pulse rounded bg-white/5" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/6" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-white/6" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-white/6" />
        </div>
      ))}
      <span className="sr-only">Memuat data tenant…</span>
    </div>
  )
}

/** Kerangka halaman detail selagi data dimuat. */
export function KerangkaDetail() {
  return (
    <div role="status" aria-label="Memuat data">
      <div className="mb-8 space-y-3">
        <div className="h-7 w-64 animate-pulse rounded bg-white/8" />
        <div className="h-3.5 w-80 animate-pulse rounded bg-white/5" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-hairline bg-surface p-5">
            <div className="mb-5 h-3 w-32 animate-pulse rounded bg-white/6" />
            <div className="space-y-4">
              {[0, 1, 2].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-2.5 w-24 animate-pulse rounded bg-white/5" />
                  <div className="h-3.5 w-44 animate-pulse rounded bg-white/8" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Memuat detail tenant…</span>
    </div>
  )
}

export function KeadaanGagal({ pesan, onCobaLagi }: { pesan: string; onCobaLagi: () => void }) {
  return (
    <div className="rounded-2xl border border-expired/25 bg-expired/5 px-6 py-14 text-center">
      <div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-expired/10">
        <AlertTriangle className="size-5 text-expired" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-ink">Gagal memuat data tenant</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink-faint">{pesan}</p>

      <button
        type="button"
        onClick={onCobaLagi}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-hairline-strong px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-hover"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        Coba lagi
      </button>
    </div>
  )
}

export function BannerDataTiruan({ endpoint = 'GET /api/tenant' }: { endpoint?: string }) {
  return (
    <div
      role="status"
      className="mb-5 rounded-xl border border-suspended/30 bg-suspended/10 px-4 py-3 text-sm text-ink"
    >
      <span className="font-medium">Menampilkan data tiruan.</span>{' '}
      <span className="text-ink-muted">
        Endpoint <code className="font-mono text-xs">{endpoint}</code> belum tersedia di backend,
        jadi halaman ini memakai contoh data selama pengembangan.
      </span>
    </div>
  )
}
