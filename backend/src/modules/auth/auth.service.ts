import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { env } from '../../config/env.js'
import { prisma } from '../../lib/prisma.js'

/** Profil admin yang boleh dikirim ke klien — tanpa hash password. */
export type AdminDto = {
  id: string
  nama: string
  email: string
}

export type HasilLogin = {
  token: string
  admin: AdminDto
}

/** Isi token super admin. `sub` dipakai sebagai id admin. */
export type IsiToken = {
  sub: string
  email: string
  nama: string
}

/**
 * Masa hidup blacklist. Token yang umurnya sudah melewati ini pasti sudah
 * kedaluwarsa sendiri, jadi barisnya tidak perlu disimpan lagi.
 * Dilebihkan sedikit dari masa berlaku token supaya tidak ada celah.
 */
const UMUR_BLACKLIST_MS = 24 * 60 * 60 * 1000

/**
 * Verifikasi kredensial super admin. Mengembalikan null kalau email tidak
 * terdaftar atau passwordnya salah — pemanggil tidak boleh membedakan keduanya
 * supaya email yang terdaftar tidak bisa ditebak dari pesan galat.
 */
export async function masukSuperAdmin(email: string, password: string): Promise<HasilLogin | null> {
  const admin = await prisma.superAdmin.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, name: true, email: true, passwordHash: true },
  })
  if (!admin) return null

  const cocok = await bcrypt.compare(password, admin.passwordHash)
  if (!cocok) return null

  const isi: IsiToken = { sub: admin.id, email: admin.email, nama: admin.name }
  const token = jwt.sign(isi, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  })

  return {
    token,
    admin: { id: admin.id, nama: admin.name, email: admin.email },
  }
}

/**
 * Batalkan token sebelum masa berlakunya habis. Idempoten — logout dua kali
 * dengan token yang sama bukan error.
 */
export async function daftarHitamkanToken(token: string): Promise<void> {
  await prisma.tokenBlacklist.upsert({
    where: { token },
    update: {},
    create: { token },
  })

  // Bersihkan baris lama sekalian, supaya tabelnya tidak tumbuh selamanya.
  await prisma.tokenBlacklist.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - UMUR_BLACKLIST_MS) } },
  })
}

export async function tokenDidaftarHitam(token: string): Promise<boolean> {
  const ada = await prisma.tokenBlacklist.findUnique({
    where: { token },
    select: { id: true },
  })
  return ada !== null
}

/** Baca token; null kalau tanda tangannya salah, kedaluwarsa, atau isinya tidak utuh. */
export function bacaToken(token: string): IsiToken | null {
  try {
    const isi = jwt.verify(token, env.jwtSecret)
    if (typeof isi === 'string') return null

    const { sub, email, nama } = isi as Partial<IsiToken>
    if (typeof sub !== 'string' || typeof email !== 'string' || typeof nama !== 'string') {
      return null
    }
    return { sub, email, nama }
  } catch {
    return null
  }
}
