import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'PORT')
  const apiPort = process.env.PORT || env.PORT || '3001'
  const proxy = {
    '/api': {
      target: `http://127.0.0.1:${apiPort}`,
      // Preserve the browser's host so the API can validate same-origin requests,
      // including when Vite selects another port or the site is opened over LAN.
      changeOrigin: false,
    },
  }

  return {
    plugins: [react()],
    server: { port: 5173, proxy },
    preview: { proxy },
  }
})
