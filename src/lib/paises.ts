import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './site';
import template from './pais-template.json';

export type Pais = CollectionEntry<'pais'>;
export type PaisTipo = Pais['data']['tipo'];
export const PAIS_TEMPLATE = template;

/** Países visibles: en producción solo los publicados (`draft: false`). */
export async function getPaises(): Promise<Pais[]> {
  const all = await getCollection('pais', (p) => isPublished(p.data.draft, p.data.publishAt));
  return all.sort((a, b) => a.data.nombre.localeCompare(b.data.nombre, 'es'));
}
