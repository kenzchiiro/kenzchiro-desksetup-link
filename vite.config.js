import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.PORT || env.VITE_PORT || 3000)

  return {
    base: '/',
    server: {
      host: true,
      port,
    },
    preview: {
      host: true,
      port,
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
