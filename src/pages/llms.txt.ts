/**
 * `/llms.txt`: índice en Markdown de las páginas publicadas, generado del mismo contenido que el sitio, así nunca
 * anuncia un borrador ni una fecha futura. Es opcional: Google no lo usa para sus funciones de IA.
 */
import type { APIRoute } from 'astro';
import { getPaginas, paisPath } from '../lib/paginas';
import { getPaises } from '../lib/paises';
import { getPosts } from '../lib/blog';
import { siteUrl } from '../lib/site';

export const GET: APIRoute = async () => {
  const base = siteUrl.replace(/\/+$/, '');
  const [paginas, paises, posts] = await Promise.all([getPaginas(), getPaises(), getPosts()]);
  const item = (titulo: string, path: string, descripcion: string) => `- [${titulo}](${base}${path}): ${descripcion}`;
  const bloque = (titulo: string, items: string[]) => (items.length ? ['', `## ${titulo}`, '', ...items] : []);
  const deTipo = (tipo: string) => paginas.filter((p) => p.data.tipo === tipo).map((p) => item(p.data.title, p.data.ruta, p.data.description));
  const lines = [
    '# Loops Growth',
    '',
    '> Agencia SEO para LATAM: SEO y posicionamiento en asistentes de IA, en español y con trabajo remoto.',
    ...bloque('Servicios', deTipo('servicio')),
    ...bloque('Países y ciudades', paises.map((p) => item(p.data.title, paisPath(p), p.data.description))),
    ...bloque('Artículos', posts.map((p) => item(p.data.title, `/blog/${p.id}/`, p.data.description))),
    ...bloque('Equipo', [...deTipo('nosotros'), ...deTipo('autora')]),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
