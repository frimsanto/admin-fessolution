import { motion } from 'framer-motion'

import { DaftarPeringatan } from '@/components/billing/DaftarPeringatan'
import { RingkasanLangganan } from '@/components/billing/RingkasanLangganan'
import {
  RiwayatPembayaran,
  totalNilaiPembayaran,
} from '@/components/billing/RiwayatPembayaran'
import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { BannerDataTiruan, KeadaanGagal } from '@/components/ui/KeadaanMuat'
import { PEMBAYARAN_TIRUAN } from '@/data/pembayaran-tiruan'
import { useDaftarTenant } from '@/hooks/useDaftarTenant'
import { formatRupiah } from '@/lib/format'
import { varianDaftar } from '@/lib/motion'
import { AMBANG_HARI } from '@/lib/peringatan-masa-aktif'

/**
 * Kerangka halaman Billing & Pembayaran.
 * Tiap seksi diisi oleh task berikutnya: ringkasan status langganan, peringatan
 * masa aktif habis, riwayat pembayaran, dan konfirmasi pembayaran manual.
 */
export function BillingPage() {
  const { memuat, daftar, pesanGagal, pakaiDataTiruan, muatUlang } = useDaftarTenant()

  return (
    <>
      <JudulHalaman
        judul="Billing & Pembayaran"
        deskripsi="Pantau status langganan, konfirmasi pembayaran manual, dan lihat riwayatnya."
      />

      {pakaiDataTiruan && <BannerDataTiruan />}

      {pesanGagal && <KeadaanGagal pesan={pesanGagal} onCobaLagi={muatUlang} />}

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <KartuSeksi
          judul="Ringkasan status langganan"
          deskripsi="Jumlah tenant berdasarkan masa trial, aktif, dan kedaluwarsa."
        >
          {memuat ? (
            <SeksiKosong pesan="Memuat ringkasan…" />
          ) : (
            <RingkasanLangganan daftar={daftar} />
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
              <DaftarPeringatan daftar={daftar} />
            )}
          </KartuSeksi>

          <KartuSeksi
            judul="Riwayat pembayaran"
            deskripsi="Pembayaran yang sudah dikonfirmasi super admin."
            aksi={
              <span className="rounded-lg border border-hairline px-2.5 py-1 text-xs text-ink-muted tabular-nums">
                {formatRupiah(totalNilaiPembayaran(PEMBAYARAN_TIRUAN))}
              </span>
            }
            isiRapat
          >
            <RiwayatPembayaran daftar={PEMBAYARAN_TIRUAN} />
          </KartuSeksi>
        </div>
      </motion.div>
    </>
  )
}
