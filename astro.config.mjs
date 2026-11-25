// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { writeFileSync } from 'node:fs';
import { satteri } from '@astrojs/markdown-satteri';
import { contentState, liveLinksPlugin } from './scripts/lib/live-content.mjs';

// Superficie de entorno (FND-05). Solo el valor exacto `production` indexa;
// cualquier otro valor (incluido `Production` o vacío) se trata como no productivo.
const env = { ...loadEnv('production', process.cwd(), 'PUBLIC_'), ...process.env };

/** @param {string | undefined} value */
function parseSiteUrl(value) {
  const raw = (value ?? '').trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

// Rutas que no existen en este build: borradores y contenido con fecha futura. Salen `noindex` donde existan (local o
// preview), no entran al sitemap y en producción no se generan. El cron diario las activa cuando llega su fecha.
const { live: livePaths, hidden: hiddenPaths, dates: contentDates } = contentState();
const isProd = env.PUBLIC_ENV !== 'local' && env.PUBLIC_ENV !== 'preview';

const site = parseSiteUrl(env.PUBLIC_SITE_URL) ?? 'https://loopsgrowth.com';

// Workers Assets redirige `/ruta` a `/ruta/` con un 307. Con `_redirects` la redirección es permanente (301).
/** @type {import('astro').AstroIntegration} */
const redirectsSinBarra = {
  name: 'redirects-sin-barra',
  hooks: {
    'astro:build:done': ({ dir, pages }) => {
      const lines = pages
        .map((p) => p.pathname)
        .filter((p) => p.endsWith('/') && p !== '404/' && !p.startsWith('marca/'))
        .map((p) => `/${p.slice(0, -1)} /${p} 301`);
      writeFileSync(new URL('_redirects', dir), `${lines.sort().join('\n')}\n`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site,
  integrations: [
    redirectsSinBarra,
    sitemap({
      filter: (page) =>
        !page.includes('/privacidad') && !page.includes('/404') && !hiddenPaths.has(new URL(page).pathname) && !page.includes('/marca/hoja'),
      // `lastmod` solo cuando hay una fecha real en el contenido (`updatedDate`, `pubDate` o `publishAt`); las páginas sin
      // fecha salen sin `lastmod` (la fecha del build cambiaría cada día sin que cambie nada).
      serialize(item) {
        const date = contentDates.get(new URL(item.url).pathname);
        if (date) item.lastmod = date.toISOString();
        return item;
      },
    }),
  ],
  markdown: isProd ? { processor: satteri({ mdastPlugins: [liveLinksPlugin(livePaths)] }) } : {},
  vite: {
    plugins: [tailwindcss()],
    // Los scripts de la página (entradas del home, formulario) salen como archivos y no inflan el HTML de `/` (presupuesto de peso).
    build: { assetsInlineLimit: 0 },
  },
  fonts: [
    {
      name: 'Outfit',
      cssVariable: '--font-brand',
      provider: fontProviders.fontsource(),
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
  ],
});
