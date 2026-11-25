import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// La CSP de public/_headers solo permite los scripts en línea por su huella: si uno cambia y la cabecera no, el
// navegador lo bloquea en producción sin que ninguna otra prueba lo note.
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const csp = readFileSync('public/_headers', 'utf8').match(/Content-Security-Policy: (.+)/)?.[1] ?? '';
const scriptSrc = csp.match(/script-src ([^;]+)/)?.[1] ?? '';

test('la CSP limita el origen por defecto y no abre los scripts en línea', () => {
  assert.match(csp, /default-src 'self'/);
  assert.ok(scriptSrc.length > 0);
  assert.ok(!scriptSrc.includes("'unsafe-inline'") && !scriptSrc.includes("'unsafe-eval'"));
});

test('cada script en línea de dist está permitido por su huella', { skip: !existsSync('dist/index.html') }, () => {
  const missing = [];
  for (const file of walk('dist').filter((f) => f.endsWith('.html'))) {
    for (const [, attrs, body] of readFileSync(file, 'utf8').matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (/\ssrc=|ld\+json/.test(attrs) || !body.trim()) continue;
      const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
      if (!scriptSrc.includes(hash)) missing.push(`${file}: ${hash}`);
    }
  }
  assert.deepEqual(missing, []);
});
