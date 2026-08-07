import { useState } from 'react'

import { DaftarPeringatan } from '@/components/billing/DaftarPeringatan'
import { KonfirmasiPembayaran } from '@/components/billing/KonfirmasiPembayaran'
import type { IsianPembayaran } from '@/components/billing/ModalCatatanPembayaran'
import { RingkasanLangganan } from '@/components/billing/RingkasanLangganan'
import { RiwayatPembayaran } from '@/components/billing/RiwayatPembayaran'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { KeadaanGagal } from '@/components/ui/KeadaanMuat'
import { useBilling } from '@/hooks/useBilling'
import { useDaftarTenant } from '@/hooks/useDaftarTenant'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { konfirmasiPembayaran as kirimKonfirmasi } from '@/services/billing'
import { LABEL_STATUS, type Tenant } from '@/types/tenant'

export function BillingPage() {
  // Daftar "menunggu konfirmasi" disusun dari status tenant, jadi sumbernya
  // tetap /api/tenant — billing tidak punya endpoint khusus untuk itu.
  const {
    memuat: memuatTenant,
    daftar: daftarTenant,
    pesanGagal: gagalTenant,
    muatUlang: muatUlangTenant,
  } = useDaftarTenant()

  const {
    memuat: memuatBilling,
    statusLangganan,
    peringatan,
    riwayat,
    pesanGagal: gagalBilling,
    muatUlang: muatUlangBilling,
  } = useBilling()

  const [menyimpan, setMenyimpan] = useState(false)
  const [galatKonfirmasi, setGalatKonfirmasi] = useState<string | null>(null)
  const [pemberitahuan, setPemberitahuan] = useState<string | null>(null)

  const pesanGagal = gagalBilling ?? gagalTenant

  function muatUlangSemua() {
    muatUlangBilling()
    muatUlangTenant()
  }

  async function konfirmasiPembayaran(
    tenant: Tenant,
    isian: IsianPembayaran,
  ): Promise<boolean> {
    setMenyimpan(true)
    setGalatKonfirmasi(null)

    try {
      const hasil = await kirimKonfirmasi({
        tenantId: tenant.id,
        jumlah: isian.jumlah,
        catatanAdmin: isian.catatanAdmin,
      })

      setPemberitahuan(
        `Pembayaran ${hasil.pembayaran.namaBisnis} sebesar ${formatRupiah(hasil.pembayaran.jumlah)} dikonfirmasi. Status menjadi ${LABEL_STATUS[hasil.tenant.status]} dan masa berlakunya sampai ${formatTanggal(hasil.tenant.tanggalBerakhir)}.`,
      )

      // Ringkasan, peringatan, riwayat, dan status tenant semuanya berubah —
      // ambil ulang dari server daripada menebak hasilnya di sini.
      muatUlangSemua()
      return true
    } catch (err: unknown) {
      setGalatKonfirmasi(
        err instanceof Error ? err.message : 'Gagal menyimpan konfirmasi pembayaran',
      )
      return false
    } finally {
      setMenyimpan(false)
    }
  }

  return (
    <>
      <JudulHalaman
        judul="Billing & Pembayaran"
        deskripsi="Pantau status langganan, konfirmasi pembayaran manual, dan lihat riwayatnya."
      />

      {pesanGagal && (
        <div className="mb-5">
          <KeadaanGagal
            judul="Gagal memuat data billing"
            pesan={pesanGagal}
            onCobaLagi={muatUlangSemua}
          />
        </div>
      )}

      {pemberitahuan && (
        <div
          role="status"
          className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink"
        >
          <span>{pemberitahuan}</span>
          <button
            type="button"
            onClick={() => setPemberitahuan(null)}
            className="shrink-0 text-xs text-ink-faint transition-colors hover:text-ink"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="grid gap-5">
        <KartuSeksi
          judul="Ringkasan status langganan"
          deskripsi="Jumlah tenant berdasarkan masa trial, aktif, dan kedaluwarsa."
        >
          {memuatBilling ? (
            <SeksiKosong pesan="Memuat ringkasan…" />
          ) : statusLangganan ? (
            <RingkasanLangganan ringkasan={statusLangganan} />
          ) : (
            <SeksiKosong pesan="Ringkasan tidak tersedia." />
          )}
        </KartuSeksi>

        <KartuSeksi
          judul="Menunggu konfirmasi pembayaran"
          deskripsi="Tenant trial dan kedaluwarsa yang akan jadi aktif setelah pembayarannya masuk."
          isiRapat
        >
          {memuatTenant ? (
            <SeksiKosong pesan="Memuat daftar…" />
          ) : (
            <KonfirmasiPembayaran
              daftar={daftarTenant}
              sedangProses={menyimpan}
              galat={galatKonfirmasi}
              onKonfirmasi={konfirmasiPembayaran}
              onTutupModal={() => setGalatKonfirmasi(null)}
            />
          )}
        </KartuSeksi>

        <div className="grid gap-5 xl:grid-cols-2">
          <KartuSeksi
            judul="Masa aktif akan habis"
            deskripsi={
              peringatan
                ? `Tenant yang berakhir dalam ${peringatan.ambangHari} hari ke depan.`
                : 'Tenant yang masa aktifnya segera berakhir.'
            }
            isiRapat
          >
            {memuatBilling ? (
              <SeksiKosong pesan="Memuat peringatan…" />
            ) : peringatan ? (
              <DaftarPeringatan daftar={peringatan.daftar} ambangHari={peringatan.ambangHari} />
            ) : (
              <SeksiKosong pesan="Peringatan tidak tersedia." />
            )}
          </KartuSeksi>

          <KartuSeksi
            judul="Riwayat pembayaran"
            deskripsi="Pembayaran yang sudah dikonfirmasi super admin."
            aksi={
              riwayat && (
                <span className="rounded-lg border border-hairline px-2.5 py-1 text-xs text-ink-muted tabular-nums">
                  {formatRupiah(riwayat.totalNilai)}
                </span>
              )
            }
            isiRapat
          >
            {memuatBilling ? (
              <SeksiKosong pesan="Memuat riwayat…" />
            ) : (
              <RiwayatPembayaran daftar={riwayat?.daftar ?? []} />
            )}
          </KartuSeksi>
        </div>
      </div>
    </>
  )
}
