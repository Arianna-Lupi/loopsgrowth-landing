import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './site';
import { getPaises, type Pais } from './paises';
import { getPosts } from './blog';

export type Pagina = CollectionEntry<'paginas'>;

/** Páginas de servicio, nosotros y autora visibles: en producción solo las publicadas (`draft: false`). */
export async function getPaginas(): Promise<Pagina[]> {
  return getCollection('paginas', (p) => isPublished(p.data.draft, p.data.publishAt));
}

/** Ruta pública de un país (`/agencia-seo-venezuela/`) o de una ciudad (`/agencia-seo-venezuela/caracas/`). */
export function paisPath(p: Pais): string {
  if (p.data.tipo === 'ciudad') return `/agencia-seo-${p.data.pais}/${p.data.ciudad}/`;
  return p.data.familia === 'aeo' ? `/agencia-aeo-${p.id.replace(/^aeo-/, '')}/` : `/agencia-seo-${p.id}/`;
}

/**
 * Rutas internas que existen en este build. Menú, pie y enlaces contextuales solo apuntan a una ruta de
 * este conjunto: en producción un borrador no se genera, y un enlace a él sería un 404.
 */
export async function getLivePaths(): Promise<Set<string>> {
  const [paginas, paises, posts] = await Promise.all([getPaginas(), getPaises(), getPosts()]);
  const paths = new Set<string>(['/']);
  for (const p of paginas) paths.add(p.data.ruta);
  for (const p of paises) paths.add(paisPath(p));
  if (posts.length > 0) paths.add('/blog/');
  if (paginas.some((p) => p.data.tipo === 'servicio')) paths.add('/servicios/');
  return paths;
}

/** Ruta de un servicio por id de archivo. */
export const servicioPath = (id: string) => `/servicios/${id}/`;

/** Destinos que se enlazan entre sí con la palabra clave como anchor (estrategia de enlazado interno de Ari). */
export const LINK_TARGETS = {
  servicio: { href: '/servicios/posicionamiento-en-ia/', label: 'posicionamiento en IA', texto: 'Conoce el servicio de' },
  venezuela: { href: '/agencia-seo-venezuela/', label: 'agencia SEO en Venezuela', texto: 'Mira cómo trabajamos como' },
  caracas: { href: '/agencia-seo-venezuela/caracas/', label: 'agencia SEO en Caracas', texto: 'Si estás en Caracas, revisa la' },
  autora: { href: '/equipo/arianna-lupi/', label: 'Arianna Lupi', texto: 'Conoce a la autora de este contenido:' },
  nosotros: { href: '/nosotros/', label: 'el equipo de Loops Growth', texto: 'Conoce a' },
} as const;

export type LinkKey = keyof typeof LINK_TARGETS;

/** Enlaces relacionados cuyo destino existe en este build. */
export async function relatedLinks(keys: LinkKey[]) {
  const live = await getLivePaths();
  return keys.map((k) => LINK_TARGETS[k]).filter((t) => live.has(t.href));
}
