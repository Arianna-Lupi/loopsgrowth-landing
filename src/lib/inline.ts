/** Un fragmento de texto, con enlace opcional. */
export type Seg = { text: string; href?: string };

const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g;

/**
 * Convierte `texto [ancla](/ruta/) texto` en fragmentos. Un enlace interno cuyo destino no existe en este build
 * (`live`) queda como texto plano: en producción un borrador no se genera y un enlace a él sería un 404.
 * Nunca emite HTML en bruto.
 */
export function parseInline(text: string, live: Set<string>): Seg[] {
  const out: Seg[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ text: text.slice(last, idx) });
    const href = m[2];
    const ok = href.startsWith('https://') || live.has(href.split('#')[0] || '/');
    out.push(ok ? { text: m[1], href } : { text: m[1] });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
