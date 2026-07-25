import { TenantStatus } from '../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'

export type AplikasiDto = {
  appId: string
  nama: string
  slug: string
  /** true = aplikasi sedang berjalan (status global aktif). */
  aktif: boolean
  jumlahTenant: number
  jumlahTenantAktif: number
  dibuatPada: string
}

export type DaftarAplikasi = {
  total: number
  berjalan: number
  nonaktif: number
  daftar: AplikasiDto[]
}

/**
 * Daftar aplikasi SaaS yang dikelola platform beserta jumlah tenantnya.
 * Aplikasi yang berjalan ditampilkan lebih dulu.
 */
export async function ambilDaftarAplikasi(): Promise<DaftarAplikasi> {
  const [aplikasi, tenantAktifPerAplikasi] = await Promise.all([
    prisma.app.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        _count: { select: { tenants: true } },
      },
      orderBy: [{ status: 'desc' }, { name: 'asc' }],
    }),
    prisma.tenant.groupBy({
      by: ['appId'],
      where: { status: TenantStatus.AKTIF },
      _count: { _all: true },
    }),
  ])

  const jumlahAktifPerAplikasi = new Map<string, number>(
    tenantAktifPerAplikasi.map((baris) => [baris.appId, baris._count._all]),
  )

  const daftar: AplikasiDto[] = aplikasi.map((item) => ({
    appId: item.id,
    nama: item.name,
    slug: item.slug,
    aktif: item.status,
    jumlahTenant: item._count.tenants,
    jumlahTenantAktif: jumlahAktifPerAplikasi.get(item.id) ?? 0,
    dibuatPada: item.createdAt.toISOString(),
  }))

  const berjalan = daftar.filter((item) => item.aktif).length

  return {
    total: daftar.length,
    berjalan,
    nonaktif: daftar.length - berjalan,
    daftar,
  }
}
