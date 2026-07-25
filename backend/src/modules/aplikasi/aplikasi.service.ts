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

export const POLA_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

export type IsianAplikasiBaru = {
  nama: string
  slug: string
}

/** Aplikasi yang baru dibuat: langsung berjalan dan belum punya tenant. */
function keAplikasiBaru(item: {
  id: string
  name: string
  slug: string
  status: boolean
  createdAt: Date
}): AplikasiDto {
  return {
    appId: item.id,
    nama: item.name,
    slug: item.slug,
    aktif: item.status,
    jumlahTenant: 0,
    jumlahTenantAktif: 0,
    dibuatPada: item.createdAt.toISOString(),
  }
}

export type GagalBuatAplikasi = { bentrok: 'nama' | 'slug'; pesan: string }

/**
 * Tambah aplikasi baru. Mengembalikan objek bentrok kalau nama atau slugnya
 * sudah dipakai — pengecekan tetap dilapisi unique constraint di database
 * supaya dua permintaan bersamaan tidak lolos berdua.
 */
export async function buatAplikasi(
  isian: IsianAplikasiBaru,
): Promise<AplikasiDto | GagalBuatAplikasi> {
  const nama = isian.nama.trim()
  const slug = isian.slug.trim()

  const kembarNama = await prisma.app.findFirst({
    where: { name: { equals: nama, mode: 'insensitive' } },
    select: { name: true },
  })
  if (kembarNama) {
    return { bentrok: 'nama', pesan: `Nama "${kembarNama.name}" sudah dipakai aplikasi lain.` }
  }

  const kembarSlug = await prisma.app.findFirst({
    where: { slug: { equals: slug, mode: 'insensitive' } },
    select: { name: true },
  })
  if (kembarSlug) {
    return { bentrok: 'slug', pesan: `Slug "${slug}" sudah dipakai oleh ${kembarSlug.name}.` }
  }

  try {
    const dibuat = await prisma.app.create({
      data: { name: nama, slug },
      select: { id: true, name: true, slug: true, status: true, createdAt: true },
    })
    return keAplikasiBaru(dibuat)
  } catch (err) {
    // P2002 = unique constraint; terjadi kalau ada permintaan lain menyelip.
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      return { bentrok: 'slug', pesan: `Slug "${slug}" sudah dipakai aplikasi lain.` }
    }
    throw err
  }
}

export function adalahGagal(hasil: AplikasiDto | GagalBuatAplikasi): hasil is GagalBuatAplikasi {
  return 'bentrok' in hasil
}

/** Satu aplikasi lengkap dengan hitungan tenantnya. */
async function ambilSatuAplikasi(id: string): Promise<AplikasiDto | null> {
  const [aplikasi, jumlahAktif] = await Promise.all([
    prisma.app.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        _count: { select: { tenants: true } },
      },
    }),
    prisma.tenant.count({ where: { appId: id, status: TenantStatus.AKTIF } }),
  ])

  if (!aplikasi) return null

  return {
    appId: aplikasi.id,
    nama: aplikasi.name,
    slug: aplikasi.slug,
    aktif: aplikasi.status,
    jumlahTenant: aplikasi._count.tenants,
    jumlahTenantAktif: jumlahAktif,
    dibuatPada: aplikasi.createdAt.toISOString(),
  }
}

/**
 * Balik status berjalan/nonaktif sebuah aplikasi.
 * Mengembalikan null kalau aplikasinya tidak ada.
 */
export async function toggleStatusAplikasi(id: string): Promise<AplikasiDto | null> {
  const sekarang = await prisma.app.findUnique({ where: { id }, select: { status: true } })
  if (!sekarang) return null

  await prisma.app.update({
    where: { id },
    data: { status: !sekarang.status },
  })

  return ambilSatuAplikasi(id)
}
