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
      proxy: {
        '/__directus': {
          target: env.VITE_DIRECTUS_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/__directus/, ''),
        },
      },
    },
    preview: {
      host: 'localhost',
      port,
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        maxParallelFileOps: 2,
      },
    },
  }
})
