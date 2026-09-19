import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  ALLOWED_FILLS,
  BRAND_COLORS,
  PIECES,
  TONES,
  assertToneSafe,
  fillVar,
} from '../../src/components/collage/collage-rules.mjs';

// ---------------------------------------------------------------------------------------------
// (i) Política de color por tono, escrita aparte de la tabla que protege.
// ---------------------------------------------------------------------------------------------

// Pares (tono, color) que el contrato de marca prohíbe. Se listan a mano y no salen de la tabla.
const FORBIDDEN = [
  ['dark', 'purple'],
  ['purple', 'purple'],
  ['yellow', 'yellow'],
  ['dark', 'dark'],
  ['purple', 'dark'],
];

const EXPECTED_STROKE = { light: 'dark', yellow: 'dark', dark: 'white', purple: 'white' };

/** Devuelve los pares prohibidos que una tabla de rellenos deja pasar. */
function violations(table) {
  return FORBIDDEN.filter(([tone, color]) => (table[tone] ?? []).includes(color));
}

test('ninguno de los pares prohibidos está en ALLOWED_FILLS', () => {
  assert.deepEqual(violations(ALLOWED_FILLS), []);
});

test('assertToneSafe lanza en cada par prohibido y nombra pieza, tono y color', () => {
  for (const [tone, color] of FORBIDDEN) {
    assert.throws(
      () => assertToneSafe(tone, [color], 'pieza-de-prueba'),
      (error) =>
        error instanceof Error &&
        error.message.includes('pieza-de-prueba') &&
        error.message.includes(tone) &&
        error.message.includes(color),
      `${color} sobre ${tone} debería fallar`,
    );
  }
});

test('assertToneSafe acepta los rellenos permitidos y devuelve el contorno del tono', () => {
  for (const tone of TONES) {
    for (const color of ALLOWED_FILLS[tone]) {
      assert.equal(assertToneSafe(tone, [color], 'p'), EXPECTED_STROKE[tone], `${color} sobre ${tone}`);
    }
    // colores ausentes se ignoran
    assert.equal(assertToneSafe(tone, [undefined, null], 'p'), EXPECTED_STROKE[tone]);
  }
});

test('assertToneSafe rechaza un tono o un color desconocido', () => {
  assert.throws(() => assertToneSafe('neon', ['white'], 'p'), /Tono desconocido/);
  assert.throws(() => assertToneSafe('light', ['rosa'], 'p'), /Color de marca desconocido/);
  assert.throws(() => fillVar('rosa'), /Color de marca desconocido/);
});

test('los colores fijos de los chips respetan la política donde se pueden usar', () => {
  for (const [name, piece] of Object.entries(PIECES)) {
    if (!piece.fixed) continue;
    assert.ok(BRAND_COLORS.includes(piece.fixed), `${name}: color fijo válido`);
  }
  // chip-loop es morado: nunca sobre dark ni purple; chip-lupa es amarillo: nunca sobre yellow.
  assert.throws(() => assertToneSafe('dark', [PIECES['chip-loop'].fixed], 'chip-loop'));
  assert.throws(() => assertToneSafe('yellow', [PIECES['chip-lupa'].fixed], 'chip-lupa'));
});

// (ii) Mutación: la comprobación no es vacía; una tabla con un par prohibido se detecta.
test('mutación: una tabla con un par prohibido agregado es detectada', () => {
  for (const [tone, color] of FORBIDDEN) {
    const mutated = Object.fromEntries(TONES.map((t) => [t, [...ALLOWED_FILLS[t]]]));
    mutated[tone].push(color);
    assert.deepEqual(violations(mutated), [[tone, color]], `${color} sobre ${tone}`);
  }
});

// ---------------------------------------------------------------------------------------------
// (iii) Símbolos del sprite y catálogo de piezas
// ---------------------------------------------------------------------------------------------

const SPRITE = readFileSync('src/components/collage/CollageSprite.astro', 'utf8');

test('cada símbolo del sprite está en PIECES exactamente una vez, con su viewBox, y viceversa', () => {
  const symbols = [...SPRITE.matchAll(/<symbol id="([^"]+)" viewBox="0 0 (\d+) (\d+)"/g)].map((m) => ({
    id: m[1],
    w: Number(m[2]),
    h: Number(m[3]),
  }));
  const ids = symbols.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'ids duplicados en el sprite');
  assert.equal(symbols.length, 15);
  const fromPieces = Object.values(PIECES).map((p) => p.symbol);
  assert.equal(new Set(fromPieces).size, fromPieces.length, 'símbolos repetidos en PIECES');
  assert.deepEqual([...ids].sort(), [...fromPieces].sort());
  for (const piece of Object.values(PIECES)) {
    const symbol = symbols.find((s) => s.id === piece.symbol);
    assert.equal(symbol.w, piece.w, `${piece.symbol}: ancho del viewBox`);
    assert.equal(symbol.h, piece.h, `${piece.symbol}: alto del viewBox`);
  }
});

// ---------------------------------------------------------------------------------------------
// (iv) Fuentes propias: sin construcciones prohibidas
// ---------------------------------------------------------------------------------------------

// Lista explícita de archivos de este plan. No se barre el directorio: la composición del hero
// (HeroCollage.astro) es de otro plan y trae sus propias reglas.
export const OWNED = [
  'src/components/collage/CollageSprite.astro',
  'src/components/collage/CollagePiece.astro',
  'src/components/collage/collage-rules.mjs',
  'src/components/brand/Logo.astro',
];

