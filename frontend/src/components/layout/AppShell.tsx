import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { Sidebar } from '@/components/layout/Sidebar'
import { varianHalaman } from '@/lib/motion'

export function AppShell() {
  const location = useLocation()

  return (
    <div className="min-h-dvh">
      <Sidebar />

      {/* pl-15 = 60px, selebar sidebar */}
      <main className="pl-15">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={varianHalaman}
              initial="awal"
              animate="tampil"
              exit="keluar"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
