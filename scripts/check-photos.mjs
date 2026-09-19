// Puerta de producción de las fotos (plan 02-11), corre en prebuild. Con PUBLIC_ENV=production bloquea
// mientras una foto elegida tenga la aprobación de Ari pendiente o exista un raster de una candidata
// no elegida; en otros entornos solo advierte. Uso: node scripts/check-photos.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { evaluatePhotoGate, parseLicenses, validateLicenses } from './lib/photo-licenses.mjs';
import { PHOTOS } from '../src/components/collage/photos.mjs';

const text = readFileSync('src/assets/photos/LICENSES.md', 'utf8');
const rows = parseLicenses(text);
const files = existsSync('src/assets/photos/treated')
  ? readdirSync('src/assets/photos/treated').filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, ''))
  : [];
const env = process.env.PUBLIC_ENV ?? 'development';
const invalid = validateLicenses(rows);
const { errors, warnings } = evaluatePhotoGate({ rows, photos: PHOTOS, files, env });
for (const w of warnings) console.warn(`check-photos (aviso): ${w}`);
for (const e of [...invalid, ...errors]) console.error(`check-photos: ${e}`);
if (invalid.length || errors.length) process.exit(1);
console.log(`check-photos: ${PHOTOS.filter((p) => p.chosen).length} foto(s) elegida(s), entorno ${env}.`);
