import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Boxes,
  CalendarClock,
  CalendarPlus,
  CirclePause,
  CirclePlay,
  Hash,
  Mail,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'

import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { ModalKonfirmasi } from '@/components/ui/ModalKonfirmasi'
import { TENANT_TIRUAN } from '@/data/tenant-tiruan'
import { formatTanggal, labelSisaHari, sisaHari } from '@/lib/format'
import { varianDaftar, varianItem } from '@/lib/motion'
import {
  akanDitangguhkan as akanDitangguhkanStatus,
  statusSetelahUbah,
} from '@/lib/status-tenant'
import { LABEL_STATUS, type StatusTenant, type Tenant } from '@/types/tenant'

function TautanKembali() {
  return (
    <Link
      to="/tenant"
      className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Kembali ke daftar tenant
    </Link>
  )
}

function BarisInfo({
  Ikon,
  label,
  children,
}: {
  Ikon: typeof Mail
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <Ikon className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-xs text-ink-faint">{label}</div>
        <div className="mt-0.5 text-sm break-words text-ink">{children}</div>
      </div>
    </div>
  )
}

function warnaSisa(sisa: number): string {
  if (sisa < 0) return 'text-expired'
  if (sisa <= 7) return 'text-suspended'
  return 'text-ink'
}

function IsiDetail({ tenant }: { tenant: Tenant }) {
  // Status disimpan lokal karena masih data tiruan — nanti diganti panggilan API
  // pada task "Hubungkan aksi ubah status ke API".
  const [status, setStatus] = useState<StatusTenant>(tenant.status)
  const [modalTerbuka, setModalTerbuka] = useState(false)
  const [pemberitahuan, setPemberitahuan] = useState<string | null>(null)

  const sisa = sisaHari(tenant.tanggalBerakhir)
  const akanDitangguhkan = akanDitangguhkanStatus(status)
  const statusTujuan = statusSetelahUbah(status)
  const labelAksi = akanDitangguhkan ? 'Tangguhkan tenant' : 'Aktifkan kembali'
  const IkonAksi = akanDitangguhkan ? CirclePause : CirclePlay

  function konfirmasiUbahStatus() {
    setStatus(statusTujuan)
    setModalTerbuka(false)
    setPemberitahuan(
      `Status ${tenant.namaBisnis} diubah menjadi ${LABEL_STATUS[statusTujuan]}. Perubahan ini belum tersimpan — halaman masih memakai data tiruan.`,
    )
  }

  return (
    <>
      <TautanKembali />

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{tenant.namaBisnis}</h1>
            <BadgeStatus status={status} />
          </div>
          <p className="mt-1.5 text-sm text-ink-muted">
            Tenant {tenant.aplikasi.nama} · bergabung {formatTanggal(tenant.tanggalDaftar)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalTerbuka(true)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            akanDitangguhkan
              ? 'border-hairline text-ink-muted hover:border-expired/40 hover:bg-expired/10 hover:text-expired'
              : 'border-accent/40 bg-accent-soft text-accent-bright hover:bg-accent/25'
          }`}
        >
          <IkonAksi className="size-4" aria-hidden="true" />
          {labelAksi}
        </button>
      </header>

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

      <motion.div
        variants={varianDaftar}
        initial="awal"
        animate="tampil"
        className="grid gap-5 lg:grid-cols-[1.2fr_1fr]"
      >
        <motion.section
          variants={varianItem}
          className="overflow-hidden rounded-2xl border border-hairline bg-surface"
        >
          <h2 className="border-b border-hairline px-5 py-3.5 text-xs font-medium tracking-wide text-ink-faint uppercase">
            Informasi tenant
          </h2>

          <div className="divide-y divide-[var(--color-hairline)]">
            <BarisInfo Ikon={Mail} label="Email pemilik">
              <a
                href={`mailto:${tenant.emailPemilik}`}
                className="text-accent-bright hover:underline"
              >
                {tenant.emailPemilik}
              </a>
            </BarisInfo>

            <BarisInfo Ikon={Boxes} label="Aplikasi">
              {tenant.aplikasi.nama}
              <span className="ml-2 text-xs text-ink-faint">{tenant.aplikasi.slug}</span>
            </BarisInfo>

            <BarisInfo Ikon={CalendarPlus} label="Tanggal daftar">
              <span className="tabular-nums">{formatTanggal(tenant.tanggalDaftar)}</span>
            </BarisInfo>

            <BarisInfo Ikon={Hash} label="ID tenant">
              <span className="font-mono text-xs text-ink-muted">{tenant.id}</span>
            </BarisInfo>
          </div>
        </motion.section>

        <motion.section
          variants={varianItem}
          className="overflow-hidden rounded-2xl border border-hairline bg-surface"
        >
          <h2 className="border-b border-hairline px-5 py-3.5 text-xs font-medium tracking-wide text-ink-faint uppercase">
            Masa berlaku
          </h2>

          <div className="px-5 py-6">
            <div className={`text-3xl font-semibold tabular-nums ${warnaSisa(sisa)}`}>
              {sisa < 0 ? `${Math.abs(sisa)} hari` : `${sisa} hari`}
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              {sisa < 0 ? 'sudah lewat masa aktif' : 'tersisa sebelum masa aktif habis'}
            </p>
          </div>

          <div className="border-t border-hairline">
            <BarisInfo Ikon={CalendarClock} label="Berakhir pada">
              <span className="tabular-nums">{formatTanggal(tenant.tanggalBerakhir)}</span>
              <span className="ml-2 text-xs text-ink-faint">
                {labelSisaHari(tenant.tanggalBerakhir)}
              </span>
            </BarisInfo>
          </div>
        </motion.section>
      </motion.div>

      <ModalKonfirmasi
        terbuka={modalTerbuka}
        judul={akanDitangguhkan ? 'Tangguhkan tenant ini?' : 'Aktifkan kembali tenant ini?'}
        bahaya={akanDitangguhkan}
        labelKonfirmasi={akanDitangguhkan ? 'Ya, tangguhkan' : 'Ya, aktifkan'}
        onKonfirmasi={konfirmasiUbahStatus}
        onBatal={() => setModalTerbuka(false)}
        deskripsi={
          akanDitangguhkan ? (
            <>
              <span className="font-medium text-ink">{tenant.namaBisnis}</span> tidak akan bisa
              mengakses {tenant.aplikasi.nama} sampai diaktifkan kembali. Status berubah dari{' '}
              {LABEL_STATUS[status]} menjadi {LABEL_STATUS.SUSPENDED}.
            </>
          ) : (
            <>
              <span className="font-medium text-ink">{tenant.namaBisnis}</span> akan bisa mengakses{' '}
              {tenant.aplikasi.nama} lagi. Status berubah dari {LABEL_STATUS.SUSPENDED} menjadi{' '}
              {LABEL_STATUS.AKTIF}.
            </>
          )
        }
      />
    </>
  )
}

function TenantTidakDitemukan({ id }: { id?: string }) {
  return (
    <>
      <TautanKembali />

      <div className="rounded-2xl border border-hairline bg-surface px-6 py-16 text-center">
        <p className="text-sm font-medium text-ink">Tenant tidak ditemukan</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-faint">
          Tidak ada tenant dengan ID <span className="font-mono">{id}</span>. Mungkin tautannya
          salah atau tenant sudah dihapus.
        </p>
      </div>
    </>
  )
}

export function DetailTenantPage() {
  const { id } = useParams<{ id: string }>()

  // Data tiruan — diganti panggilan API pada task "Hubungkan halaman detail tenant ke API".
  const tenant = TENANT_TIRUAN.find((item) => item.id === id)

  if (!tenant) return <TenantTidakDitemukan id={id} />

  // `key` memastikan state status ikut ter-reset saat berpindah antar tenant.
  return <IsiDetail key={tenant.id} tenant={tenant} />
}
