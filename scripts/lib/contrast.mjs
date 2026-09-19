// Calculadora de contraste WCAG 2.x y parseo de tokens.css (FND-03). Módulo puro, sin dependencias.

/** @param {string} hex */
export function hexToRgb(hex) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Color hex inválido: "${hex}"`);
  let h = m[1];
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** Luminancia relativa de WCAG 2.x. @param {string} hex */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razón de contraste con dos decimales. @param {string} a @param {string} b */
export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

function parseDeclarations(body) {
  const out = {};
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);?/g)) out[m[1]] = m[2].trim();
  return out;
}

function resolve(value, scopes, depth = 0) {
  const m = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value);
  if (!m) return value;
  if (depth > 3) return value;
  for (const scope of scopes) {
    if (m[1] in scope) return resolve(scope[m[1]], scopes, depth + 1);
  }
  return value;
}

/**
 * Lee `tokens.css`. Devuelve las variables de `@theme` (también `@theme static`) y,
 * por cada `[data-tone="x"]`, sus variables con `var(--x)` resueltas hasta dos niveles.
 * Solo los bloques `@theme` y los que nombran un `data-tone` cuentan: un `:root` suelto
 * (por ejemplo el de movimiento reducido) nunca se toma por un tono.
 * @param {string} cssText
 * @returns {{ theme: Record<string, string>, tones: Record<string, Record<string, string>> }}
 */
export function parseTokens(cssText) {
  const css = stripComments(cssText);
  /** @type {Record<string, string>} */
  const theme = {};
  /** @type {Record<string, Record<string, string>>} */
  const rawTones = {};
  for (const block of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = block[1].trim();
    const decls = parseDeclarations(block[2]);
    if (/^@theme\b/.test(selector)) {
      Object.assign(theme, decls);
      continue;
    }
    for (const t of selector.matchAll(/\[data-tone\s*=\s*"([^"]+)"\]/g)) {
      rawTones[t[1]] = { ...(rawTones[t[1]] ?? {}), ...decls };
    }
  }
  /** @type {Record<string, Record<string, string>>} */
  const tones = {};
  for (const [name, decls] of Object.entries(rawTones)) {
    tones[name] = {};
    for (const [prop, value] of Object.entries(decls)) {
      tones[name][prop] = resolve(value, [decls, theme]);
    }
  }
  return { theme, tones };
}

const P = '--color-brand-purple';
const O = '--color-brand-orange';
const Y = '--color-brand-yellow';
const D = '--color-brand-dark';
const W = '--color-brand-white';

/**
 * Los 9 pares aprobados de UI-SPEC, por nombre de token. `min` es el umbral (4.5 en texto,
 * 3 en UI o texto grande) y `ratio` el valor medido que el CSS debe seguir produciendo.
 */
export const APPROVED_PAIRS = [
  { fg: D, bg: W, ratio: 16.1, min: 4.5, use: 'Cuerpo, h1, wordmark' },
  { fg: P, bg: W, ratio: 9.69, min: 3, use: 'Anillo de foco sobre claro' },
  { fg: W, bg: P, ratio: 9.69, min: 4.5, use: 'h2, intro y enlace de respaldo sobre morado' },
  { fg: Y, bg: P, ratio: 6.15, min: 4.5, use: 'Anillo de foco y hover de enlace sobre morado' },
  { fg: D, bg: Y, ratio: 10.22, min: 4.5, use: 'Texto del CTA sobre amarillo' },
  { fg: D, bg: O, ratio: 5.56, min: 4.5, use: 'Texto del CTA sobre naranja' },
  { fg: Y, bg: D, ratio: 10.22, min: 4.5, use: 'Texto del skip link' },
  { fg: O, bg: D, ratio: 5.56, min: 4.5, use: 'Naranja como texto solo sobre oscuro' },
  { fg: O, bg: P, ratio: 3.35, min: 3, use: 'Solo texto grande, íconos o bordes de UI' },
];

/**
 * Los 6 pares prohibidos. Fixtures negativos: la calculadora debe medirlos por debajo de
 * `min` (3, el umbral más bajo de todos) y ninguno puede declararse en un tono.
 */
export const FORBIDDEN_PAIRS = [
  { fg: W, bg: O, ratio: 2.89, min: 3, why: 'Nunca texto blanco en un botón naranja' },
  { fg: O, bg: W, ratio: 2.89, min: 3, why: 'Naranja como texto o borde de UI sobre claro' },
  { fg: Y, bg: W, ratio: 1.58, min: 3, why: 'Amarillo solo como relleno con texto oscuro' },
  { fg: W, bg: Y, ratio: 1.58, min: 3, why: 'Blanco sobre amarillo' },
  { fg: P, bg: D, ratio: 1.66, min: 3, why: 'El morado no va sobre fondo oscuro' },
  { fg: O, bg: Y, ratio: 1.84, min: 3, why: 'Ni texto ni par de foco' },
];

/** Pares semánticos que cada tono debe cumplir: [texto, fondo, umbral, uso]. */
export const TONE_PAIRS = [
  ['--on-surface', '--surface', 4.5, 'texto sobre la superficie'],
  ['--link', '--surface', 4.5, 'enlace sobre la superficie'],
  ['--on-cta', '--cta-bg', 4.5, 'texto del CTA sobre su relleno'],
  ['--on-cta', '--cta-bg-hover', 4.5, 'texto del CTA sobre su relleno en hover'],
  ['--focus-ring', '--surface', 3, 'anillo de foco sobre la superficie'],
];
