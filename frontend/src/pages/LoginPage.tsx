import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'

import { KREDENSIAL_TIRUAN } from '@/data/kredensial-tiruan'
import { adaGalat, validasiLogin, type GalatLogin } from '@/lib/validasi-login'
import type { IsianLogin } from '@/types/auth'

/**
 * Halaman masuk super admin. Berdiri di luar AppShell — tanpa sidebar, karena
 * belum ada yang boleh dibuka sebelum masuk.
 *
 * Pemeriksaan kredensial dan penyimpanan sesi menyusul di task berikutnya.
 */
export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordTampak, setPasswordTampak] = useState(false)
  const [galat, setGalat] = useState<GalatLogin>({})
  const [memproses, setMemproses] = useState(false)
  const [catatan, setCatatan] = useState<string | null>(null)

  function masuk() {
    const isian: IsianLogin = { email: email.trim(), password }

    const hasil = validasiLogin(isian)
    setGalat(hasil)
    if (adaGalat(hasil)) return

    setMemproses(true)
    setCatatan('Autentikasi belum tersambung — endpoint login belum ada di backend.')
    setMemproses(false)
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-sm font-bold text-white shadow-lg shadow-accent/25">
            FS
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-ink">Super Admin Panel</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Masuk untuk mengelola platform FES Solution.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            masuk()
          }}
          className="rounded-2xl border border-hairline bg-surface p-6"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email-login" className="mb-1.5 block text-xs text-ink-muted">
                Email
              </label>
              <input
                id="email-login"
                type="email"
                autoComplete="username"
                value={email}
                disabled={memproses}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fessolution.my.id"
                aria-invalid={galat.email !== undefined}
                aria-describedby={galat.email ? 'galat-email-login' : undefined}
                className="w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 disabled:opacity-60"
              />
              {galat.email && (
                <p id="galat-email-login" role="alert" className="mt-1.5 text-xs text-expired">
                  {galat.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password-login" className="mb-1.5 block text-xs text-ink-muted">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-login"
                  type={passwordTampak ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  disabled={memproses}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={galat.password !== undefined}
                  aria-describedby={galat.password ? 'galat-password-login' : undefined}
                  className="w-full rounded-lg border border-hairline bg-elevated py-2 pr-10 pl-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setPasswordTampak((tampak) => !tampak)}
                  aria-label={passwordTampak ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-ink-faint transition-colors hover:text-ink"
                >
                  {passwordTampak ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {galat.password && (
                <p id="galat-password-login" role="alert" className="mt-1.5 text-xs text-expired">
                  {galat.password}
                </p>
              )}
            </div>
          </div>

          {catatan && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-suspended/30 bg-suspended/10 px-3 py-2 text-sm text-ink"
            >
              {catatan}
            </p>
          )}

          <button
            type="submit"
            disabled={memproses}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {memproses ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="size-4" aria-hidden="true" />
            )}
            {memproses ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>

        {/* Jalan masuk sementara selama endpoint login belum ada. */}
        <div className="mt-4 rounded-xl border border-hairline bg-elevated/40 px-4 py-3 text-xs text-ink-faint">
          <p className="font-medium text-ink-muted">Kredensial sementara</p>
          <p className="mt-1 font-mono">{KREDENSIAL_TIRUAN.email}</p>
          <p className="font-mono">{KREDENSIAL_TIRUAN.password}</p>
          <p className="mt-2">
            Dipakai selama endpoint login backend belum tersedia, dan dihapus setelah
            autentikasi asli tersambung.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
