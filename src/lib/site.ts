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
