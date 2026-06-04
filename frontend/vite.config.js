import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('recharts')) return 'charts'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react')) return 'react'
          return 'vendor'
        },
      },
    },
  },
})
