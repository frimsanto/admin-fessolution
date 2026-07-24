/**
 * Helper tanggal berbasis zona WIB (UTC+7) — platform ini dipakai dari Indonesia,
 * sedangkan server menyimpan waktu dalam UTC.
 */
const OFFSET_WIB_MS = 7 * 60 * 60 * 1000;

/** Awal bulan berjalan (tanggal 1, 00:00 WIB) dalam objek Date UTC. */
export function awalBulanWib(sekarang: Date = new Date()): Date {
  const wib = new Date(sekarang.getTime() + OFFSET_WIB_MS);
  const awalWib = Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), 1, 0, 0, 0, 0);
  return new Date(awalWib - OFFSET_WIB_MS);
}

/** Waktu `jumlah` hari ke depan dari `sekarang`. */
export function tambahHari(jumlah: number, sekarang: Date = new Date()): Date {
  return new Date(sekarang.getTime() + jumlah * 24 * 60 * 60 * 1000);
}
