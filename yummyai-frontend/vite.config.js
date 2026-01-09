import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': 'http://100.117.101.70:3001',
      '/users': 'http://100.117.101.70:3001',
      '/recipes': 'http://100.117.101.70:3001',
      '/login-confirmation': 'http://100.117.101.70:3001',
      '/myfridge': 'http://100.117.101.70:3001'
    }
  }
})
