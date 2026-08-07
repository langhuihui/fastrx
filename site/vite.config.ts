import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'site',
  plugins: [react()],
  build: {
    outDir: '../site-dist',
    emptyOutDir: true,
  },
});
