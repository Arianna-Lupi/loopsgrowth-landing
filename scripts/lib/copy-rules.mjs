// Reglas de copy reutilizables (COPY-02, FND-02). Módulo puro y de solo lectura: recorre el
// documento ya parseado, nunca lo modifica ni cambia un `status` (el texto de Ari lo aprueba
// una persona). `check-copy.mjs` y `list-pending.mjs` comparten `walkClaims`.

/** Única marca permitida de dato faltante; bloquea producción en el YAML y en `dist`. */
export const MISSING_MARK = 'FALTA CONFIRMAR';

/** Claves permitidas en una reclamación: `text` y `status` más los metadatos `confirm_by` y `reason`. */
export const CLAIM_KEYS = ['text', 'status', 'confirm_by', 'reason'];
const META_KEYS = ['confirm_by', 'reason'];
export const STATUSES = ['verified', 'pending'];

// Lista de PITFALLS.md ampliada con las formas de "vos" más comunes en imperativo y en trato directo.
export const VOSEO_WORDS = [
  'vos', 'tenés', 'querés', 'podés', 'sabés', 'sos', 'hacé', 'agendá', 'escribí', 'contanos',
  'llená', 'descubrí', 'empezá', 'mirá', 'necesitás', 'contactanos', 'escribinos', 'reservá',
  'descargá', 'registrate', 'sumate',
];

// Límites Unicode con lookarounds de largo fijo. `\b` de JavaScript es ASCII: no ve el límite
// tras una vocal acentuada final (agendá, llená, tenés). Alternación simple de palabras: sin
// retroceso catastrófico.
const NOT_WORD_BEFORE = '(?<![\\p{L}\\p{N}_])';
const NOT_WORD_AFTER = '(?![\\p{L}\\p{N}_])';
const VOSEO_RE = new RegExp(`${NOT_WORD_BEFORE}(?:${VOSEO_WORDS.join('|')})${NOT_WORD_AFTER}`, 'giu');
const AEO_RE = new RegExp(`${NOT_WORD_BEFORE}AEO${NOT_WORD_AFTER}`, 'giu');
const VERIFICAR_RE = /\[VERIFICAR\]/gi;
const DASH_RE = /[—–]/g;

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Extracto corto alrededor de una coincidencia, en una sola línea. */
function excerpt(text, index, length) {
  const start = Math.max(0, index - 24);
  const end = Math.min(text.length, index + length + 24);
  const body = text.slice(start, end).replace(/\s+/g, ' ');
  return `${start > 0 ? '...' : ''}${body}${end < text.length ? '...' : ''}`;
}

function matchesOf(re, text) {
  re.lastIndex = 0;
  const out = [];
  for (const m of text.matchAll(re)) out.push(excerpt(text, m.index, m[0].length));
  return out;
}

/** Extractos donde aparece `MISSING_MARK`. Lo reutiliza el modo `--dist`. @param {string} text */
export function findMissingMark(text) {
  const out = [];
  let from = 0;
  for (;;) {
    const i = text.indexOf(MISSING_MARK, from);
    if (i === -1) break;
    out.push(excerpt(text, i, MISSING_MARK.length));
    from = i + MISSING_MARK.length;
  }
  return out;
}

const isClaimObject = (node) => isPlainObject(node) && ('text' in node || 'status' in node);

/**
 * Recorre cada sección bajo las claves de idioma de nivel superior (hoy `es`) y devuelve un
 * nodo por reclamación (`kind: 'claim'`) o por texto suelto (`kind: 'bare'`). La sección
 * `config` de primer nivel no es copy (URL y similares) y se ignora. Los nodos salen en el
 * orden del documento; la ruta con puntos no incluye la clave de idioma (`hero.h1`).
 * @param {unknown} doc
 * @returns {Array<{ path: string, kind: 'claim' | 'bare', lang: string, claim?: Record<string, unknown>, value?: unknown }>}
 */
