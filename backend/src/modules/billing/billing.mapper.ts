/** Bentuk pembayaran yang dikirim ke frontend (lihat frontend/src/types/pembayaran.ts). */
export type PembayaranDto = {
  id: string
  tenantId: string
  namaBisnis: string
  aplikasi: {
    appId: string
    nama: string
    slug: string
  }
  /** Rupiah penuh sebagai angka — Prisma mengembalikan Decimal, jadi dikonversi di sini. */
  jumlah: number
  tanggalBayar: string
  catatanAdmin: string | null
}

type PembayaranDenganTenant = {
  id: string
  tenantId: string
  amount: { toString(): string }
  paymentDate: Date
  adminNote: string | null
  tenant: {
    businessName: string
    app: { id: string; name: string; slug: string }
  }
}

/** Kolom yang wajib diambil agar `kePembayaranDto` bisa bekerja. */
export const PILIH_PEMBAYARAN = {
  id: true,
  tenantId: true,
  amount: true,
  paymentDate: true,
  adminNote: true,
  tenant: {
    select: {
      businessName: true,
      app: { select: { id: true, name: true, slug: true } },
    },
  },
} as const

export function kePembayaranDto(bayar: PembayaranDenganTenant): PembayaranDto {
  return {
    id: bayar.id,
    tenantId: bayar.tenantId,
    namaBisnis: bayar.tenant.businessName,
    aplikasi: {
      appId: bayar.tenant.app.id,
      nama: bayar.tenant.app.name,
      slug: bayar.tenant.app.slug,
    },
    // Decimal → number. Tanpa ini nilainya terkirim sebagai string.
    jumlah: Number(bayar.amount.toString()),
    tanggalBayar: bayar.paymentDate.toISOString(),
    catatanAdmin: bayar.adminNote,
  }
}
