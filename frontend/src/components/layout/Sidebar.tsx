import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Boxes,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/auth-context'

type ItemNav = {
  path: string
  label: string
  Ikon: LucideIcon
  /** Cocokkan juga sub-rute di bawahnya. */
  end?: boolean
}

const ITEM_NAV: ItemNav[] = [
  { path: '/', label: 'Dashboard', Ikon: LayoutDashboard, end: true },
  { path: '/tenant', label: 'Tenant', Ikon: Users },
  { path: '/aplikasi', label: 'Aplikasi', Ikon: Boxes },
  { path: '/billing', label: 'Billing', Ikon: Wallet },
  { path: '/broadcast', label: 'Broadcast', Ikon: Megaphone },
]

/** Tooltip hanya dipakai saat sidebar tertutup — kalau terbuka labelnya sudah kelihatan. */
const KELAS_TOOLTIP =
  'pointer-events-none absolute left-full z-50 ml-3 -translate-x-1 whitespace-nowrap rounded-lg border border-hairline bg-elevated px-2.5 py-1.5 text-xs font-medium text-ink opacity-0 shadow-xl shadow-black/50 transition duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'

type Props = {
  terbuka: boolean
  onAlihkan: () => void
}

export function Sidebar({ terbuka, onAlihkan }: Props) {
  const { sudahMasuk, admin, keluar } = useAuth()
  const navigate = useNavigate()

  async function keluarDariPanel() {
    // Tokennya dibatalkan di server dulu, baru sesinya dibuang di sini.
    await keluar()
    navigate('/login', { replace: true })
  }

  /** Bentuk satu baris: kotak ikon saat tertutup, ikon + label saat terbuka. */
  const kelasBaris = terbuka
    ? 'flex h-11 w-full items-center gap-3 rounded-xl px-3'
    : 'grid size-11 place-items-center rounded-xl'

  return (
    <nav
      aria-label="Navigasi utama"
      className={`fixed inset-y-0 left-0 z-40 flex flex-col gap-1 overflow-x-hidden overflow-y-auto border-r border-hairline bg-surface/80 py-4 backdrop-blur-xl transition-[width] duration-200 ease-out ${
        terbuka ? 'w-56 items-stretch px-2' : 'w-15 items-center'
      }`}
    >
      <div className={`mb-4 flex shrink-0 items-center ${terbuka ? 'gap-3 px-1' : 'justify-center'}`}>
        <div
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-sm font-bold text-white shadow-lg shadow-accent/25"
          title="FES Solution"
        >
          FS
        </div>

        {terbuka && (
          <span className="truncate text-sm font-semibold tracking-tight text-ink">
            FES Solution
          </span>
        )}
      </div>

      {ITEM_NAV.map(({ path, label, Ikon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          aria-label={label}
          className={`group relative shrink-0 transition-colors ${kelasBaris}`}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="penanda-nav-aktif"
                  className="absolute inset-0 rounded-xl border border-accent/40 bg-accent-soft"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}

              <Ikon
                aria-hidden="true"
                className={`relative size-4.5 shrink-0 transition-colors ${
                  isActive ? 'text-accent-bright' : 'text-ink-faint group-hover:text-ink'
                }`}
              />

              {terbuka ? (
                <span
                  className={`relative truncate text-sm transition-colors ${
                    isActive ? 'text-accent-bright' : 'text-ink-muted group-hover:text-ink'
                  }`}
                >
                  {label}
                </span>
              ) : (
                <span role="tooltip" className={KELAS_TOOLTIP}>
                  {label}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}

      {/* mt-auto mendorong tombol tutup & keluar ke dasar sidebar. */}
      <button
        type="button"
        onClick={onAlihkan}
        aria-expanded={terbuka}
        aria-label={terbuka ? 'Tutup sidebar' : 'Buka sidebar'}
        className={`group relative mt-auto shrink-0 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink ${kelasBaris}`}
      >
        {terbuka ? (
          <PanelLeftClose className="size-4.5 shrink-0" aria-hidden="true" />
        ) : (
          <PanelLeftOpen className="size-4.5 shrink-0" aria-hidden="true" />
        )}

        {terbuka ? (
          <span className="truncate text-sm">Tutup menu</span>
        ) : (
          <span role="tooltip" className={KELAS_TOOLTIP}>
            Buka menu
          </span>
        )}
      </button>

      {sudahMasuk && (
        <button
          type="button"
          onClick={() => void keluarDariPanel()}
          aria-label="Keluar"
          className={`group relative shrink-0 transition-colors hover:bg-expired/10 ${kelasBaris}`}
        >
          <LogOut
            aria-hidden="true"
            className="size-4.5 shrink-0 text-ink-faint transition-colors group-hover:text-expired"
          />

          {terbuka ? (
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm text-ink-muted group-hover:text-expired">
                Keluar
              </span>
              {admin && (
                <span className="block truncate text-xs text-ink-faint">{admin.email}</span>
              )}
            </span>
          ) : (
            <span role="tooltip" className={KELAS_TOOLTIP}>
              Keluar{admin ? ` · ${admin.email}` : ''}
            </span>
          )}
        </button>
      )}
    </nav>
  )
}
