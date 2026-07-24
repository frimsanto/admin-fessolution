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

export type RingkasanDashboard = {
  tenant: StatistikTenant;
  dibuatPada: string;
};

/**
 * Ringkasan Dashboard Overview. Untuk saat ini berisi blok statistik tenant;
 * blok pendapatan & status aplikasi menyusul di task berikutnya.
 */
export async function ambilRingkasanDashboard(
  sekarang: Date = new Date(),
): Promise<RingkasanDashboard> {
  const tenant = await ambilStatistikTenant(sekarang);

  return {
    tenant,
    dibuatPada: sekarang.toISOString(),
  };
}
