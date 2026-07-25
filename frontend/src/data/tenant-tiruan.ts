import type { AplikasiRingkas, Tenant } from '@/types/tenant'

/** Data tiruan sementara — diganti panggilan API pada task "Hubungkan halaman daftar tenant ke API". */

const MS_HARI = 86_400_000
const sekarang = Date.now()

/** ISO untuk `n` hari dari sekarang (negatif = masa lalu). */
function hari(n: number): string {
  return new Date(sekarang + n * MS_HARI).toISOString()
}

export const APLIKASI_TIRUAN: AplikasiRingkas[] = [
  { appId: 'app-cafeos', nama: 'CafeOS', slug: 'cafeos' },
  { appId: 'app-billiardos', nama: 'BilliardOS', slug: 'billiardos' },
  { appId: 'app-laundryos', nama: 'LaundryOS', slug: 'laundryos' },
]

const [cafeos, billiardos, laundryos] = APLIKASI_TIRUAN as [
  AplikasiRingkas,
  AplikasiRingkas,
  AplikasiRingkas,
]

export const TENANT_TIRUAN: Tenant[] = [
  {
    id: 'tn-01',
    namaBisnis: 'Kopi Senja',
    emailPemilik: 'owner@kopisenja.id',
    aplikasi: cafeos,
    status: 'AKTIF',
    tanggalDaftar: hari(-214),
    tanggalBerakhir: hari(151),
  },
  {
    id: 'tn-02',
    namaBisnis: 'Warung Pagi Buta',
    emailPemilik: 'admin@warungpagi.co.id',
    aplikasi: cafeos,
    status: 'AKTIF',
    tanggalDaftar: hari(-96),
    tanggalBerakhir: hari(4),
  },
  {
    id: 'tn-03',
    namaBisnis: 'Kedai Cengkeh',
    emailPemilik: 'halo@kedaicengkeh.com',
    aplikasi: cafeos,
    status: 'TRIAL',
    tanggalDaftar: hari(-9),
    tanggalBerakhir: hari(5),
  },
  {
    id: 'tn-04',
    namaBisnis: 'Bakoel Kopi Lawas',
    emailPemilik: 'finance@bakoellawas.id',
    aplikasi: cafeos,
    status: 'EXPIRED',
    tanggalDaftar: hari(-402),
    tanggalBerakhir: hari(-37),
  },
  {
    id: 'tn-05',
    namaBisnis: 'Bola Delapan Sport',
    emailPemilik: 'manajer@boladelapan.id',
    aplikasi: billiardos,
    status: 'AKTIF',
    tanggalDaftar: hari(-158),
    tanggalBerakhir: hari(207),
  },
  {
    id: 'tn-06',
    namaBisnis: 'Pool Center Kemang',
    emailPemilik: 'ops@poolcenter.id',
    aplikasi: billiardos,
    status: 'SUSPENDED',
    tanggalDaftar: hari(-73),
    tanggalBerakhir: hari(22),
  },
  {
    id: 'tn-07',
    namaBisnis: 'Cue Master Arena',
    emailPemilik: 'billing@cuemaster.co.id',
    aplikasi: billiardos,
    status: 'TRIAL',
    tanggalDaftar: hari(-3),
    tanggalBerakhir: hari(11),
  },
  {
    id: 'tn-08',
    namaBisnis: 'Laundry Kilat Sentosa',
    emailPemilik: 'owner@kilatsentosa.id',
    aplikasi: laundryos,
    status: 'AKTIF',
    tanggalDaftar: hari(-45),
    tanggalBerakhir: hari(320),
  },
  {
    id: 'tn-09',
    namaBisnis: 'Bersih Wangi Express',
    emailPemilik: 'cs@bersihwangi.com',
    aplikasi: laundryos,
    status: 'TRIAL',
    tanggalDaftar: hari(-12),
    tanggalBerakhir: hari(2),
  },
  {
    id: 'tn-10',
    namaBisnis: 'Kopi Tepi Jalan',
    emailPemilik: 'kontak@kopitepijalan.id',
    aplikasi: cafeos,
    status: 'AKTIF',
    tanggalDaftar: hari(-18),
    tanggalBerakhir: hari(347),
  },
  {
    id: 'tn-11',
    namaBisnis: 'Meja Hijau Billiard',
    emailPemilik: 'admin@mejahijau.id',
    aplikasi: billiardos,
    status: 'EXPIRED',
    tanggalDaftar: hari(-289),
    tanggalBerakhir: hari(-64),
  },
  {
    id: 'tn-12',
    namaBisnis: 'Setrika Rapi Jaya',
    emailPemilik: 'owner@setrikarapi.id',
    aplikasi: laundryos,
    status: 'SUSPENDED',
    tanggalDaftar: hari(-131),
    tanggalBerakhir: hari(58),
  },
]
