import type { Variants } from 'framer-motion'

const MULUS = [0.22, 1, 0.36, 1] as const

/** Transisi antar halaman. */
export const varianHalaman: Variants = {
  awal: { opacity: 0, y: 10 },
  tampil: { opacity: 1, y: 0, transition: { duration: 0.28, ease: MULUS } },
  keluar: { opacity: 0, y: -6, transition: { duration: 0.16, ease: 'easeIn' } },
}

/** Induk daftar — memunculkan anaknya satu per satu. */
export const varianDaftar: Variants = {
  awal: {},
  tampil: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
}

/** Anak daftar / kartu. */
export const varianItem: Variants = {
  awal: { opacity: 0, y: 12 },
  tampil: { opacity: 1, y: 0, transition: { duration: 0.34, ease: MULUS } },
}
