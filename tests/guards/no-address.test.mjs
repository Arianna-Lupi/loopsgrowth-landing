import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SCHEMA_ADDRESS_RE } from '../../scripts/lib/programmatic-rules.mjs';

// Loops no tiene oficina ni dirección (decisión de Ari, 17-nov-2026): ningún LocalBusiness, address ni mapa.
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('el código de src/ no emite LocalBusiness, address ni mapas', () => {
  const hits = walk('src')
    .filter((f) => /\.(astro|ts|mjs|json)$/.test(f))
    .filter((f) => SCHEMA_ADDRESS_RE.test(strip(readFileSync(f, 'utf8'))));
  assert.deepEqual(hits, []);
});
test('la expresión detecta los tipos prohibidos', () => {
  for (const s of ['"LocalBusiness"', 'streetAddress', 'PostalAddress', 'hasMap', 'ProfessionalService']) assert.ok(SCHEMA_ADDRESS_RE.test(s), s);
});
