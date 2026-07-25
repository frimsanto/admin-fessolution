import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ModalDasar, TombolBatal } from '@/components/ui/ModalDasar'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { HARI_PERPANJANGAN, tanggalSetelahPerpanjangan } from '@/lib/konfirmasi-pembayaran'
import type { Tenant } from '@/types/tenant'

export type IsianPembayaran = {
  jumlah: number
  catatanAdmin: string | null
}

type Props = {
  /** Tenant yang sedang dikonfirmasi; null berarti modal tertutup. */
  tenant: Tenant | null
  sedangProses?: boolean
  onSimpan: (tenant: Tenant, isian: IsianPembayaran) => void
  onBatal: () => void
}

const BATAS_CATATAN = 200

/** Modal konfirmasi pembayaran manual: nominal yang masuk + catatan admin. */
export function ModalCatatanPembayaran({
  tenant,
  sedangProses = false,
  onSimpan,
  onBatal,
}: Props) {
  const [jumlah, setJumlah] = useState('')
  const [catatan, setCatatan] = useState('')
  const [galat, setGalat] = useState<string | null>(null)
  const kolomJumlah = useRef<HTMLInputElement>(null)

  // Bersihkan isian setiap kali berpindah tenant.
  useEffect(() => {
    setJumlah('')
    setCatatan('')
    setGalat(null)
  }, [tenant?.id])

  const nominal = Number(jumlah)
  const nominalValid = jumlah.trim() !== '' && Number.isFinite(nominal) && nominal > 0

  function simpan() {
    if (!tenant) return

    if (jumlah.trim() === '') {
      setGalat('Nominal pembayaran wajib diisi.')
      return
    }
    if (!Number.isFinite(nominal) || nominal <= 0) {
      setGalat('Nominal pembayaran harus berupa angka lebih dari nol.')
      return
    }

    setGalat(null)
    onSimpan(tenant, {
      jumlah: nominal,
      catatanAdmin: catatan.trim() === '' ? null : catatan.trim(),
    })
  }

  return (
    <ModalDasar
      terbuka={tenant !== null}
      judul="Konfirmasi pembayaran manual"
      idJudul="judul-modal-pembayaran"
      sedangProses={sedangProses}
      fokusAwal={kolomJumlah}
      onTutup={onBatal}
      footer={
        <>
          <TombolBatal onClick={onBatal} nonaktif={sedangProses} />

          <button
            type="button"
            onClick={simpan}
            disabled={sedangProses}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sedangProses && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {sedangProses ? 'Menyimpan…' : 'Simpan & aktifkan'}
          </button>
        </>
      }
    >
      {tenant && (
        <div className="space-y-4">
          <p>
            Catat pembayaran dari <span className="font-medium text-ink">{tenant.namaBisnis}</span>{' '}
            ({tenant.aplikasi.nama}). Status akan menjadi Aktif dan masa berlakunya diperpanjang{' '}
            {HARI_PERPANJANGAN} hari sampai{' '}
            <span className="font-medium text-ink tabular-nums">
              {formatTanggal(tanggalSetelahPerpanjangan(tenant.tanggalBerakhir))}
            </span>
            .
          </p>

          <div>
            <label htmlFor="jumlah-pembayaran" className="mb-1.5 block text-xs text-ink-muted">
              Nominal diterima (Rupiah)
            </label>
            <input
              ref={kolomJumlah}
              id="jumlah-pembayaran"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              value={jumlah}
              disabled={sedangProses}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="1500000"
              aria-invalid={galat !== null && !nominalValid}
              className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink tabular-nums placeholder:text-ink-faint focus:border-accent/50 disabled:opacity-60"
            />
            <p className="mt-1.5 h-4 text-xs text-ink-faint tabular-nums">
              {nominalValid ? formatRupiah(nominal) : ''}
            </p>
          </div>

          <div>
            <label htmlFor="catatan-admin" className="mb-1.5 block text-xs text-ink-muted">
              Catatan admin <span className="text-ink-faint">(opsional)</span>
            </label>
            <textarea
              id="catatan-admin"
              rows={3}
              maxLength={BATAS_CATATAN}
              value={catatan}
              disabled={sedangProses}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: transfer BCA, dicocokkan dengan mutasi 12.40"
              className="w-full resize-none rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 disabled:opacity-60"
            />
            <p className="mt-1.5 text-right text-xs text-ink-faint tabular-nums">
              {catatan.length}/{BATAS_CATATAN}
            </p>
          </div>

          {galat && (
            <p
              role="alert"
              className="rounded-lg border border-expired/30 bg-expired/10 px-3 py-2 text-sm text-expired"
            >
              {galat}
            </p>
          )}
        </div>
      )}
    </ModalDasar>
  )
}