// La tarea de composiciones agrega estos dos cuando existen.
for (const extra of ['src/components/collage/AgendaCollage.astro', 'src/components/collage/Avatar.astro']) {
  if (existsSync(extra)) OWNED.push(extra);
}

const RULES = [
  { id: 'hex', re: /#[0-9a-fA-F]{3}(?![0-9a-zA-Z_-])|#[0-9a-fA-F]{6}(?![0-9a-zA-Z_-])/, bad: 'fill="#abc123"' },
  { id: 'html-crudo', re: /set:html/, bad: '<div set:html={x}></div>' },
  { id: 'animaciones', re: /@keyframes|animation|transition/, bad: '.a { transition: fill 1s; }' },
  { id: 'smil', re: /<animate|<set[\s>]/, bad: '<animateTransform />' },
  { id: 'degradados', re: /Gradient/, bad: '<linearGradient id="g" />' },
  { id: 'filtros', re: /<filter|filter\s*:/, bad: '.a { filter: blur(2px); }' },
  { id: 'texto', re: /<text[\s>]/, bad: '<text x="1">a</text>' },
  { id: 'raster', re: /<image|<img[\s>]/, bad: '<image href="a.png" />' },
  { id: 'foreignObject', re: /foreignObject/, bad: '<foreignObject></foreignObject>' },
  { id: 'script', re: /<script/, bad: '<script>1</script>' },
  { id: 'titulo', re: /<title[\s>]/, bad: '<svg><title>x</title></svg>' },
];

const CLEAN = '<svg aria-hidden="true" focusable="false"><path d="M0 0" class="cs-a cs-o"></path></svg>';

test('los archivos propios no traen construcciones prohibidas', () => {
  for (const file of OWNED) {
    const source = readFileSync(file, 'utf8');
    for (const rule of RULES) {
      assert.ok(!rule.re.test(source), `${file} trae "${rule.id}"`);
    }
  }
});

test('mutación: cada regla del detector marca su construcción y deja pasar el svg limpio', () => {
  for (const rule of RULES) {
    assert.ok(!rule.re.test(CLEAN), `${rule.id}: el svg limpio no debe marcarse`);
    assert.ok(rule.re.test(CLEAN + rule.bad), `${rule.id}: la mutación debe detectarse`);
  }
});

/** Verdadero si todo `<svg` crudo del texto es decorativo (aria-hidden true y focusable false). */
function everySvgDecorative(source) {
  const tags = source.match(/<svg\b[^>]*>/g) ?? [];
  return tags.every((tag) => /aria-hidden="true"/.test(tag) && /focusable="false"/.test(tag));
}

test('todo <svg de collage lleva aria-hidden true y focusable false', () => {
  for (const file of OWNED.filter((f) => f.includes('/collage/') && f.endsWith('.astro'))) {
    assert.ok(everySvgDecorative(readFileSync(file, 'utf8')), `${file}: svg sin aria-hidden o focusable`);
  }
  // mutación
  assert.equal(everySvgDecorative(CLEAN), true);
  assert.equal(everySvgDecorative('<svg focusable="false"></svg>'), false);
  assert.equal(everySvgDecorative('<svg aria-hidden="true"></svg>'), false);
});

test('el logo es una imagen con nombre: role img, aria-label y nunca aria-hidden', () => {
  const logo = readFileSync('src/components/brand/Logo.astro', 'utf8');
  assert.match(logo, /role="img"/);
  assert.match(logo, /aria-label=\{name\}/);
  assert.doesNotMatch(logo, /aria-hidden/);
});

test('las piezas validan el tono en el build', () => {
  const piece = readFileSync('src/components/collage/CollagePiece.astro', 'utf8');
  assert.match(piece, /assertToneSafe\(/);
  for (const file of ['src/components/collage/AgendaCollage.astro', 'src/components/collage/Avatar.astro']) {
    if (existsSync(file)) assert.match(readFileSync(file, 'utf8'), /assertToneSafe\(/, `${file} valida el tono`);
  }
});

// ---------------------------------------------------------------------------------------------
// (v) Sobre el build (dist)
// ---------------------------------------------------------------------------------------------

function readDist(path) {
  assert.ok(existsSync(path), `Falta ${path}: ejecuta npx astro build antes de estas pruebas`);
  return readFileSync(path, 'utf8');
}

const spriteOf = (html) => html.match(/<svg class="collage-sprite"[\s\S]*?<\/svg>/)?.[0] ?? '';

test('dist/index.html trae un solo sprite, pesa menos de 60 KB y el sprite menos de 10 KB', () => {
  const html = readDist('dist/index.html');
  assert.equal((html.match(/class="collage-sprite"/g) ?? []).length, 1);
  assert.ok(Buffer.byteLength(html) < 61440, `dist/index.html pesa ${Buffer.byteLength(html)} bytes`);
  assert.ok(Buffer.byteLength(spriteOf(html)) < 10240, 'sprite de 10 KB o más');
});

test('en la hoja, cada <use href="#cs-..."> resuelve a un <symbol id> de esa página', (t) => {
  if (!existsSync('dist/marca/hoja/index.html')) {
    t.skip('la hoja no existe en este build (producción)');
    return;
  }
  const html = readDist('dist/marca/hoja/index.html');
  const ids = new Set([...html.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]));
  const uses = [...html.matchAll(/<use href="#(cs-[^"]+)"/g)].map((m) => m[1]);
  assert.ok(uses.length > 0, 'la hoja no usa ninguna pieza');
  for (const id of uses) assert.ok(ids.has(id), `<use> sin símbolo: ${id}`);
});
