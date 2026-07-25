import { prisma } from '../../lib/prisma';
import { TenantStatus } from '../../generated/prisma/enums';
import { awalBulanWib, tambahHari } from '../../utils/tanggal';

export type StatistikTenantPerAplikasi = {
  appId: string;
  nama: string;
  slug: string;
  aplikasiAktif: boolean;
  total: number;
  aktif: number;
  trial: number;
  suspended: number;
  expired: number;
};

export type StatistikTenant = {
  total: number;
  aktif: number;
  trial: number;
  suspended: number;
  expired: number;
  baruBulanIni: number;
  akanExpired7Hari: number;
  perAplikasi: StatistikTenantPerAplikasi[];
};

type RincianStatus = Record<TenantStatus, number>;

function rincianKosong(): RincianStatus {
  return {
    [TenantStatus.TRIAL]: 0,
    [TenantStatus.AKTIF]: 0,
    [TenantStatus.SUSPENDED]: 0,
    [TenantStatus.EXPIRED]: 0,
  };
}

/**
 * Statistik tenant untuk Dashboard Overview:
 * jumlah tenant per status, tenant baru bulan ini, tenant yang akan habis masa
 * aktifnya dalam 7 hari, serta rincian per aplikasi SaaS.
 */
export async function ambilStatistikTenant(sekarang: Date = new Date()): Promise<StatistikTenant> {
  const awalBulan = awalBulanWib(sekarang);
  const batas7Hari = tambahHari(7, sekarang);

  const [perStatus, perAplikasiStatus, daftarAplikasi, baruBulanIni, akanExpired7Hari] =
    await Promise.all([
      prisma.tenant.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.tenant.groupBy({
        by: ['appId', 'status'],
        _count: { _all: true },
      }),
      prisma.app.findMany({
        select: { id: true, name: true, slug: true, status: true },
        orderBy: { name: 'asc' },
      }),
      prisma.tenant.count({
        where: { joinedDate: { gte: awalBulan } },
      }),
      prisma.tenant.count({
        where: {
          status: { in: [TenantStatus.TRIAL, TenantStatus.AKTIF] },
          expiredDate: { gte: sekarang, lte: batas7Hari },
        },
      }),
    ]);

  const totalPerStatus = rincianKosong();
  for (const baris of perStatus) {
    totalPerStatus[baris.status] = baris._count._all;
  }

  const perAplikasiMap = new Map<string, RincianStatus>();
  for (const baris of perAplikasiStatus) {
    const rincian = perAplikasiMap.get(baris.appId) ?? rincianKosong();
    rincian[baris.status] = baris._count._all;
    perAplikasiMap.set(baris.appId, rincian);
  }

  const perAplikasi: StatistikTenantPerAplikasi[] = daftarAplikasi.map((aplikasi) => {
    const rincian = perAplikasiMap.get(aplikasi.id) ?? rincianKosong();
    const total =
      rincian.TRIAL + rincian.AKTIF + rincian.SUSPENDED + rincian.EXPIRED;

    return {
      appId: aplikasi.id,
      nama: aplikasi.name,
      slug: aplikasi.slug,
      aplikasiAktif: aplikasi.status,
      total,
      aktif: rincian.AKTIF,
      trial: rincian.TRIAL,
      suspended: rincian.SUSPENDED,
      expired: rincian.EXPIRED,
    };
  });

  const total =
    totalPerStatus.TRIAL +
    totalPerStatus.AKTIF +
    totalPerStatus.SUSPENDED +
    totalPerStatus.EXPIRED;

  return {
    total,
    aktif: totalPerStatus.AKTIF,
    trial: totalPerStatus.TRIAL,
    suspended: totalPerStatus.SUSPENDED,
    expired: totalPerStatus.EXPIRED,
    baruBulanIni,
    akanExpired7Hari,
    perAplikasi,
  };
}

export type RingkasanAplikasi = {
  appId: string;
  nama: string;
  slug: string;
  /** true = aplikasi sedang berjalan (status global aktif). */
  aktif: boolean;
  jumlahTenant: number;
  jumlahTenantAktif: number;
  dibuatPada: string;
};

export type DaftarAplikasi = {
  total: number;
  berjalan: number;
  nonaktif: number;
  daftar: RingkasanAplikasi[];
};

/**
 * Daftar aplikasi SaaS yang dikelola platform untuk Dashboard Overview:
 * aplikasi mana yang sedang berjalan beserta jumlah tenant-nya.
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
  ]);

  const jumlahAktifPerAplikasi = new Map<string, number>(
    tenantAktifPerAplikasi.map((baris) => [baris.appId, baris._count._all]),
  );

  const daftar: RingkasanAplikasi[] = aplikasi.map((item) => ({
    appId: item.id,
    nama: item.name,
    slug: item.slug,
    aktif: item.status,
    jumlahTenant: item._count.tenants,
    jumlahTenantAktif: jumlahAktifPerAplikasi.get(item.id) ?? 0,
    dibuatPada: item.createdAt.toISOString(),
  }));

  const berjalan = daftar.filter((item) => item.aktif).length;

  return {
    total: daftar.length,
    berjalan,
    nonaktif: daftar.length - berjalan,
    daftar,
  };
}

export type RingkasanDashboard = {
  tenant: StatistikTenant;
  aplikasi: DaftarAplikasi;
  dibuatPada: string;
};

/**
 * Ringkasan Dashboard Overview. Berisi blok statistik tenant dan daftar
 * aplikasi; blok pendapatan menyusul di task berikutnya.
 */
export async function ambilRingkasanDashboard(
  sekarang: Date = new Date(),
): Promise<RingkasanDashboard> {
  const [tenant, aplikasi] = await Promise.all([
    ambilStatistikTenant(sekarang),
    ambilDaftarAplikasi(),
  ]);

  return {
    tenant,
    aplikasi,
    dibuatPada: sekarang.toISOString(),
  };
}
