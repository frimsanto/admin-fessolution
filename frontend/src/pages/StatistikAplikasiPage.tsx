import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { RingkasanLangganan } from '@/components/billing/RingkasanLangganan'
import { RiwayatPembayaran } from '@/components/billing/RiwayatPembayaran'
import { KartuSeksi, SeksiKosong } from '@/components/ui/KartuSeksi'
import { DAFTAR_APLIKASI_TIRUAN } from '@/data/aplikasi-tiruan'
import { PEMBAYARAN_TIRUAN } from '@/data/pembayaran-tiruan'
import { TENANT_TIRUAN } from '@/data/tenant-tiruan'
import { formatRupiah, formatTanggal } from '@/lib/format'
import { varianDaftar, varianItem } from '@/lib/motion'
import { cariAplikasiPerSlug, hitungStatistikAplikasi } from '@/lib/statistik-aplikasi'

function TautanKembali() {
  return (
    <Link
      to="/aplikasi"
      className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Kembali ke daftar aplikasi
    </Link>
  )
}

export function StatistikAplikasiPage() {
  const { slug } = useParams<{ slug: string }>()

  // Data tiruan — diganti panggilan API saat endpoint statistik aplikasi tersedia.
  const aplikasi = cariAplikasiPerSlug(DAFTAR_APLIKASI_TIRUAN, slug)

  if (!aplikasi) {
    return (
      <>
        <TautanKembali />
        <div className="rounded-2xl border border-hairline bg-surface px-6 py-16 text-center">
          <p className="text-sm font-medium text-ink">Aplikasi tidak ditemukan</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink-faint">
            Tidak ada aplikasi dengan slug <span className="font-mono">{slug}</span>.
          </p>
        </div>
      </>
    )
  }

  const statistik = hitungStatistikAplikasi(aplikasi, TENANT_TIRUAN, PEMBAYARAN_TIRUAN)

  return (
    <>
      <TautanKembali />

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Statistik {aplikasi.nama}
          </h1>
          <span
            className={`text-xs font-medium ${aplikasi.aktif ? 'text-aktif' : 'text-ink-faint'}`}
          >
            {aplikasi.aktif ? 'Berjalan' : 'Nonaktif'}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">
          Terdaftar sejak {formatTanggal(aplikasi.dibuatPada)}.
        </p>
      </header>

      <motion.div variants={varianDaftar} initial="awal" animate="tampil" className="grid gap-5">
        <motion.section
          variants={varianItem}
          className="grid gap-4 sm:grid-cols-3"
          aria-label="Angka utama aplikasi"
        >
          <div className="rounded-2xl border border-hairline bg-surface p-5 sm:col-span-1">
            <p className="text-xs text-ink-faint">Total pendapatan</p>
            {/* Angka utama: figur proporsional, warna teks biasa. */}
            <p className="mt-2 text-3xl font-semibold text-ink">
              {formatRupiah(statistik.totalPendapatan)}
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              dari {statistik.jumlahPembayaran} pembayaran
              {statistik.pembayaranTerakhir &&
                ` · terakhir ${formatTanggal(statistik.pembayaranTerakhir)}`}
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-5">
            <p className="text-xs text-ink-faint">Tenant aktif</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{statistik.tenantAktif}</p>
            <p className="mt-1 text-xs text-ink-faint">sedang berlangganan berbayar</p>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface p-5">
            <p className="text-xs text-ink-faint">Total tenant</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{statistik.totalTenant}</p>
            <p className="mt-1 text-xs text-ink-faint">termasuk trial dan kedaluwarsa</p>
          </div>
        </motion.section>

        <KartuSeksi
          judul="Status langganan tenant"
          deskripsi={`Rincian tenant ${aplikasi.nama} menurut status.`}
        >
          <RingkasanLangganan daftar={statistik.tenant} />
        </KartuSeksi>

        <KartuSeksi
          judul="Riwayat pembayaran"
          deskripsi={`Pembayaran yang tercatat untuk ${aplikasi.nama}.`}
          isiRapat
        >
          {statistik.pembayaran.length === 0 ? (
            <SeksiKosong pesan="Belum ada pembayaran untuk aplikasi ini." />
          ) : (
            <RiwayatPembayaran daftar={statistik.pembayaran} />
          )}
        </KartuSeksi>
      </motion.div>
    </>
  )
}
