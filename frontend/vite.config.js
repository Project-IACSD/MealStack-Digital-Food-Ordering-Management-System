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
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:8080',
          Referer: 'http://localhost:8080/',
        },
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:8080',
          Referer: 'http://localhost:8080/',
        },
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/items': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:8080',
          Referer: 'http://localhost:8080/',
        },
      },
      '/dailyitems': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:8080',
          Referer: 'http://localhost:8080/',
        },
      },
      '/recharge': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:8080',
          Referer: 'http://localhost:8080/',
        },
      },
      '/orders': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:8080',
          Referer: 'http://localhost:8080/',
        },
      },
    },
  },
})
