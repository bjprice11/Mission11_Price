// Base URL for all fetch() calls to your backend BooksController
//
// In development (npm run dev), Vite serves the React app and proxies "/api/*" to https://localhost:7218
// (see frontend/vite.config.ts). So we call "/api/Books" which becomes "https://localhost:7218/Books".
//
// In production build, there is no Vite proxy — you'd point this at your real API host.
export const apiBase = import.meta.env.DEV ? "/api" : "https://mission13backend-h9ehe7h5csa8g4da.francecentral-01.azurewebsites.net";
