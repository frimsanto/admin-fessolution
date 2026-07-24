import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../config/env';
import { PrismaClient } from '../generated/prisma/client';

/**
 * Mulai Prisma 7 koneksi database dibuat lewat driver adapter,
 * bukan lagi dari `url` di schema.prisma.
 */
const adapter = new PrismaPg({
  connectionString: env.databaseUrl,
  ...(env.databasePoolMax !== undefined ? { max: env.databasePoolMax } : {}),
});

export const prisma = new PrismaClient({
  adapter,
  log: env.isProduction ? ['error'] : ['warn', 'error'],
});

export async function tutupKoneksiPrisma(): Promise<void> {
  await prisma.$disconnect();
}
