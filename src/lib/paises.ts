import { getCollection, type CollectionEntry } from 'astro:content';
import { isProduction } from './site';
import template from './pais-template.json';

export type Pais = CollectionEntry<'pais'>;
export const PAIS_TEMPLATE = template;

/** Países visibles: en producción solo los publicados (`draft: false`). */
export async function getPaises(): Promise<Pais[]> {
  const all = await getCollection('pais', (p) => !(isProduction && p.data.draft));
  return all.sort((a, b) => a.data.nombre.localeCompare(b.data.nombre, 'es'));
}
