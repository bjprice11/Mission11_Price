import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Global Bootstrap styles — gives you grid, buttons, cards, spinners, etc. without importing per component
import 'bootstrap/dist/css/bootstrap.min.css'

//this is the main entry point for the application — the browser loads index.html, which runs this file
// createRoot attaches React to the <div id="root"></div> in index.html
createRoot(document.getElementById('root')!).render(
  // StrictMode double-invokes some effects in dev on purpose to help catch bugs — safe to keep on
  <StrictMode>
    <App />
  </StrictMode>,
)
