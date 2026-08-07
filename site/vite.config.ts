import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: 'site',
  plugins: [react()],
  // `fastrx` is the root package itself; alias it to the TypeScript source so
  // the site can be built standalone from the repo root without needing a
  // pre-built `dist`/`es` or a `node_modules/fastrx` symlink.
  resolve: {
    alias: {
      fastrx: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: '../site-dist',
    emptyOutDir: true,
  },
});
