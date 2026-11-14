import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In development every /api request is proxied to the Express backend, so the
// browser talks to one origin and the backend's CORS setting doesn't matter.
// Set API_PROXY_TARGET to use a backend elsewhere, e.g.
//   API_PROXY_TARGET=http://localhost:4100 npm run dev
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': process.env.API_PROXY_TARGET || 'http://localhost:4000',
    },
  },
});
