import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — dev server port, API proxy, and React plugin
// https://vite.dev/config/
export default defineConfig({
  // Enables JSX, Fast Refresh, etc.
  plugins: [react()],
  server:{
    // Same port your CORS policy allows on the backend (Program.cs WithOrigins)
    port: 3232,
    // Prevent Vite from full-reloading when tsconfig files get touched.
    // This avoids "server drops/hangs" during development.
    watch: {
      ignored: ['**/tsconfig*.json']
    },
    // Forward browser calls to "/api/..." to your .NET API during local dev (avoids CORS for same-origin /api)
    proxy: {
      '/api': {
        target: 'https://localhost:7218',
        changeOrigin: true,
        // Dev cert may be self-signed — don't fail TLS verification for the proxy hop
        secure: false,
        // Strip the "/api" prefix so /api/Books becomes https://localhost:7218/Books
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})
