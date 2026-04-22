import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('react')) return 'vendor-react'
          if (id.includes('react-router')) return 'vendor-router'
          return 'vendor'
        }

        if (id.includes('/src/pages/admin/')) {
          return 'admin'
        }

        if (id.includes('/src/pages/customers/')) {
          return 'customers'
        }

        if (id.includes('/src/pages/policies/')) {
          return 'policies'
        }
      }
    }
  }
}
});
