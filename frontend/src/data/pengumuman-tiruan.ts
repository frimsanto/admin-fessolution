import type { AplikasiRingkas } from '@/types/tenant'
import type { Pengumuman } from '@/types/pengumuman'

/**
 * Data tiruan sementara — diganti panggilan API saat endpoint broadcast
 * tersedia (task backend fitur Notifikasi & Broadcast masih antre).
 *
 * Ini satu-satunya data tiruan yang tersisa di frontend; halaman lain sudah
 * memakai endpoint aslinya.
 */

const MS_HARI = 86_400_000
const sekarang = Date.now()

function hariLalu(n: number): string {
  return new Date(sekarang - n * MS_HARI).toISOString()
}

const CAFEOS: AplikasiRingkas = {
  appId: '7f1c2a90-3e4b-4d51-9a72-0c8d5e6f1a23',
  nama: 'CafeOS',
  slug: 'cafeos',
}

const BILLIARDOS: AplikasiRingkas = {
  appId: 'b2d47e15-8c39-4f60-ae81-5d3f9a70c412',
  nama: 'BilliardOS',
  slug: 'billiardos',
}

export const PENGUMUMAN_TIRUAN: Pengumuman[] = [
  {
    id: 'bc-2f8a1d40',
    aplikasi: null,
    judul: 'Pemeliharaan server Sabtu malam',
    pesan:
      'Kami akan melakukan pemeliharaan server pada Sabtu, pukul 23.00–01.00 WIB. Selama periode tersebut aplikasi mungkin tidak dapat diakses beberapa menit. Mohon selesaikan transaksi sebelum jam tersebut.',
    dikirimPada: hariLalu(2),
  },
  {
    id: 'bc-9c04b7e1',
    aplikasi: CAFEOS,
    judul: 'Fitur laporan penjualan harian',
    pesan:
      'Laporan penjualan harian kini bisa diunduh langsung dalam format Excel dari menu Laporan. Rekap otomatis dikirim setiap pukul 23.59 WIB.',
    dikirimPada: hariLalu(6),
  },
  {
    id: 'bc-51e7c3a8',
    aplikasi: BILLIARDOS,
    judul: 'Penyesuaian tarif booking per jam',
    pesan:
      'Mulai bulan depan, pengaturan tarif booking dapat dibedakan antara hari kerja dan akhir pekan. Silakan cek menu Pengaturan Meja untuk menyesuaikan tarif masing-masing.',
    dikirimPada: hariLalu(13),
  },
  {
    id: 'bc-c68d290f',
    aplikasi: null,
    judul: 'Perubahan nomor rekening pembayaran',
    pesan:
      'Pembayaran langganan kini dialihkan ke rekening baru atas nama PT FES Solution. Nomor lama masih menerima transfer sampai akhir bulan ini. Konfirmasi pembayaran tetap lewat admin.',
    dikirimPada: hariLalu(21),
  },
  {
    id: 'bc-3a5f81b6',
    aplikasi: CAFEOS,
    judul: 'Panduan penggunaan printer struk',
    pesan:
      'Panduan pemasangan printer struk Bluetooth sudah tersedia di halaman Bantuan, termasuk daftar model yang sudah diuji kompatibilitasnya.',
    dikirimPada: hariLalu(34),
  },
]
