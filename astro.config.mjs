// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

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

// El índice del blog solo entra al sitemap si hay al menos un artículo publicado (`draft: false`).
// Sin eso la página sale `noindex` (src/pages/blog/index.astro) y no debe listarse.
const blogDir = 'src/content/blog';
const hasPublishedPosts =
  existsSync(blogDir) &&
  readdirSync(blogDir).some((f) => f.endsWith('.md') && /^draft:\s*false\s*$/m.test(readFileSync(`${blogDir}/${f}`, 'utf8')));

// Rutas de borradores (`draft: true`): salen `noindex` en cualquier build donde existan (local o preview) y no deben
// entrar al sitemap. En producción no se generan. Países y ciudades: país plano, ciudad anidada.
const draftPaths = new Set();
const yamlEntries = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.yaml')).map((f) => [f.replace(/\.yaml$/, ''), parseYaml(readFileSync(`${dir}/${f}`, 'utf8')) ?? {}]) : [];
for (const [, d] of yamlEntries('src/content/paginas')) {
  if (d.draft === false) continue;
  draftPaths.add(d.ruta);
}
for (const [id, d] of yamlEntries('src/content/paises')) {
  if (d.draft === false) continue;
  draftPaths.add(d.tipo === 'ciudad' ? `/agencia-seo-${d.pais}/${d.ciudad}/` : `/agencia-seo-${id}/`);
}
if (existsSync(blogDir)) {
  for (const f of readdirSync(blogDir).filter((f) => f.endsWith('.md'))) {
    if (!/^draft:\s*false\s*$/m.test(readFileSync(`${blogDir}/${f}`, 'utf8'))) draftPaths.add(`/blog/${f.replace(/\.md$/, '')}/`);
  }
}

const site = parseSiteUrl(env.PUBLIC_SITE_URL) ?? 'https://loopsgrowth.com';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/privacidad') && !draftPaths.has(new URL(page).pathname) && !page.includes('/marca/hoja') && (hasPublishedPosts || !/\/blog\/?$/.test(page)),
    }),
  ],
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
