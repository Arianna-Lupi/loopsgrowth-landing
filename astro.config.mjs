// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

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

const site = parseSiteUrl(env.PUBLIC_SITE_URL) ?? 'https://loopsgrowth.com';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/privacidad') && !page.includes('/marca/hoja'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // El script de #agenda (foco, barra CTA móvil y formulario) pesa ~5 KB: con el umbral por defecto (4 KB)
    // Vite lo sacaría a un .js aparte. Se inlinea en el HTML para no sumar una petición ni un archivo .js.
    build: { assetsInlineLimit: 8192 },
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
