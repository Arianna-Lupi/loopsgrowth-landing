const rawEnv = import.meta.env.PUBLIC_ENV;
const rawSiteUrl = (import.meta.env.PUBLIC_SITE_URL ?? '').trim();

export const isProduction: boolean = rawEnv !== 'local' && rawEnv !== 'preview';

function parseSiteUrl(value: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** URL absoluta http o https del sitio. */
export const siteUrl: string = parseSiteUrl(rawSiteUrl) ?? 'https://loopsgrowth.com';

/** URL canónica absoluta de una ruta. */
export function canonicalUrl(path: string): string {
  return new URL(path, siteUrl).href;
}

/** Clave pública (sitekey) del widget de Turnstile del formulario de leads. El secreto vive solo en el Worker. */
export const TURNSTILE_SITEKEY = '0x4AAAAAAF9E3GqQCLZLgBIL';

/**
 * Publicación programada. En producción una entrada se publica solo si `draft` es false y su fecha
 * (`publishAt` en servicios y países, `pubDate` en artículos) ya llegó. Fuera de producción se ve todo.
 * Un cron diario reconstruye el sitio, así que una fecha futura se activa sola ese día.
 */
export function isPublished(draft: boolean, date?: Date | null, now: Date = new Date()): boolean {
  if (!isProduction) return true;
  if (draft) return false;
  return !date || date.valueOf() <= now.valueOf();
}
