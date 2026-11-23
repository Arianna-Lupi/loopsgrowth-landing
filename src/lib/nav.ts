import { getLanding } from './content';
import { getLivePaths } from './paginas';

export interface NavLink {
  label: string;
  href: string;
}

/**
 * Menú principal (hoja de Ari, 17-nov-2026): Servicios, Venezuela, Blog y Nosotros, más la CTA en el header.
 * "Servicios" lleva al único servicio publicado (posicionamiento en IA); los de los meses 2 y 3 se suman cuando
 * existan. Cada enlace aparece solo si su destino existe en este build: en producción un borrador no se genera
 * y un enlace a él sería un 404 (el blog también queda fuera mientras no tenga artículos publicados).
 */
export async function getMainNav(): Promise<NavLink[]> {
  const [{ nav }, live] = await Promise.all([getLanding(), getLivePaths()]);
  const all: NavLink[] = [
    { label: nav.services.text, href: '/servicios/posicionamiento-en-ia/' },
    { label: nav.venezuela.text, href: '/agencia-seo-venezuela/' },
    { label: nav.results.text, href: '/casos/' },
    { label: nav.blog.text, href: '/blog/' },
    { label: nav.about.text, href: '/nosotros/' },
  ];
  return all.filter((l) => live.has(l.href));
}

/** Enlaces del bloque "Explora" del pie: servicio, país, ciudad, nosotros y autora, solo los que existen. */
export async function getFooterExplore(): Promise<NavLink[]> {
  const [{ nav }, live] = await Promise.all([getLanding(), getLivePaths()]);
  const all: NavLink[] = [
    { label: nav.service_ia.text, href: '/servicios/posicionamiento-en-ia/' },
    { label: nav.venezuela_full.text, href: '/agencia-seo-venezuela/' },
    { label: nav.caracas.text, href: '/agencia-seo-venezuela/caracas/' },
    { label: nav.results.text, href: '/casos/' },
    { label: nav.about.text, href: '/nosotros/' },
    { label: nav.author.text, href: '/equipo/arianna-lupi/' },
  ];
  return all.filter((l) => live.has(l.href));
}
