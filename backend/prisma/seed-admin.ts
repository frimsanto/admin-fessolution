/**
 * Seed akun super admin awal — satu-satunya jalan masuk ke panel.
 * Idempoten: dijalankan berulang kali hanya memperbarui nama dan password
 * akun yang sama, tidak pernah membuat duplikat.
 *
 * Jalankan: npm run seed:admin
 * Kredensial bisa ditimpa lewat env SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD /
 * SEED_ADMIN_NAME.
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'

import { prisma, tutupKoneksiPrisma } from '../src/lib/prisma.js'

const NAMA = process.env.SEED_ADMIN_NAME?.trim() || 'Super Admin FES Solution'
const EMAIL = (process.env.SEED_ADMIN_EMAIL?.trim() || 'admin@fessolution.my.id').toLowerCase()
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'superadmin123'

/** Biaya hashing bcrypt; 10 putaran, cukup untuk login yang jarang dipakai. */
const PUTARAN = 10

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, PUTARAN)

  const admin = await prisma.superAdmin.upsert({
    where: { email: EMAIL },
    update: { name: NAMA, passwordHash },
    create: { name: NAMA, email: EMAIL, passwordHash },
    select: { id: true, name: true, email: true },
  })

  console.log(`[seed:admin] Akun siap: ${admin.email} (${admin.name}) — id ${admin.id}`)
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`[seed:admin] Password bawaan "${PASSWORD}" — ganti sebelum dipakai di produksi.`)
  }
}

main()
  .catch((err) => {
    console.error('[seed:admin] Gagal:', err)
    process.exitCode = 1
  })
  .finally(() => tutupKoneksiPrisma())
