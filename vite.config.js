import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.PORT || env.VITE_PORT || 3000)

  return {
    base: '/',
    server: {
      host: true,
      port,
      proxy: {
        // dev proxy → forward /directus/* ไปยัง Directus จริง
        // วิธีนี้ทำให้ browser ไม่ต้อง trust cert โดยตรง
        '/directus': {
          target: env.VITE_DIRECTUS_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/directus/, ''),
          secure: false,
        },
      },
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
