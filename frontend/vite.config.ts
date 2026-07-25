import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 5173 dipakai CafeOS di mesin ini; strictPort supaya bentrok gagal terang-terangan
    // daripada diam-diam pindah port.
    port: 5175,
    strictPort: true,
    proxy: {
      // Saat dev, panggilan /api diteruskan ke backend di port 4002.
      '/api': {
        target: 'http://localhost:4002',
        changeOrigin: true,
      },
    },
  },
})
