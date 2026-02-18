import { defineConfig } from 'vite';

export default defineConfig({
  base: '/paideia/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
  server: {
    open: true,
  },
});
