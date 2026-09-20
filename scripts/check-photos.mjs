// Puerta de producción de las fotos (plan 02-11), corre en prebuild. Con PUBLIC_ENV=production bloquea
// mientras una foto elegida tenga la aprobación de Ari pendiente, exista un raster de una candidata
// no elegida o la elección siga abierta; en otros entornos solo advierte. Bloquean siempre (en cualquier
// entorno) el registro o el manifiesto incoherentes: no hay exactamente una elegida por ranura, una elegida
// sin fila, sin derivado o con aprobación de fecha inválida, `Elección: cerrada` con candidatas o pendientes,
// y un sha256 registrado que no coincide con el original que exista en photo-sources/ (ignorado por git:
// en CI y en el hosting no está y esa comprobación se omite).
// Mismo criterio de entorno que scripts/check-copy.mjs (.env y proceso; solo el valor exacto `production`).
// Uso: node scripts/check-photos.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { loadEnv } from 'vite';
import { closingSteps, evaluatePhotoGate, parseElection, parseLicenses, sha256File, validateLicenses } from './lib/photo-licenses.mjs';
import { PHOTOS, PHOTO_SLOT_NAMES } from '../src/components/collage/photos.mjs';

const text = readFileSync('src/assets/photos/LICENSES.md', 'utf8');
const rows = parseLicenses(text);
const files = existsSync('src/assets/photos/treated')
  ? readdirSync('src/assets/photos/treated').filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, ''))
  : [];
// sha256 de los originales que existan en photo-sources/ (id -> hash); el registro guarda el hash del original.
const originals = {};
for (const photo of PHOTOS) {
  const source = ['jpg', 'jpeg', 'png', 'webp'].map((e) => `photo-sources/${photo.id}.${e}`).find((p) => existsSync(p));
  if (source) originals[photo.id] = sha256File(source);
}
const env = { ...loadEnv('production', process.cwd(), 'PUBLIC_'), ...process.env }.PUBLIC_ENV ?? 'development';
const invalid = validateLicenses(rows);
const { errors, warnings } = evaluatePhotoGate({
  rows,
  photos: PHOTOS,
  files,
  env,
  slots: PHOTO_SLOT_NAMES,
  election: parseElection(text),
  originals,
});
for (const w of warnings) console.warn(`WARN check-photos: ${w}`);
for (const e of new Set([...invalid, ...errors])) console.error(`FAIL check-photos: ${e}`);
const blocked = invalid.length > 0 || errors.length > 0;
if (blocked) {
  console.error(`\nCómo cerrar la elección (src/assets/photos/LICENSES.md):\n${closingSteps(text)}`);
  process.exit(1);
}
console.log(`check-photos: ${PHOTOS.filter((p) => p.chosen).length} foto(s) elegida(s), entorno ${env}${warnings.length ? ` (${warnings.length} aviso(s), bloquearían en production)` : ''}; sha256 de ${Object.keys(originals).length} de ${PHOTOS.length} original(es) comprobado(s) en photo-sources/.`);
