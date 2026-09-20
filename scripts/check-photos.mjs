// Puerta de producción de las fotos (plan 02-11), corre en prebuild. Con PUBLIC_ENV=production bloquea
// mientras una foto elegida tenga la aprobación de Ari pendiente o exista un raster de una candidata
// no elegida; en otros entornos solo advierte. Una elegida sin fila de licencia bloquea siempre.
// Mismo criterio de entorno que scripts/check-copy.mjs (.env y proceso; solo el valor exacto `production`).
// Uso: node scripts/check-photos.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { loadEnv } from 'vite';
import { closingSteps, evaluatePhotoGate, parseLicenses, validateLicenses } from './lib/photo-licenses.mjs';
import { PHOTOS } from '../src/components/collage/photos.mjs';

const text = readFileSync('src/assets/photos/LICENSES.md', 'utf8');
const rows = parseLicenses(text);
const files = existsSync('src/assets/photos/treated')
  ? readdirSync('src/assets/photos/treated').filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, ''))
  : [];
const env = { ...loadEnv('production', process.cwd(), 'PUBLIC_'), ...process.env }.PUBLIC_ENV ?? 'development';
const invalid = validateLicenses(rows);
const { errors, warnings } = evaluatePhotoGate({ rows, photos: PHOTOS, files, env });
for (const w of warnings) console.warn(`WARN check-photos: ${w}`);
for (const e of [...invalid, ...errors]) console.error(`FAIL check-photos: ${e}`);
const blocked = invalid.length > 0 || errors.length > 0;
if (blocked) {
  console.error(`\nCómo cerrar la elección (src/assets/photos/LICENSES.md):\n${closingSteps(text)}`);
  process.exit(1);
}
console.log(`check-photos: ${PHOTOS.filter((p) => p.chosen).length} foto(s) elegida(s), entorno ${env}${warnings.length ? ` (${warnings.length} aviso(s), bloquearían en production)` : ''}.`);
