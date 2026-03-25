import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3232,
    // Prevent Vite from full-reloading when tsconfig files get touched.
    // This avoids "server drops/hangs" during development.
    watch: {
      ignored: ['**/tsconfig*.json']
    },
    proxy: {
      '/api': {
        target: 'https://localhost:7218',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})
