const formatterTanggal = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

const formatterRupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

/** "12 Mei 2026" */
export function formatTanggal(iso: string): string {
  return formatterTanggal.format(new Date(iso))
}

export function formatRupiah(jumlah: number): string {
  return formatterRupiah.format(jumlah)
}

/**
 * Selisih hari kalender (WIB) dari sekarang ke `iso`.
 * Negatif berarti sudah lewat.
 */
export function sisaHari(iso: string, sekarang: Date = new Date()): number {
  const MS_HARI = 86_400_000
  const OFFSET_WIB = 7 * 60 * 60 * 1000
  const hariTarget = Math.floor((new Date(iso).getTime() + OFFSET_WIB) / MS_HARI)
  const hariSekarang = Math.floor((sekarang.getTime() + OFFSET_WIB) / MS_HARI)
  return hariTarget - hariSekarang
}

/** "3 hari lagi" / "berakhir hari ini" / "lewat 5 hari" */
export function labelSisaHari(iso: string, sekarang: Date = new Date()): string {
  const selisih = sisaHari(iso, sekarang)
  if (selisih === 0) return 'berakhir hari ini'
  if (selisih > 0) return `${selisih} hari lagi`
  return `lewat ${Math.abs(selisih)} hari`
}
