import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  assetsInclude: ['**/*.glb'], // Add GLB files to the list of handled asset types
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: '/index.html'
      }
    }
  },
})