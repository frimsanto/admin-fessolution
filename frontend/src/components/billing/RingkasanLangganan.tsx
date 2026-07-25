import { SeksiKosong } from '@/components/ui/KartuSeksi'
import { hitungRingkasanLangganan } from '@/lib/ringkasan-langganan'
import { LABEL_STATUS, type StatusTenant, type Tenant } from '@/types/tenant'

/** Warna status dipakai hanya sebagai penanda kecil — angka tetap memakai warna teks. */
const WARNA_TITIK: Record<StatusTenant, string> = {
  TRIAL: 'bg-trial',
  AKTIF: 'bg-aktif',
  SUSPENDED: 'bg-suspended',
  EXPIRED: 'bg-expired',
}

const KETERANGAN: Record<StatusTenant, string> = {
  TRIAL: 'Masih masa uji coba',
  AKTIF: 'Berlangganan berbayar',
  SUSPENDED: 'Dihentikan sementara',
  EXPIRED: 'Masa aktif sudah lewat',
}

export function RingkasanLangganan({ daftar }: { daftar: Tenant[] }) {
  const { total, baris } = hitungRingkasanLangganan(daftar)

  if (total === 0) {
    return <SeksiKosong pesan="Belum ada tenant untuk diringkas." />
  }

  const terisi = baris.filter((item) => item.jumlah > 0)

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {baris.map(({ status, jumlah, persen }) => (
          <div key={status} className="rounded-xl border border-hairline bg-elevated/40 p-4">
            <div className="flex items-center gap-2">
              <span
                className={`size-1.5 shrink-0 rounded-full ${WARNA_TITIK[status]}`}
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-ink-muted">{LABEL_STATUS[status]}</span>
            </div>

            {/* Angka besar: figur proporsional, bukan tabular-nums. */}
            <div className="mt-2 text-3xl font-semibold text-ink">{jumlah}</div>

            <div className="mt-1 text-xs text-ink-faint">
              {persen}% · {KETERANGAN[status]}
            </div>
          </div>
        ))}
      </div>

      {/* Komposisi sekilas. Angkanya sudah terbaca di kartu atas, jadi batang ini
          tidak menyembunyikan informasi apa pun. */}
      <div className="mt-5">
        <div className="flex h-2 gap-0.5" role="img" aria-label={ringkasanUntukPembacaLayar(baris)}>
          {terisi.map(({ status, jumlah }) => (
            <span
              key={status}
              style={{ flexGrow: jumlah }}
              className={`rounded-full ${WARNA_TITIK[status]}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          Total {total} tenant di seluruh aplikasi platform.
        </p>
      </div>
    </div>
  )
}

function ringkasanUntukPembacaLayar(baris: { status: StatusTenant; jumlah: number }[]): string {
  const bagian = baris
    .filter((item) => item.jumlah > 0)
    .map((item) => `${LABEL_STATUS[item.status]} ${item.jumlah}`)
  return `Komposisi status langganan: ${bagian.join(', ')}`
}
