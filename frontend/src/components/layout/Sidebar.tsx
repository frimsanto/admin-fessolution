import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Boxes,
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

/** Sidebar sengaja icon-only, jadi setiap tombol punya tooltip yang sama. */
const KELAS_TOOLTIP =
  'pointer-events-none absolute left-full z-50 ml-3 -translate-x-1 whitespace-nowrap rounded-lg border border-hairline bg-elevated px-2.5 py-1.5 text-xs font-medium text-ink opacity-0 shadow-xl shadow-black/50 transition duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'

export function Sidebar() {
  const { sudahMasuk, admin, keluar } = useAuth()
  const navigate = useNavigate()

  async function keluarDariPanel() {
    // Tokennya dibatalkan di server dulu, baru sesinya dibuang di sini.
    await keluar()
    navigate('/login', { replace: true })
  }

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-y-0 left-0 z-40 flex w-15 flex-col items-center gap-1 overflow-y-auto border-r border-hairline bg-surface/80 py-4 backdrop-blur-xl"
    >
      <div
        className="mb-4 grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-sm font-bold text-white shadow-lg shadow-accent/25"
        title="FES Solution"
      >
        FS
      </div>

      {ITEM_NAV.map(({ path, label, Ikon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          aria-label={label}
          className="group relative grid size-11 shrink-0 place-items-center rounded-xl transition-colors"
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
                className={`relative size-4.5 transition-colors ${
                  isActive
                    ? 'text-accent-bright'
                    : 'text-ink-faint group-hover:text-ink'
                }`}
              />

              <span role="tooltip" className={KELAS_TOOLTIP}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}

      {sudahMasuk && (
        <button
          type="button"
          onClick={() => void keluarDariPanel()}
          aria-label="Keluar"
          // mt-auto menempelkan tombol keluar ke dasar sidebar, jauh dari navigasi.
          className="group relative mt-auto grid size-11 shrink-0 place-items-center rounded-xl transition-colors hover:bg-expired/10"
        >
          <LogOut
            aria-hidden="true"
            className="size-4.5 text-ink-faint transition-colors group-hover:text-expired"
          />

          <span role="tooltip" className={KELAS_TOOLTIP}>
            Keluar{admin ? ` · ${admin.email}` : ''}
          </span>
        </button>
      )}
    </nav>
  )
}
