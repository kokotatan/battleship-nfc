import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: 'index.html',
        hit: 'hit.html',
        miss: 'miss.html',
        victory: 'victory.html',
        test: 'test.html',
        nfcHandler: 'h/index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
