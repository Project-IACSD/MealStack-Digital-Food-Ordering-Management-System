import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    proxy: {
      '/student': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
          Referer: (process.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/',
        },
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/admin': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
          Referer: (process.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/',
        },
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/items': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
          Referer: (process.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/',
        },
      },
      '/dailyitems': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
          Referer: (process.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/',
        },
      },
      '/recharge': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
          Referer: (process.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/',
        },
      },
      '/orders': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
          Referer: (process.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/',
        },
      },
    },
  },
})
