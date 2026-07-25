/**
 * Seed data pengembangan: aplikasi, tenant, dan pembayaran contoh.
 * Sengaja dibuat mirip data tiruan frontend supaya tampilannya sama saat
 * halaman sudah tersambung ke API.
 *
 * Jalankan: npm run prisma:seed
 */
import { prisma, tutupKoneksiPrisma } from '../src/lib/prisma.js'
import { TenantStatus } from '../src/generated/prisma/enums.js'

const HARI = 24 * 60 * 60 * 1000

function hari(n: number): Date {
  return new Date(Date.now() + n * HARI)
}

const APLIKASI = [
  { name: 'CafeOS', slug: 'cafeos', status: true },
  { name: 'BilliardOS', slug: 'billiardos', status: true },
  { name: 'LaundryOS', slug: 'laundryos', status: false },
]

type BenihTenant = {
  slugAplikasi: string
  businessName: string
  ownerEmail: string
  status: TenantStatus
  daftar: number
  berakhir: number
}

const TENANT: BenihTenant[] = [
  { slugAplikasi: 'cafeos', businessName: 'Kopi Senja', ownerEmail: 'owner@kopisenja.id', status: TenantStatus.AKTIF, daftar: -214, berakhir: 151 },
  { slugAplikasi: 'cafeos', businessName: 'Warung Pagi Buta', ownerEmail: 'admin@warungpagi.co.id', status: TenantStatus.AKTIF, daftar: -96, berakhir: 4 },
  { slugAplikasi: 'cafeos', businessName: 'Kedai Cengkeh', ownerEmail: 'halo@kedaicengkeh.com', status: TenantStatus.TRIAL, daftar: -9, berakhir: 5 },
  { slugAplikasi: 'cafeos', businessName: 'Bakoel Kopi Lawas', ownerEmail: 'finance@bakoellawas.id', status: TenantStatus.EXPIRED, daftar: -402, berakhir: -37 },
  { slugAplikasi: 'cafeos', businessName: 'Kopi Tepi Jalan', ownerEmail: 'kontak@kopitepijalan.id', status: TenantStatus.AKTIF, daftar: -18, berakhir: 347 },
  { slugAplikasi: 'billiardos', businessName: 'Bola Delapan Sport', ownerEmail: 'manajer@boladelapan.id', status: TenantStatus.AKTIF, daftar: -158, berakhir: 207 },
  { slugAplikasi: 'billiardos', businessName: 'Pool Center Kemang', ownerEmail: 'ops@poolcenter.id', status: TenantStatus.SUSPENDED, daftar: -73, berakhir: 22 },
  { slugAplikasi: 'billiardos', businessName: 'Cue Master Arena', ownerEmail: 'billing@cuemaster.co.id', status: TenantStatus.TRIAL, daftar: -3, berakhir: 11 },
  { slugAplikasi: 'billiardos', businessName: 'Meja Hijau Billiard', ownerEmail: 'admin@mejahijau.id', status: TenantStatus.EXPIRED, daftar: -289, berakhir: -64 },
  { slugAplikasi: 'laundryos', businessName: 'Laundry Kilat Sentosa', ownerEmail: 'owner@kilatsentosa.id', status: TenantStatus.AKTIF, daftar: -45, berakhir: 320 },
  { slugAplikasi: 'laundryos', businessName: 'Bersih Wangi Express', ownerEmail: 'cs@bersihwangi.com', status: TenantStatus.TRIAL, daftar: -12, berakhir: 2 },
  { slugAplikasi: 'laundryos', businessName: 'Setrika Rapi Jaya', ownerEmail: 'owner@setrikarapi.id', status: TenantStatus.SUSPENDED, daftar: -131, berakhir: 58 },
]

const PEMBAYARAN: { bisnis: string; amount: number; tanggal: number; adminNote: string | null }[] = [
  { bisnis: 'Kopi Senja', amount: 1_500_000, tanggal: -3, adminNote: 'Transfer BCA, dicocokkan dengan mutasi 12.40' },
  { bisnis: 'Bola Delapan Sport', amount: 2_400_000, tanggal: -9, adminNote: 'Perpanjangan 12 bulan' },
  { bisnis: 'Laundry Kilat Sentosa', amount: 900_000, tanggal: -16, adminNote: null },
  { bisnis: 'Kopi Tepi Jalan', amount: 1_500_000, tanggal: -18, adminNote: 'Bayar via QRIS' },
  { bisnis: 'Warung Pagi Buta', amount: 750_000, tanggal: -31, adminNote: 'Paket 6 bulan' },
  { bisnis: 'Kopi Senja', amount: 1_500_000, tanggal: -47, adminNote: null },
  { bisnis: 'Setrika Rapi Jaya', amount: 900_000, tanggal: -58, adminNote: 'Sempat tertunda 2 minggu' },
]

async function main() {
  console.log('[seed] Mengosongkan data lama…')
  await prisma.payment.deleteMany()
  await prisma.tenant.deleteMany()
  await prisma.app.deleteMany()

  console.log('[seed] Menambahkan aplikasi…')
  const aplikasiPerSlug = new Map<string, string>()
  for (const aplikasi of APLIKASI) {
    const dibuat = await prisma.app.create({ data: aplikasi })
    aplikasiPerSlug.set(dibuat.slug, dibuat.id)
  }

  console.log('[seed] Menambahkan tenant…')
  const tenantPerNama = new Map<string, string>()
  for (const benih of TENANT) {
    const appId = aplikasiPerSlug.get(benih.slugAplikasi)
    if (!appId) throw new Error(`Aplikasi ${benih.slugAplikasi} tidak ditemukan`)

    const dibuat = await prisma.tenant.create({
      data: {
        appId,
        businessName: benih.businessName,
        ownerEmail: benih.ownerEmail,
        status: benih.status,
        joinedDate: hari(benih.daftar),
        expiredDate: hari(benih.berakhir),
      },
    })
    tenantPerNama.set(dibuat.businessName, dibuat.id)
  }

  console.log('[seed] Menambahkan pembayaran…')
  for (const bayar of PEMBAYARAN) {
    const tenantId = tenantPerNama.get(bayar.bisnis)
    if (!tenantId) throw new Error(`Tenant ${bayar.bisnis} tidak ditemukan`)

    await prisma.payment.create({
      data: {
        tenantId,
        amount: bayar.amount,
        paymentDate: hari(bayar.tanggal),
        adminNote: bayar.adminNote,
      },
    })
  }

  const [jumlahAplikasi, jumlahTenant, jumlahPembayaran] = await Promise.all([
    prisma.app.count(),
    prisma.tenant.count(),
    prisma.payment.count(),
  ])

  console.log(
    `[seed] Selesai: ${jumlahAplikasi} aplikasi, ${jumlahTenant} tenant, ${jumlahPembayaran} pembayaran.`,
  )
}

main()
  .catch((err) => {
    console.error('[seed] Gagal:', err)
    process.exitCode = 1
  })
  .finally(() => tutupKoneksiPrisma())
