import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET;

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      port: 3000,
      proxy: devProxyTarget
        ? {
            '/api': { target: devProxyTarget, changeOrigin: true },
          }
        : undefined,
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router')) return 'vendor-router';
              return 'vendor'; // ← React stays here, always loads first
            }

            if (id.includes('/src/pages/admin/')) return 'admin';
            if (id.includes('/src/pages/customers/')) return 'customers';
            if (id.includes('/src/pages/policies/')) return 'policies';
          },
        },
      },
    },
  };
});
