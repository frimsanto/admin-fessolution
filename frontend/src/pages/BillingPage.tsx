import { motion } from 'framer-motion'

import { JudulHalaman } from '@/components/layout/JudulHalaman'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { varianDaftar } from '@/lib/motion'

/**
 * Kerangka halaman Billing & Pembayaran.
 * Tiap seksi diisi oleh task berikutnya: ringkasan status langganan, peringatan
 * masa aktif habis, riwayat pembayaran, dan konfirmasi pembayaran manual.
 */
export function BillingPage() {
  return (
    <>
      <JudulHalaman
        judul="Billing & Pembayaran"
        deskripsi="Pantau status langganan, konfirmasi pembayaran manual, dan lihat riwayatnya."
      />

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <KartuSeksi
          judul="Ringkasan status langganan"
          deskripsi="Jumlah tenant berdasarkan masa trial, aktif, dan kedaluwarsa."
        >
          <SeksiKosong pesan="Ringkasan status langganan belum tersedia." />
        </KartuSeksi>

        <div className="grid gap-5 xl:grid-cols-2">
          <KartuSeksi
            judul="Masa aktif akan habis"
            deskripsi="Tenant yang berakhir dalam 7 hari ke depan."
            isiRapat
          >
            <SeksiKosong pesan="Daftar peringatan belum tersedia." />
          </KartuSeksi>

          <KartuSeksi
            judul="Riwayat pembayaran"
            deskripsi="Pembayaran yang sudah dikonfirmasi super admin."
            isiRapat
          >
            <SeksiKosong pesan="Riwayat pembayaran belum tersedia." />
          </KartuSeksi>
        </div>
      </motion.div>
    </>
  )
}
