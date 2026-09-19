// Reglas de color y catálogo de piezas del collage pop (DSGN-01).
// ESM plano con JSDoc: lo importan los componentes de Astro y `node --test` sin compilar.
//
// La política de color por tono vive aquí, en una tabla, y `assertToneSafe` la aplica al construir:
// un color prohibido para el tono rompe el build con un mensaje que nombra pieza, tono y color.
// Contrato de marca: sobre dark y purple el contorno es blanco y no hay relleno morado; sobre
// light y yellow el contorno es oscuro; nunca amarillo sobre yellow ni oscuro sobre dark o purple.

/** @typedef {'light' | 'yellow' | 'dark' | 'purple'} Tone */
/** @typedef {'yellow' | 'orange' | 'purple' | 'white' | 'dark'} BrandColor */

/** @type {readonly Tone[]} */
export const TONES = Object.freeze(['light', 'yellow', 'dark', 'purple']);

/** @type {readonly BrandColor[]} */
export const BRAND_COLORS = Object.freeze(['yellow', 'orange', 'purple', 'white', 'dark']);

/**
 * Valor CSS de un color de marca. Siempre una variable del token, nunca un valor literal.
 * @param {BrandColor} color
 * @returns {string}
 */
export function fillVar(color) {
  if (!BRAND_COLORS.includes(color)) {
    throw new Error(`Color de marca desconocido: "${color}". Usa uno de: ${BRAND_COLORS.join(', ')}.`);
  }
  return `var(--color-brand-${color})`;
}

/**
 * Rellenos permitidos por tono (los que se ven y cumplen contraste sobre esa superficie).
 * @type {Readonly<Record<Tone, readonly BrandColor[]>>}
 */
export const ALLOWED_FILLS = Object.freeze({
  light: Object.freeze(['yellow', 'white', 'purple', 'orange', 'dark']),
  yellow: Object.freeze(['white', 'purple', 'orange', 'dark']),
  dark: Object.freeze(['yellow', 'orange', 'white']),
  purple: Object.freeze(['yellow', 'orange', 'white']),
});

/**
 * Color del contorno por tono (lo publica `--collage-stroke` en tokens.css).
 * @type {Readonly<Record<Tone, BrandColor>>}
 */
export const STROKE_BY_TONE = Object.freeze({
  light: 'dark',
  yellow: 'dark',
  dark: 'white',
  purple: 'white',
});

/**
 * Catálogo de piezas: id del símbolo en el sprite, tamaño del viewBox y, si aplica, el color fijo
 * de la pieza (los chips llevan el suyo y no aceptan otro).
 * @type {Readonly<Record<string, { symbol: string, w: number, h: number, fixed?: BrandColor }>>}
 */
export const PIECES = Object.freeze({
  lupa: { symbol: 'cs-lupa', w: 240, h: 240 },
  'ojos-izq': { symbol: 'cs-ojos-izq', w: 120, h: 64 },
  'ojos-der': { symbol: 'cs-ojos-der', w: 120, h: 64 },
  'ojos-abajo': { symbol: 'cs-ojos-abajo', w: 120, h: 64 },
  clic: { symbol: 'cs-clic', w: 80, h: 80 },
  loop: { symbol: 'cs-loop', w: 160, h: 160 },
  destello: { symbol: 'cs-destello', w: 24, h: 24 },
  puntos: { symbol: 'cs-puntos', w: 96, h: 72 },
  'sticker-ojos': { symbol: 'cs-sticker-ojos', w: 64, h: 64 },
  'sticker-clic': { symbol: 'cs-sticker-clic', w: 64, h: 64 },
  'sticker-lupa': { symbol: 'cs-sticker-lupa', w: 64, h: 64 },
  'chip-lupa': { symbol: 'cs-chip-lupa', w: 64, h: 64, fixed: 'yellow' },
  'chip-ojos': { symbol: 'cs-chip-ojos', w: 64, h: 64, fixed: 'orange' },
  'chip-loop': { symbol: 'cs-chip-loop', w: 64, h: 64, fixed: 'purple' },
  'chip-clic': { symbol: 'cs-chip-clic', w: 64, h: 64, fixed: 'white' },
});

/**
 * Valida que los colores usados por una pieza estén permitidos sobre el tono. Lanza un Error en
 * español si alguno no lo está. Devuelve el color de contorno esperado para ese tono.
 * @param {Tone} tone
 * @param {ReadonlyArray<BrandColor | undefined | null>} colors colores usados (a, b, c y el fijo)
 * @param {string} [piece] nombre de la pieza, para el mensaje de error
 * @returns {BrandColor}
 */
export function assertToneSafe(tone, colors, piece = 'pieza sin nombre') {
  const allowed = ALLOWED_FILLS[tone];
  if (!allowed) {
    throw new Error(`Tono desconocido "${tone}" en ${piece}. Usa uno de: ${TONES.join(', ')}.`);
  }
  for (const color of colors) {
    if (color == null) continue;
    if (!BRAND_COLORS.includes(color)) {
      throw new Error(`Color de marca desconocido "${color}" en ${piece} sobre ${tone}.`);
    }
    if (!allowed.includes(color)) {
      throw new Error(
        `Color prohibido en ${piece}: "${color}" no se permite sobre el tono ${tone} ` +
          `(permitidos: ${allowed.join(', ')}).`,
      );
    }
  }
  return STROKE_BY_TONE[tone];
}
