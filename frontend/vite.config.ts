import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server + proxy: browser calls /api/... → forwarded to .NET (see apiBase.ts)
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3232,
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
