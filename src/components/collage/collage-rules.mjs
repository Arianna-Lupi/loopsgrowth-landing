// Reglas de color y catálogo de piezas del collage pop (DSGN-01).
// ESM plano con JSDoc: lo importan los componentes de Astro y `node --test` sin compilar.
//
// La política de color por tono vive aquí, en una tabla, y `assertToneSafe` la aplica al construir:
// un color prohibido para el tono rompe el build con un mensaje que nombra pieza, tono y color.
// Contrato de marca: sobre dark y purple el contorno es blanco y no hay relleno morado; sobre
// light y yellow el contorno es oscuro; nunca amarillo sobre yellow ni oscuro sobre dark o purple.

import { readFileSync } from 'node:fs';
import { contrastRaw, parseTokens } from '../../../scripts/lib/contrast.mjs';
import { loopyGeometry } from './loopy.mjs';

/** @typedef {'light' | 'yellow' | 'dark' | 'purple'} Tone */
/** @typedef {'yellow' | 'orange' | 'purple' | 'white' | 'dark' | 'cream'} BrandColor */

/** @type {readonly Tone[]} */
export const TONES = Object.freeze(['light', 'yellow', 'dark', 'purple']);

/** @type {readonly BrandColor[]} */
export const BRAND_COLORS = Object.freeze(['yellow', 'orange', 'purple', 'white', 'dark', 'cream']);

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
 * Nota del naranja sobre morado: mide 2.95, está prohibido para texto y UI en `scripts/lib/contrast.mjs`
 * y solo se permite aquí como relleno decorativo con contorno blanco (que es el que define la forma).
 * Este permiso y ese par prohibido se cambian juntos (lo exige `tests/guards/brand-palette.test.mjs`).
 *
 * Rellenos permitidos por tono (los que se ven y cumplen contraste sobre esa superficie).
 * @type {Readonly<Record<Tone, readonly BrandColor[]>>}
 */
export const ALLOWED_FILLS = Object.freeze({
  light: Object.freeze(['yellow', 'white', 'purple', 'orange', 'dark', 'cream']),
  yellow: Object.freeze(['white', 'purple', 'orange', 'dark']),
  dark: Object.freeze(['yellow', 'orange', 'white', 'cream']),
  purple: Object.freeze(['yellow', 'orange', 'white', 'cream']),
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

/**
 * Superficie cuyas reglas valen para lo que se pone sobre un escenario de ese color (el crema y el
 * blanco se leen como superficie clara).
 * @type {Readonly<Record<string, Tone>>}
 */
export const SURFACE_OF_COLOR = Object.freeze({ purple: 'purple', yellow: 'yellow', white: 'light', cream: 'light' });

/**
 * Palabras de las píldoras: lista cerrada. seo, geo y ads salen del copy de Ari; spy y team work
 * salen del moodboard del BrandBook y necesitan el visto bueno de Ari. Cambiarlas es editar aquí.
 * @type {ReadonlyArray<{ word: string, lang: 'es' | 'en', source: 'copy' | 'moodboard' }>}
 */
export const CHIP_WORDS = Object.freeze([
  Object.freeze({ word: 'seo', lang: 'es', source: 'copy' }),
  Object.freeze({ word: 'geo', lang: 'es', source: 'copy' }),
  Object.freeze({ word: 'ads', lang: 'es', source: 'copy' }),
  Object.freeze({ word: 'spy', lang: 'en', source: 'moodboard' }),
  Object.freeze({ word: 'team work', lang: 'en', source: 'moodboard' }),
]);

/** Contraste mínimo del texto de una píldora contra su fondo. */
export const PILL_MIN_RATIO = 4.5;

/**
 * @param {string} word
 * @param {string} [where]
 */
export function assertChipWord(word, where = 'píldora') {
  if (!CHIP_WORDS.some((w) => w.word === word)) {
    throw new Error(`Palabra no permitida en ${where}: "${word}" (lista: ${CHIP_WORDS.map((w) => w.word).join(', ')}).`);
  }
}

/**
 * Valida una píldora: palabra de la lista, fondo permitido sobre el tono, texto distinto del fondo y
 * razón de contraste medida con la calculadora del repo de 4.5 o más.
 * @param {Tone} tone tono del fondo de la sección
 * @param {BrandColor} bg
 * @param {BrandColor} fg
 * @param {string} word
 * @param {string} [where]
 */
export function assertPill(tone, bg, fg, word, where = 'píldora') {
  assertChipWord(word, where);
  assertToneSafe(tone, [bg], `${where} (fondo)`);
  if (bg === fg) throw new Error(`Píldora sin contraste en ${where}: fondo y texto son ${bg}.`);
  const { theme } = parseTokens(readFileSync('src/styles/tokens.css', 'utf8'));
  const hex = (c) => {
    const value = theme[`--color-brand-${c}`];
    if (!value) throw new Error(`Color de marca desconocido "${c}" en ${where}.`);
    return value;
  };
  const ratio = contrastRaw(hex(fg), hex(bg));
  if (ratio < PILL_MIN_RATIO) {
    throw new Error(
      `Píldora ilegible en ${where}: ${fg} sobre ${bg} en tono ${tone} mide ${ratio.toFixed(2)} (mínimo ${PILL_MIN_RATIO}).`,
    );
  }
}

const OJOS = loopyGeometry('ojos').viewBox;
const LUPA = loopyGeometry('lupa').viewBox;

/**
 * Ocho símbolos del sprite nuevo (prefijo lg). Los dos Loopy toman el tamaño del viewBox del arte.
 * @type {Readonly<Record<string, { symbol: string, w: number, h: number, family: 'loopy' | 'doodle' | 'dots' }>>}
 */
export const SCENE_PIECES = Object.freeze({
  ojos: { symbol: 'lg-ojos', w: OJOS[2], h: OJOS[3], family: 'loopy' },
  lupa: { symbol: 'lg-lupa', w: LUPA[2], h: LUPA[3], family: 'loopy' },
  flecha: { symbol: 'lg-flecha', w: 64, h: 48, family: 'doodle' },
  destello: { symbol: 'lg-destello', w: 32, h: 32, family: 'doodle' },
  asterisco: { symbol: 'lg-asterisco', w: 32, h: 32, family: 'doodle' },
  mas: { symbol: 'lg-mas', w: 24, h: 24, family: 'doodle' },
  garabato: { symbol: 'lg-garabato', w: 96, h: 24, family: 'doodle' },
  puntos: { symbol: 'lg-puntos', w: 96, h: 64, family: 'dots' },
});
