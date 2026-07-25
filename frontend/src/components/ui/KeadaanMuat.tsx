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

/** Kerangka kartu selagi data dimuat, mengikuti kisi halaman aplikasi. */
export function KerangkaKartu({ jumlah = 3 }: { jumlah?: number }) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-label="Memuat data"
    >
      {Array.from({ length: jumlah }, (_, i) => (
        <div key={i} className="rounded-2xl border border-hairline bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-white/8" />
              <div className="h-2.5 w-20 animate-pulse rounded bg-white/5" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded-full bg-white/6" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {[0, 1].map((j) => (
              <div key={j} className="h-16 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>

          <div className="mt-4 h-3 w-40 animate-pulse rounded bg-white/5" />
          <div className="mt-4 h-9 animate-pulse rounded-lg bg-white/5" />
        </div>
      ))}
      <span className="sr-only">Memuat daftar aplikasi…</span>
    </div>
  )
}

export function KeadaanGagal({
  pesan,
  judul = 'Gagal memuat data',
  onCobaLagi,
}: {
  pesan: string
  judul?: string
  onCobaLagi: () => void
}) {
  return (
    <div className="rounded-2xl border border-expired/25 bg-expired/5 px-6 py-14 text-center">
      <div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-expired/10">
        <AlertTriangle className="size-5 text-expired" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-ink">{judul}</p>
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
