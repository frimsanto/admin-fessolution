import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Konfigurasi Prisma 7. Mulai v7 connection string tidak lagi ditaruh di
 * schema.prisma, melainkan di file ini (dipakai oleh CLI migrate/introspect).
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
  },
});
