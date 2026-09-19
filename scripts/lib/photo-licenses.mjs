// Registro de licencias de las fotos (plan 02-11): lectura y validación de
// src/assets/photos/LICENSES.md y puerta de producción. Sin dependencias.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/** Nombre de la licencia y su URL canónica. */
export const LICENSE_NAMES = Object.freeze({
  'Unsplash License': 'https://unsplash.com/license',
  'Pexels License': 'https://www.pexels.com/license/',
  'Pixabay Content License': 'https://pixabay.com/service/license-summary/',
});

const COLUMNS = ['id', 'derived', 'source', 'author', 'license', 'licenseUrl', 'downloaded', 'dimensions', 'sha256', 'approval', 'note'];
const APPROVAL = /^(pendiente|aprobada por .+ el \d{4}-\d{2}-\d{2})$/;
const DASH = /[\u2013\u2014]/;

const section = (text, heading) => {
  const m = new RegExp(`^## ${heading}\\s*$`, 'm').exec(text);
  if (!m) return '';
  const rest = text.slice(m.index + m[0].length);
  const next = /^## /m.exec(rest);
  return next ? rest.slice(0, next.index) : rest;
};

/** Filas de la tabla "Registro" (11 columnas). */
export function parseLicenses(text) {
  return section(text, 'Registro')
    .split('\n')
    .filter((line) => line.trim().startsWith('|'))
    .map((line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .filter((cells) => cells.length === COLUMNS.length && !/^-+$/.test(cells[0].replace(/[:\s]/g, '')) && cells[0] !== 'id')
    .map((cells) => {
      const row = Object.fromEntries(COLUMNS.map((c, i) => [c, cells[i]]));
      row.id = row.id.replace(/`/g, '');
      row.derived = row.derived.replace(/`/g, '');
      return row;
    });
}

/** Errores en español, uno por campo mal formado; lista vacía si todo está bien. */
export function validateLicenses(rows) {
  const errors = [];
  for (const row of rows) {
    const bad = (field, why) => errors.push(`Foto "${row.id}", campo "${field}": ${why}.`);
    if (!/^https:\/\/\S+$/.test(row.source ?? '')) bad('source', 'la URL de la fuente debe ser https');
    if (!(row.author ?? '').trim()) bad('author', 'el autor no puede estar vacío');
    if (!(row.license in LICENSE_NAMES)) bad('license', `debe ser una de: ${Object.keys(LICENSE_NAMES).join(', ')}`);
    else if (row.licenseUrl !== LICENSE_NAMES[row.license]) bad('licenseUrl', `debe ser la canónica ${LICENSE_NAMES[row.license]}`);
    else if (!row.licenseUrl) bad('licenseUrl', 'falta');
    if (row.license in LICENSE_NAMES === false && row.licenseUrl && !Object.values(LICENSE_NAMES).includes(row.licenseUrl)) bad('licenseUrl', 'no es una URL canónica');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.downloaded ?? '')) bad('downloaded', 'debe tener la forma AAAA-MM-DD');
    if (!/^\d+x\d+$/.test(row.dimensions ?? '')) bad('dimensions', 'debe tener la forma ANCHOxALTO');
    if (!/^[0-9a-f]{64}$/.test(row.sha256 ?? '')) bad('sha256', 'debe medir 64 hexadecimales');
    if (!APPROVAL.test(row.approval ?? '')) bad('approval', 'debe ser "pendiente" o "aprobada por <nombre> el AAAA-MM-DD"');
    for (const field of COLUMNS) if (DASH.test(row[field] ?? '')) bad(field, 'no se admiten guiones largos ni cortos');
  }
  return errors;
}

/** `abierta` o `cerrada` según la línea `Elección: ...` (nulo si falta). */
export function parseElection(text) {
  return /^Elección:\s*(abierta|cerrada)\s*$/m.exec(text)?.[1] ?? null;
}

/** Subsecciones de "Licencias verificadas": nombre, URL, fecha y cita literal. */
export function parseLicenseSections(text) {
  const body = section(text, 'Licencias verificadas');
  return body
    .split(/^### /m)
    .slice(1)
    .map((chunk) => {
      const [head, ...rest] = chunk.split('\n');
      const lines = rest.join('\n');
      return {
        name: head.trim(),
        url: /^URL:\s*(\S+)/m.exec(lines)?.[1] ?? '',
        date: /^Leída el:\s*(\S+)/m.exec(lines)?.[1] ?? '',
        quote: lines.split('\n').filter((l) => l.startsWith('>')).map((l) => l.replace(/^>\s?/, '')).join(' ').trim(),
      };
    });
}

/** sha256 de un archivo. */
export function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

/**
 * Puerta de producción. En `production` bloquea una foto elegida con aprobación pendiente y cualquier
 * raster de una candidata no elegida (un import sin uso hace que Astro emita el original en dist);
 * en otros entornos solo advierte.
 */
export function evaluatePhotoGate({ rows, photos, files, env }) {
  const problems = [];
  for (const photo of photos.filter((p) => p.chosen)) {
    const row = rows.find((r) => r.id === photo.id);
    if (!row || row.approval === 'pendiente') problems.push(`La foto elegida "${photo.id}" tiene la aprobación de Ari pendiente.`);
  }
  const chosenIds = new Set(photos.filter((p) => p.chosen).map((p) => p.id));
  for (const id of files) if (!chosenIds.has(id)) problems.push(`Existe el raster de la candidata "${id}" y no está elegida (Astro lo emitiría en dist).`);
  return env === 'production' ? { errors: problems, warnings: [] } : { errors: [], warnings: problems };
}
