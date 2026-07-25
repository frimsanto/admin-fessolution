import 'dotenv/config';

function wajib(nama: string): string {
  const nilai = process.env[nama];
  if (!nilai || nilai.trim() === '') {
    throw new Error(`Environment variable ${nama} wajib diisi (lihat .env.example)`);
  }
  return nilai;
}

function angka(nama: string, bawaan: number): number {
  const nilai = process.env[nama];
  if (!nilai) return bawaan;
  const hasil = Number(nilai);
  if (Number.isNaN(hasil)) {
    throw new Error(`Environment variable ${nama} harus berupa angka`);
  }
  return hasil;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: angka('PORT', 4002),
  databaseUrl: wajib('DATABASE_URL'),
  /** Batas koneksi pool PostgreSQL. Kosongkan untuk memakai default driver. */
  databasePoolMax: process.env.DATABASE_POOL_MAX
    ? angka('DATABASE_POOL_MAX', 10)
    : undefined,
  /** Kunci penandatangan JWT super admin. Wajib — tidak ada nilai bawaan. */
  jwtSecret: wajib('JWT_SECRET'),
  /** Masa berlaku token, format `ms` (mis. `8h`). */
  jwtExpiresIn: process.env.JWT_EXPIRES_IN?.trim() || '8h',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((asal) => asal.trim())
    .filter(Boolean),
};
