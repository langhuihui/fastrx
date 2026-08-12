import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE_ORIGIN = 'https://rx.langhuihui.com';
const SITE_PATHS = ['/', '/playground'] as const;

/** Emit robots.txt + sitemap.xml with absolute URLs, plus SPA 404 fallback. */
function seoArtifacts(): Plugin {
  return {
    name: 'fastrx-seo-artifacts',
    closeBundle() {
      const outDir = fileURLToPath(new URL('../site-dist', import.meta.url));
      if (!existsSync(outDir)) return;

      const origin = (process.env.VITE_SITE_URL ?? SITE_ORIGIN).replace(/\/+$/, '');
      const abs = (path: string) =>
        `${origin}${path === '/' ? '/' : path}`;

      const lastmod = new Date().toISOString().slice(0, 10);
      const urls = SITE_PATHS.map(
        (path) => `  <url>
    <loc>${abs(path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
      ).join('\n');

      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
      );

      writeFileSync(
        join(outDir, 'robots.txt'),
        `User-agent: *
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`,
      );

      // SPA fallback for hosts that serve 404.html on unknown paths (e.g. GitHub Pages).
      const indexHtml = join(outDir, 'index.html');
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, join(outDir, '404.html'));
      }
    },
  };
}

export default defineConfig({
  root: 'site',
  plugins: [react(), seoArtifacts()],
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
