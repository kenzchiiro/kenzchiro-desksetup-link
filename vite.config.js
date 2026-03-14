import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.PORT || env.VITE_PORT || 3000)

  return {
    base: '/',
    server: {
      host: 'localhost',
      port,
    },
    preview: {
      host: 'localhost',
      port,
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
