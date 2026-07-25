import { APLIKASI_TIRUAN } from '@/data/tenant-tiruan'
import type { Pembayaran } from '@/types/pembayaran'

/** Data tiruan sementara — diganti panggilan API saat endpoint pembayaran tersedia. */

const MS_HARI = 86_400_000
const sekarang = Date.now()

function hari(n: number): string {
  return new Date(sekarang + n * MS_HARI).toISOString()
}

const [cafeos, billiardos, laundryos] = APLIKASI_TIRUAN as [
  (typeof APLIKASI_TIRUAN)[number],
  (typeof APLIKASI_TIRUAN)[number],
  (typeof APLIKASI_TIRUAN)[number],
]

export const PEMBAYARAN_TIRUAN: Pembayaran[] = [
  {
    id: 'py-01',
    tenantId: 'tn-01',
    namaBisnis: 'Kopi Senja',
    aplikasi: cafeos,
    jumlah: 1_500_000,
    tanggalBayar: hari(-3),
    catatanAdmin: 'Transfer BCA, dicocokkan dengan mutasi 12.40',
  },
  {
    id: 'py-02',
    tenantId: 'tn-05',
    namaBisnis: 'Bola Delapan Sport',
    aplikasi: billiardos,
    jumlah: 2_400_000,
    tanggalBayar: hari(-9),
    catatanAdmin: 'Perpanjangan 12 bulan',
  },
  {
    id: 'py-03',
    tenantId: 'tn-08',
    namaBisnis: 'Laundry Kilat Sentosa',
    aplikasi: laundryos,
    jumlah: 900_000,
    tanggalBayar: hari(-16),
    catatanAdmin: null,
  },
  {
    id: 'py-04',
    tenantId: 'tn-10',
    namaBisnis: 'Kopi Tepi Jalan',
    aplikasi: cafeos,
    jumlah: 1_500_000,
    tanggalBayar: hari(-18),
    catatanAdmin: 'Bayar via QRIS',
  },
  {
    id: 'py-05',
    tenantId: 'tn-02',
    namaBisnis: 'Warung Pagi Buta',
    aplikasi: cafeos,
    jumlah: 750_000,
    tanggalBayar: hari(-31),
    catatanAdmin: 'Paket 6 bulan',
  },
  {
    id: 'py-06',
    tenantId: 'tn-01',
    namaBisnis: 'Kopi Senja',
    aplikasi: cafeos,
    jumlah: 1_500_000,
    tanggalBayar: hari(-47),
    catatanAdmin: null,
  },
  {
    id: 'py-07',
    tenantId: 'tn-12',
    namaBisnis: 'Setrika Rapi Jaya',
    aplikasi: laundryos,
    jumlah: 900_000,
    tanggalBayar: hari(-58),
    catatanAdmin: 'Sempat tertunda 2 minggu',
  },
]
