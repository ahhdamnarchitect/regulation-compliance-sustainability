import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Production: force HTTPS so auth links and tokens are never sent over plain HTTP
if (import.meta.env.PROD && typeof window !== 'undefined' && window.location.protocol === 'http:') {
  window.location.replace(window.location.href.replace('http:', 'https:'));
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
