// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { writeFile } from 'node:fs/promises';

// Set the real production URL at build time, for example PUBLIC_SITE_URL=https://…
const site = process.env.PUBLIC_SITE_URL?.trim();
const sitemapIntegration = site && sitemap({
  filter: (page) => !new URL(page).pathname.replace(/\/+$/, '').endsWith('/privacidad'),
});

// https://astro.build/config
export default defineConfig({
  ...(site ? { site } : {}),
  integrations: [react(), ...(sitemapIntegration ? [sitemapIntegration] : []), {
    name: 'turnate-robots',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (!site) return;
        const sitemapUrl = new URL('sitemap-index.xml', site.endsWith('/') ? site : `${site}/`);
        await writeFile(new URL('robots.txt', dir), `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`);
      },
    },
  }],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Allows temporary LocalTunnel preview URLs during local development.
    server: { allowedHosts: ['.loca.lt'] },
  },
});
