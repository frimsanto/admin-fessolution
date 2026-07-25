import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { DaftarPeringatan } from '@/components/billing/DaftarPeringatan'
import { KonfirmasiPembayaran } from '@/components/billing/KonfirmasiPembayaran'
import type { IsianPembayaran } from '@/components/billing/ModalCatatanPembayaran'
import { RingkasanLangganan } from '@/components/billing/RingkasanLangganan'
import { RiwayatPembayaran } from '@/components/billing/RiwayatPembayaran'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { BannerDataTiruan, KeadaanGagal } from '@/components/ui/KeadaanMuat'
import { PEMBAYARAN_TIRUAN } from '@/data/pembayaran-tiruan'
import { useDaftarTenant } from '@/hooks/useDaftarTenant'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { HARI_PERPANJANGAN, tenantSetelahKonfirmasi } from '@/lib/konfirmasi-pembayaran'
import { varianDaftar } from '@/lib/motion'
import { totalNilaiPembayaran } from '@/lib/pembayaran'
import { AMBANG_HARI } from '@/lib/peringatan-masa-aktif'
import type { Pembayaran } from '@/types/pembayaran'
import type { Tenant } from '@/types/tenant'

export function BillingPage() {
  const { memuat, daftar, pesanGagal, pakaiDataTiruan, muatUlang } = useDaftarTenant()

  // Hasil konfirmasi disimpan lokal karena endpoint pembayaran belum ada.
  const [perubahanLokal, setPerubahanLokal] = useState<Record<string, Tenant>>({})
  const [pembayaranBaru, setPembayaranBaru] = useState<Pembayaran[]>([])
  const [pemberitahuan, setPemberitahuan] = useState<string | null>(null)

  const daftarTampil = useMemo(
    () => daftar.map((tenant) => perubahanLokal[tenant.id] ?? tenant),
    [daftar, perubahanLokal],
  )

  const riwayat = useMemo(
    () => [...pembayaranBaru, ...PEMBAYARAN_TIRUAN],
    [pembayaranBaru],
  )

  function konfirmasiPembayaran(tenant: Tenant, isian: IsianPembayaran) {
    const diperbarui = tenantSetelahKonfirmasi(tenant)
    setPerubahanLokal((lama) => ({ ...lama, [tenant.id]: diperbarui }))

    // Catat juga ke riwayat supaya hasilnya langsung terlihat.
    setPembayaranBaru((lama) => [
      {
        id: `py-lokal-${tenant.id}-${lama.length}`,
        tenantId: tenant.id,
        namaBisnis: tenant.namaBisnis,
        aplikasi: tenant.aplikasi,
        jumlah: isian.jumlah,
        tanggalBayar: new Date().toISOString(),
        catatanAdmin: isian.catatanAdmin,
      },
      ...lama,
    ])

    setPemberitahuan(
      `Pembayaran ${tenant.namaBisnis} sebesar ${formatRupiah(isian.jumlah)} dikonfirmasi. Status menjadi Aktif dan masa berlaku diperpanjang ${HARI_PERPANJANGAN} hari sampai ${formatTanggal(diperbarui.tanggalBerakhir)}. Perubahan ini belum tersimpan — endpoint pembayaran belum tersedia.`,
    )
  }

  return (
    <>
      <JudulHalaman
        judul="Billing & Pembayaran"
        deskripsi="Pantau status langganan, konfirmasi pembayaran manual, dan lihat riwayatnya."
      />

      {pakaiDataTiruan && <BannerDataTiruan />}

      {pesanGagal && <KeadaanGagal pesan={pesanGagal} onCobaLagi={muatUlang} />}

      <AnimatePresence>
        {pemberitahuan && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <KartuSeksi
          judul="Ringkasan status langganan"
          deskripsi="Jumlah tenant berdasarkan masa trial, aktif, dan kedaluwarsa."
        >
          {memuat ? (
            <SeksiKosong pesan="Memuat ringkasan…" />
          ) : (
            <RingkasanLangganan daftar={daftarTampil} />
          )}
        </KartuSeksi>

        <KartuSeksi
          judul="Menunggu konfirmasi pembayaran"
          deskripsi="Tenant trial dan kedaluwarsa yang akan jadi aktif setelah pembayarannya masuk."
          isiRapat
        >
          {memuat ? (
            <SeksiKosong pesan="Memuat daftar…" />
          ) : (
            <KonfirmasiPembayaran daftar={daftarTampil} onKonfirmasi={konfirmasiPembayaran} />
          )}
        </KartuSeksi>

        <div className="grid gap-5 xl:grid-cols-2">
          <KartuSeksi
            judul="Masa aktif akan habis"
            deskripsi={`Tenant yang berakhir dalam ${AMBANG_HARI} hari ke depan.`}
            isiRapat
          >
            {memuat ? (
              <SeksiKosong pesan="Memuat peringatan…" />
            ) : (
              <DaftarPeringatan daftar={daftarTampil} />
            )}
          </KartuSeksi>

          <KartuSeksi
            judul="Riwayat pembayaran"
            deskripsi="Pembayaran yang sudah dikonfirmasi super admin."
            aksi={
              <span className="rounded-lg border border-hairline px-2.5 py-1 text-xs text-ink-muted tabular-nums">
                {formatRupiah(totalNilaiPembayaran(riwayat))}
              </span>
            }
            isiRapat
          >
            <RiwayatPembayaran daftar={riwayat} />
          </KartuSeksi>
        </div>
      </motion.div>
    </>
  )
}
