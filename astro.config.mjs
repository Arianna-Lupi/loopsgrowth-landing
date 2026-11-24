// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
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

const site = parseSiteUrl(env.PUBLIC_SITE_URL) ?? 'https://loopsgrowth.com';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/privacidad') && !hiddenPaths.has(new URL(page).pathname) && !page.includes('/marca/hoja'),
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
