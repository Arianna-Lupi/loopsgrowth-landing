import { getCollection, type CollectionEntry } from 'astro:content';
import { isProduction } from './site';

export type Post = CollectionEntry<'blog'>;

/** Autores. Hoy firma y revisa Ari. Sin biografía inventada: solo lo que ya está publicado en el sitio. */
export const AUTHORS = {
  ari: { name: 'Arianna Lupi', role: 'Fundadora de Loops Growth', url: 'https://ariannalupi.com' },
} as const;

/** Artículos visibles: en producción se excluyen los borradores. Más recientes primero. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('blog', (p) => !(isProduction && p.data.draft));
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

const dateFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => dateFmt.format(d);
