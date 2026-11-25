// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
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
const { live: livePaths, hidden: hiddenPaths } = contentState();
const isProd = env.PUBLIC_ENV !== 'local' && env.PUBLIC_ENV !== 'preview';

// Fecha de última modificación por artículo, leída del frontmatter (misma fuente que `contentState`).
const postDates = new Map();
for (const f of existsSync('src/content/blog') ? readdirSync('src/content/blog').filter((n) => n.endsWith('.md')) : []) {
  const fm = readFileSync(`src/content/blog/${f}`, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const data = parseYaml(fm) ?? {};
  const date = data.updatedDate ?? data.pubDate;
  if (date) postDates.set(f.replace(/\.md$/, ''), new Date(date));
}

const latestPostDate = [...postDates].filter(([slug]) => livePaths.has(`/blog/${slug}/`)).map(([, d]) => d).sort((a, b) => b.valueOf() - a.valueOf())[0];

const site = parseSiteUrl(env.PUBLIC_SITE_URL) ?? 'https://loopsgrowth.com';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/privacidad') && !page.includes('/404') && !hiddenPaths.has(new URL(page).pathname) && !page.includes('/marca/hoja'),
      // `lastmod` solo cuando hay una fecha real: `updatedDate` o `pubDate` del artículo, y para el índice del blog la del
      // artículo más reciente. El resto de páginas sale sin `lastmod` (la fecha del build cambiaría cada día sin que cambie nada).
      serialize(item) {
        const path = new URL(item.url).pathname;
        const slug = path.match(/^\/blog\/([^/]+)\/$/)?.[1];
        const date = slug ? postDates.get(slug) : path === '/blog/' ? latestPostDate : undefined;
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
