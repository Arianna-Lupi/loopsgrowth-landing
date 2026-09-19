/**
 * Limpieza de una mesa del `.ai` de Ari convertida a SVG con `pdftocairo` (plan 02-09, tarea 2).
 *
 * Es una función pura, sin acceso a disco ni a procesos, para poder probarla con cadenas. Lo que
 * hace: quita la declaración XML, todos los `<rect>` (fondo de la mesa; la mesa 24 trae tres),
 * `width`, `height` y `xmlns:xlink` de la raíz, y pasa cada `fill="rgb(p%, p%, p%)"` a hex en
 * minúsculas. Un color que difiere en 2 canales o menos de uno oficial se ajusta a ese (el crema de
 * algunas mesas sale de Illustrator como #f4f3e1); uno más lejano lanza, porque una mesa con un
 * color ajeno a la marca no debe entrar al repositorio. SVGO y la medición del `viewBox` los hace
 * `scripts/brand/extract-artboards.mjs`.
 */

/** Colores oficiales del brandbook más iris y pupila de los ojos, en hex minúsculas. */
export const OFFICIAL_COLORS = {
  purple: '#4228d1',
  cream: '#f4f3e0',
  orange: '#fd6938',
  yellow: '#ffc602',
  dark: '#212121',
  iris: '#6c61db',
  pupil: '#1e1e1e',
};

const OFFICIAL_LIST = Object.values(OFFICIAL_COLORS);
const SNAP_TOLERANCE = 2;

/** @param {string} hex @returns {number[]} */
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/**
 * `rgb(25.898743%, 15.699768%, 81.999207%)` a `#4228d1`, con `Math.round(p * 255 / 100)` por canal.
 * @param {string} value
 * @returns {string | null} null si el valor no tiene forma de porcentaje
 */
export function rgbPercentToHex(value) {
  const m = value.match(/^rgb\(\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/);
  if (!m) return null;
  const hex = [m[1], m[2], m[3]]
    .map((p) => Math.round((Number(p) * 255) / 100).toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
}

/**
 * Ajusta un hex al color oficial más cercano si cada canal difiere en 2 o menos.
 * @param {string} hex
 * @returns {string | null} el oficial, o null si ninguno está dentro de la tolerancia
 */
export function snapToOfficial(hex) {
  const own = channels(hex);
  return (
    OFFICIAL_LIST.find((official) => channels(official).every((c, i) => Math.abs(c - own[i]) <= SNAP_TOLERANCE)) ?? null
  );
}

/**
 * Deja la mesa lista para SVGO: sin fondo, sin dimensiones y con rellenos oficiales en hex.
 * @param {string} svgText SVG que produjo `pdftocairo -svg`
 * @param {number} mesa número de mesa, solo para los mensajes
 * @returns {string}
 */
export function cleanArtboard(svgText, mesa) {
  let out = svgText.replace(/<\?xml[^>]*\?>\s*/g, '');
  out = out.replace(/<rect\b[^>]*?(?:\/>|>\s*<\/rect>)/g, '');
  out = out.replace(/<svg\b[^>]*>/, (root) =>
    root.replace(/\s(?:width|height)="[^"]*"/g, '').replace(/\sxmlns:xlink="[^"]*"/g, ''),
  );
  if (/\sstroke=/.test(out)) throw new Error(`mesa ${mesa}: trae stroke; las mesas oficiales son solo rellenos.`);
  out = out.replace(/\sfill="([^"]*)"/g, (whole, value) => {
    const hex = value.startsWith('#') ? value.toLowerCase() : rgbPercentToHex(value);
    const official = hex && snapToOfficial(hex);
    if (!official) {
      throw new Error(`mesa ${mesa}: el color ${hex ?? value} está fuera de la paleta oficial (${OFFICIAL_LIST.join(', ')}).`);
    }
    return ` fill="${official}"`;
  });
  return out;
}
