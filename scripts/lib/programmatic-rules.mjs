// Reglas de calidad del SEO programático por país (milestone SEO, claude-seo:seo-programmatic).
// Módulo puro: recibe páginas ya parseadas y devuelve hallazgos. No lee ni escribe archivos.
// Una página de país solo se publica con contenido único y verdadero: si no lo tiene, no se genera.
import { findInversion, findVoseo } from './copy-rules.mjs';

export const MAX_PAGES = 14; // tope del plan (14 páginas de país y ciudad)
export const MIN_UNIQUE_WARN = 0.4; // meta de contenido único
export const MIN_UNIQUE_BLOCK = 0.3; // por debajo no se publica
export const MIN_WORDS = 300;
export const MIN_SECTIONS = 3;
export const MIN_FACTS = 3;

const PRICE_RE = /(?<![\p{L}\p{N}])(?:usd|us\$|eur|precios?|tarifas?|cuesta[n]?|costos?|presupuestos?|garant[ií]a[s]?|garantizad[oa]s?)(?![\p{L}\p{N}])|\$\s?\d/giu;
const OFFICE_RE = /(?<![\p{L}\p{N}])(?:oficinas?|sede|direcci[oó]n|vis[ií]tanos|presencia\s+(?:f[ií]sica|local)|nuestro\s+equipo\s+en)(?![\p{L}\p{N}])/giu;
const REVIEW_RE = /(?<![\p{L}\p{N}])(?:rese[ñn]as?|opiniones\s+de\s+clientes|testimonios?|estrellas|hemos\s+ayudado|casos?\s+de\s+[eé]xito)(?![\p{L}\p{N}])/giu;
const DASH_RE = /[—–]/g;
const FALTA_RE = /falta\s+confirmar|\[verificar/giu;

const words = (t) => t.toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const shingles = (ws, n = 5) => {
  const out = new Set();
  for (let i = 0; i + n <= ws.length; i++) out.add(ws.slice(i, i + n).join(' '));
  return out;
};

/** Texto visible único de una página (sin plantilla). */
export function pageText(p) {
  return [
    p.h1, p.intro,
    ...p.secciones.flatMap((s) => [s.titulo, s.cuerpo]),
    ...p.hechos.map((h) => h.dato),
    ...(p.faq ?? []).flatMap((f) => [f.pregunta, f.respuesta]),
  ].join('\n');
}

/** Cadenas del código fuente que implican oficina o dirección física: Loops no tiene ninguna (decisión de Ari, 17-nov-2026). */
export const SCHEMA_ADDRESS_RE = /LocalBusiness|PostalAddress|streetAddress|addressLocality|GeoCoordinates|hasMap|ProfessionalService/;

/**
 * Texto prohibido en cualquier página de contenido (país, ciudad, servicio, nosotros, autora, blog):
 * precios, garantía, oficina, reseñas, rayas, marcas de faltante, voseo y cifras de inversión.
 * @param {string} text
 * @returns {{rule:string, detail:string}[]}
 */
export function forbiddenText(text) {
  const out = [];
  for (const [rule, re] of [['PRECIO', PRICE_RE], ['OFICINA', OFFICE_RE], ['RESENA', REVIEW_RE], ['RAYA', DASH_RE], ['FALTA', FALTA_RE]]) {
    re.lastIndex = 0;
    const m = text.match(re);
    if (m) out.push({ rule, detail: `texto prohibido: ${[...new Set(m)].slice(0, 3).join(', ')}` });
  }
  if (findInversion(text).length) out.push({ rule: 'PRECIO', detail: 'cifra de inversión' });
  const v = findVoseo(text);
  if (v.length) out.push({ rule: 'VOSEO', detail: `voseo: ${v[0]}` });
  return out;
}

/**
 * @param {{id:string, draft:boolean, [k:string]:any}[]} pages
 * @param {{servicio_intro:string, cierre_titulo:string, cierre_texto:string}} template
 * @returns {{id:string, rule:string, level:'block'|'warn', detail:string}[]}
 */
export function evaluate(pages, template) {
  const out = [];
  const add = (id, rule, level, detail) => out.push({ id, rule, level, detail });
  const boiler = shingles(words([template.servicio_intro, template.cierre_titulo, template.cierre_texto].join(' ')));
  if (pages.length > MAX_PAGES) add('*', 'MAX', 'block', `${pages.length} páginas; el tope del plan es ${MAX_PAGES}`);

  const sets = pages.map((p) => shingles(words(pageText(p))));
  const slugs = new Set();
  const countries = new Set(pages.filter((p) => p.tipo !== 'ciudad').map((p) => p.id));
  const publishedCountries = new Set(pages.filter((p) => p.tipo !== 'ciudad' && !p.draft).map((p) => p.id));
  pages.forEach((p, i) => {
    if (slugs.has(p.id)) add(p.id, 'SLUG', 'block', 'slug duplicado');
    slugs.add(p.id);
    // Patrón de Ari: país plano, ciudad anidada, sin hub. Una ciudad necesita su país; publicada, el país también publicado.
    if (p.tipo === 'ciudad') {
      if (!p.pais || !p.ciudad) add(p.id, 'CIUDAD', 'block', 'una ciudad necesita `pais` y `ciudad`');
      else if (!countries.has(p.pais)) add(p.id, 'HUERFANA', 'block', `el país padre "${p.pais}" no existe`);
      else if (!p.draft && !publishedCountries.has(p.pais)) add(p.id, 'HUERFANA', 'block', `la ciudad está publicada y el país "${p.pais}" no`);
      if (p.id !== `${p.pais}-${p.ciudad}`) add(p.id, 'SLUG', 'block', `el id de una ciudad es <pais>-<ciudad>: ${p.pais}-${p.ciudad}`);
    }
    // Los borradores solo informan; las páginas publicables bloquean.
    const lvl = p.draft ? 'warn' : 'block';
    const text = pageText(p);
    const wc = words(text).length;
    if ((p.secciones ?? []).length < MIN_SECTIONS) add(p.id, 'SECCIONES', lvl, `${p.secciones.length} secciones; mínimo ${MIN_SECTIONS}`);
    if (p.hechos.length < MIN_FACTS) add(p.id, 'HECHOS', lvl, `${p.hechos.length} hechos con fuente; mínimo ${MIN_FACTS}`);
    if (wc < MIN_WORDS) add(p.id, 'PALABRAS', lvl, `${wc} palabras; mínimo ${MIN_WORDS}`);
    const others = new Set();
    sets.forEach((s, j) => j !== i && s.forEach((x) => others.add(x)));
    const mine = sets[i];
    let unique = 0;
    mine.forEach((s) => { if (!others.has(s) && !boiler.has(s)) unique++; });
    // Texto compartido con la plantilla cuenta como no único: se suman sus palabras al total.
    const tplWords = words(`${template.servicio_intro} ${template.cierre_titulo} ${template.cierre_texto}`).length;
    const ratio = mine.size + tplWords ? unique / (mine.size + tplWords) : 0;
    if (ratio < MIN_UNIQUE_BLOCK) add(p.id, 'UNICO', lvl, `${(ratio * 100).toFixed(0)} % único; bajo ${MIN_UNIQUE_BLOCK * 100} % no se publica`);
    else if (ratio < MIN_UNIQUE_WARN) add(p.id, 'UNICO', 'warn', `${(ratio * 100).toFixed(0)} % único; la meta es ${MIN_UNIQUE_WARN * 100} %`);
    for (const f of forbiddenText(text)) add(p.id, f.rule, 'block', f.detail);
    for (const h of p.hechos) {
      try {
        const u = new URL(h.fuente);
        if (u.protocol !== 'https:') throw new Error('no https');
      } catch { add(p.id, 'FUENTE', 'block', `fuente no válida: ${h.fuente}`); }
    }
    if (!p.draft && !p.reviewedBy) add(p.id, 'REVISION', 'block', 'publicada sin reviewedBy (aprobación de Ari)');
  });
  return out;
}