export function walkClaims(doc) {
  const nodes = [];
  if (!isPlainObject(doc)) return nodes;

  const visit = (node, path, lang) => {
    if (isClaimObject(node)) {
      nodes.push({ path, kind: 'claim', lang, claim: node });
    } else if (isPlainObject(node)) {
      for (const [key, child] of Object.entries(node)) visit(child, path ? `${path}.${key}` : key, lang);
    } else if (Array.isArray(node)) {
      node.forEach((child, i) => visit(child, `${path}[${i}]`, lang));
    } else {
      nodes.push({ path, kind: 'bare', lang, value: node });
    }
  };

  for (const [lang, sections] of Object.entries(doc)) {
    if (!isPlainObject(sections)) {
      nodes.push({ path: lang, kind: 'bare', lang, value: sections });
      continue;
    }
    for (const [section, child] of Object.entries(sections)) {
      if (section === 'config') continue;
      visit(child, section, lang);
    }
  }
  return nodes;
}

const nonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

/**
 * Valida el YAML. `structural` (BARE_STRING, BAD_STATUS, EMPTY_TEXT, BAD_KEY, BAD_META, INVALID_DOC)
 * es el contrato de FND-02 y falla en cualquier entorno. `content` (PENDING, MISSING, VERIFICAR,
 * VOSEO, DASH, AEO) solo bloquea en producción. `confirm_by` y `reason` son metadatos: no se
 * escanean con las reglas de contenido.
 * @param {unknown} doc
 */
export function checkCopy(doc) {
  const structural = [];
  const content = [];
  let verified = 0;
  let pending = 0;

  if (!isPlainObject(doc)) {
    structural.push({ rule: 'INVALID_DOC', path: '', excerpt: 'El documento no es un objeto YAML' });
    return { structural, content, verified, pending };
  }

  for (const node of walkClaims(doc)) {
    if (node.kind === 'bare') {
      structural.push({
        rule: 'BARE_STRING',
        path: node.path,
        excerpt: `Valor fuera de una reclamación {text, status}: ${String(node.value).slice(0, 60)}`,
      });
      continue;
    }

    const { claim, path } = node;
    for (const key of Object.keys(claim)) {
      if (!CLAIM_KEYS.includes(key)) {
        structural.push({ rule: 'BAD_KEY', path, excerpt: `Clave no permitida: ${key}` });
      }
    }
    for (const key of META_KEYS) {
      if (key in claim && !nonEmptyString(claim[key])) {
        structural.push({ rule: 'BAD_META', path, excerpt: `${key} debe ser una cadena no vacía` });
      }
    }
    const statusOk = STATUSES.includes(claim.status);
    if (!statusOk) {
      structural.push({ rule: 'BAD_STATUS', path, excerpt: `status inválido: ${String(claim.status)}` });
    } else if (claim.status === 'verified') {
      verified += 1;
    } else {
      pending += 1;
    }
    if (!nonEmptyString(claim.text)) {
      structural.push({ rule: 'EMPTY_TEXT', path, excerpt: 'text vacío o de solo espacios' });
      continue;
    }

    const text = claim.text;
    if (claim.status === 'pending') {
      content.push({ rule: 'PENDING', path, excerpt: text.length > 60 ? `${text.slice(0, 60)}...` : text });
    }
    for (const ex of findMissingMark(text)) content.push({ rule: 'MISSING', path, excerpt: ex });
    for (const ex of matchesOf(VERIFICAR_RE, text)) content.push({ rule: 'VERIFICAR', path, excerpt: ex });
    for (const ex of matchesOf(VOSEO_RE, text)) content.push({ rule: 'VOSEO', path, excerpt: ex });
    for (const ex of matchesOf(DASH_RE, text)) content.push({ rule: 'DASH', path, excerpt: ex });
    for (const ex of matchesOf(AEO_RE, text)) content.push({ rule: 'AEO', path, excerpt: ex });
  }

  return { structural, content, verified, pending };
}
