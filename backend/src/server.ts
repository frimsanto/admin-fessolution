import { buatApp } from './app.js';
import { env } from './config/env.js';
import { tutupKoneksiPrisma } from './lib/prisma.js';

const app = buatApp();

const server = app.listen(env.port, () => {
  console.log(`[server] API Super Admin FES Solution jalan di port ${env.port} (${env.nodeEnv})`);
});

async function matikanServer(sinyal: string): Promise<void> {
  console.log(`[server] Menerima ${sinyal}, mematikan server…`);
  server.close(() => {
    void tutupKoneksiPrisma().finally(() => process.exit(0));
  });
}

process.on('SIGINT', () => void matikanServer('SIGINT'));
process.on('SIGTERM', () => void matikanServer('SIGTERM'));
