// Qué contenido está publicado en un build de producción: `draft: false` y fecha ya cumplida.
// Lo usan el sitemap y el filtro de enlaces del blog (astro.config.mjs). Misma regla que `isPublished` en src/lib/site.ts.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const yamlEntries = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.yaml')).map((f) => [f.replace(/\.yaml$/, ''), parseYaml(readFileSync(`${dir}/${f}`, 'utf8')) ?? {}]) : [];

const mdEntries = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
        const raw = readFileSync(`${dir}/${f}`, 'utf8');
        const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
        return [f.replace(/\.md$/, ''), parseYaml(fm) ?? {}];
      })
    : [];

const due = (date, now) => !date || new Date(date).valueOf() <= now.valueOf();
const published = (d, date, now) => d.draft === false && due(date, now);

/** @param {Date} [now] */
export function contentState(now = new Date()) {
  const live = new Set(['/']);
  const hidden = new Set();
  const add = (path, ok) => (ok ? live : hidden).add(path);
  const paginas = yamlEntries('src/content/paginas');
  for (const [, d] of paginas) add(d.ruta, published(d, d.publishAt, now));
  if (paginas.some(([, d]) => d.tipo === 'servicio' && published(d, d.publishAt, now))) live.add('/servicios/');
  else hidden.add('/servicios/');
  for (const [id, d] of yamlEntries('src/content/paises')) {
    const path = d.tipo === 'ciudad' ? `/agencia-seo-${d.pais}/${d.ciudad}/` : d.familia === 'aeo' ? `/agencia-aeo-${id.replace(/^aeo-/, '')}/` : `/agencia-seo-${id}/`;
    add(path, published(d, d.publishAt, now));
  }
  const posts = mdEntries('src/content/blog');
  for (const [id, d] of posts) add(`/blog/${id}/`, published(d, d.pubDate, now));
  if (posts.some(([, d]) => published(d, d.pubDate, now))) live.add('/blog/');
  else hidden.add('/blog/');
  return { live, hidden };
}

/**
 * Plugin mdast de Sätteri (procesador de Markdown de Astro 7): un enlace interno a una ruta que no existe en este build
 * queda como texto plano. Evita 404 con publicación programada; el cron diario lo reactiva cuando la página sale.
 */
export function liveLinksPlugin(live) {
  return {
    name: 'live-links',
    link(node, ctx) {
      const url = node.url;
      if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) return;
      const path = url.split('#')[0].split('?')[0] || '/';
      if (!live.has(path)) ctx.replaceNode(node, node.children);
    },
  };
}
