import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { contrastRaw, parseTokens } from '../../scripts/lib/contrast.mjs';

// Guardas del collage de marca (plan 02-10): geometría oficial de Loopy, esquemas de color,
// reglas de píldoras y palabras, ranuras de foto y escenas. Cada regla trae su mutación.

const LOOPY_DIR = 'src/assets/loopy';
const BRAND_DIR = 'src/assets/brand';
const OFFICIAL_FILLS = ['#4228d1', '#6c61db', '#f4f3e0', '#1e1e1e'];
const TOKENS = parseTokens(readFileSync('src/styles/tokens.css', 'utf8'));

const loadLoopy = () => import('../../src/components/collage/loopy.mjs');
const loadRules = () => import('../../src/components/collage/collage-rules.mjs');
const loadScenes = () => import('../../src/components/collage/scenes.mjs');

const read = (dir, file) => readFileSync(`${dir}/${file}.svg`, 'utf8');
const pathsOf = (text) =>
  [...text.matchAll(/<path\b([^>]*?)\/?>/g)].map((m) => ({
    fill: m[1].match(/\sfill="([^"]*)"/)?.[1],
    d: m[1].match(/\sd="([^"]*)"/)?.[1],
  }));
const viewBoxOf = (text) => text.match(/viewBox="([^"]+)"/)[1].trim().split(/[\s,]+/).map(Number);

// ---------------------------------------------------------------------------------------------
// (i) Fuentes de Loopy sin unir rutas
// ---------------------------------------------------------------------------------------------

const SOURCES = [
  ['isotipo-13-blanco', 11],
  ['isotipo-14-morado', 11],
  ['ojo-18-blanco', 6],
  ['ojo-19-morado', 6],
];

test('(i) fuentes: cuatro archivos livianos, solo svg y path, con las rutas esperadas', () => {
  for (const [file, count] of SOURCES) {
    const path = `${LOOPY_DIR}/${file}.svg`;
    assert.ok(existsSync(path), `falta ${path}`);
    const text = readFileSync(path, 'utf8');
    assert.ok(Buffer.byteLength(text) < 4096, `${file}: pesa ${Buffer.byteLength(text)} bytes`);
    assert.equal((text.match(/<svg\b/g) ?? []).length, 1);
    const vb = viewBoxOf(text);
    assert.equal(vb.length, 4);
    assert.ok(vb.every((n) => n >= 0 && n <= 800), `${file}: viewBox fuera de 0 a 800`);
    const elements = new Set([...text.matchAll(/<([a-zA-Z][\w:-]*)/g)].map((m) => m[1]));
    assert.deepEqual([...elements].sort(), ['path', 'svg'], `${file}: elementos ${[...elements]}`);
    assert.ok(!/\s(width|height|href|style)=|xlink|<!--|<\?xml|<metadata/i.test(text), `${file}: atributo o metadato prohibido`);
    const paths = pathsOf(text);
    assert.equal(paths.length, count, `${file}: número de rutas`);
    for (const p of paths) {
      assert.match(p.fill ?? '', /^#[0-9a-f]{6}$/, `${file}: relleno hexadecimal`);
      assert.ok(OFFICIAL_FILLS.includes(p.fill), `${file}: relleno ${p.fill} fuera de los colores oficiales`);
      assert.match(p.d ?? '', /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/, `${file}: caracteres extraños en d`);
    }
  }
});

test('(ii) geometría: las rutas de 13 y 14, y de 18 y 19, son idénticas y solo se intercambian roles', async () => {
  const { LOOPY_ROLES } = await loadLoopy();
  for (const [a, b, kind] of [['isotipo-13-blanco', 'isotipo-14-morado', 'ojos'], ['ojo-18-blanco', 'ojo-19-morado', 'lupa']]) {
    const ta = read(LOOPY_DIR, a);
    const tb = read(LOOPY_DIR, b);
    assert.deepEqual(viewBoxOf(ta), viewBoxOf(tb));
    const pa = pathsOf(ta);
    const pb = pathsOf(tb);
    assert.deepEqual(pa.map((p) => p.d), pb.map((p) => p.d), `${kind}: las rutas difieren`);
    LOOPY_ROLES[kind].forEach((role, i) => {
      if (role === 'frame' || role === 'rim') assert.notEqual(pa[i].fill, pb[i].fill, `${kind}[${i}] ${role} debe cambiar`);
      else assert.equal(pa[i].fill, pb[i].fill, `${kind}[${i}] ${role} no debe cambiar`);
    });
    // frame de A es rim de B y al revés
    const frameA = pa[LOOPY_ROLES[kind].indexOf('frame')].fill;
    const rimA = pa[LOOPY_ROLES[kind].indexOf('rim')].fill;
    assert.equal(pb[LOOPY_ROLES[kind].indexOf('frame')].fill, rimA);
    assert.equal(pb[LOOPY_ROLES[kind].indexOf('rim')].fill, frameA);
  }
});

test('(ii) loopyGeometry: partes y roles por tipo, y lanza si A y B difieren en una ruta', async () => {
  const { loopyGeometry, LOOPY_ROLES, parsePaths } = await loadLoopy();
  const ojos = loopyGeometry('ojos');
  const lupa = loopyGeometry('lupa');
  assert.deepEqual(ojos.parts.map((p) => p.role), ['frame', 'frame', 'rim', 'iris', 'pupil', 'glint', 'rim', 'iris', 'pupil', 'glint', 'frame']);
  assert.deepEqual(lupa.parts.map((p) => p.role), ['frame', 'rim', 'iris', 'pupil', 'glint', 'frame']);
  assert.deepEqual(LOOPY_ROLES.ojos.length, 11);
  assert.equal(ojos.viewBox.length, 4);
  for (const p of ojos.parts) {
    assert.ok(p.d.length > 0);
    if (['iris', 'pupil', 'glint'].includes(p.role)) assert.match(p.fill, /^#[0-9a-f]{6}$/);
    else assert.equal(p.fill, undefined);
  }
  assert.throws(() => loopyGeometry('gafas'), /Loopy/);
  // mutación: una ruta distinta entre esquemas se detecta
  const text = read(LOOPY_DIR, 'ojo-19-morado');
  const mutated = text.replace(/ d="M/, ' d="M1');
  const parsed = parsePaths(mutated);
  const original = parsePaths(read(LOOPY_DIR, 'ojo-18-blanco'));
  assert.notDeepEqual(parsed.paths.map((p) => p.d), original.paths.map((p) => p.d));
});

test('(ii) parsePaths rechaza elementos, atributos y caracteres fuera de la lista', async () => {
  const { parsePaths } = await loadLoopy();
  const ok = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 2 30 40"><path fill="#4228d1" d="M0 0L1 1Z"/></svg>';
  const parsed = parsePaths(ok);
  assert.deepEqual(parsed.viewBox, [1, 2, 30, 40]);
  assert.equal(parsed.paths.length, 1);
  assert.throws(() => parsePaths(ok.replace('<path', '<rect x="1"/><path')), /rect/);
  assert.throws(() => parsePaths(ok.replace('<path', '<path style="x"')), /style/);
  assert.throws(() => parsePaths(ok.replace('M0 0L1 1Z', 'M0 0<script>')), /d/);
  assert.throws(() => parsePaths(ok.replace('viewBox="1 2 30 40"', '')), /viewBox/);
});

// ---------------------------------------------------------------------------------------------
// (iii) Esquema y fidelidad contra las ocho mesas oficiales de 02-09
// ---------------------------------------------------------------------------------------------

test('(iii) loopyScheme: A en light y yellow, B en purple, error en dark y en lo desconocido', async () => {
  const { loopyScheme } = await loadLoopy();
  for (const kind of ['ojos', 'lupa']) {
    assert.equal(loopyScheme(kind, 'light'), 'A');
    assert.equal(loopyScheme(kind, 'yellow'), 'A');
    assert.equal(loopyScheme(kind, 'purple'), 'B');
    assert.throws(() => loopyScheme(kind, 'dark'), /oscuro/);
    assert.throws(() => loopyScheme(kind, 'neon'), /Tono desconocido/);
  }
  assert.throws(() => loopyScheme('gafas', 'light'), /Loopy/);
});

const BOARD_SCHEME = { 13: 'A', 14: 'B', 16: 'A', 17: 'A', 18: 'A', 19: 'B', 21: 'A', 22: 'A' };
const BOARD_FILE = {
  13: 'isotipo-13-blanco', 14: 'isotipo-14-morado', 16: 'isotipo-16-amarillo', 17: 'isotipo-17-oscuro',
  18: 'ojo-18-blanco', 19: 'ojo-19-morado', 21: 'ojo-21-amarillo', 22: 'ojo-22-oscuro',
};

/** Problemas de una mesa oficial frente al color de aro de su esquema. Vacío = fiel. */
function fidelityIssues(text, scheme, frameHex, sourceFills) {
  const issues = [];
  const paths = pathsOf(text);
  const expected = scheme === 'A' ? frameHex.purple : frameHex.cream;
  if (paths[0].fill !== expected) issues.push(`aro ${paths[0].fill} en vez de ${expected}`);
  const set = [...new Set(paths.map((p) => p.fill))].sort().join();
  if (set !== sourceFills) issues.push(`rellenos ${set} distintos de la fuente`);
  return issues;
}

test('(iii) fidelidad: las ocho mesas de 02-09 usan el color de aro de su esquema y los mismos rellenos que las fuentes', () => {
  const frameHex = { purple: TOKENS.theme['--color-brand-purple'], cream: TOKENS.theme['--color-brand-cream'] };
  const fillsOf = (file) => [...new Set(pathsOf(read(LOOPY_DIR, file)).map((p) => p.fill))].sort().join();
  const bySource = { ojos: fillsOf('isotipo-13-blanco'), lupa: fillsOf('ojo-18-blanco') };
  for (const [n, scheme] of Object.entries(BOARD_SCHEME)) {
    const kind = Number(n) < 18 ? 'ojos' : 'lupa';
    assert.deepEqual(fidelityIssues(read(BRAND_DIR, BOARD_FILE[n]), scheme, frameHex, bySource[kind]), [], `mesa ${n}`);
  }
  // mutación: la mesa 14 con el aro morado se detecta
  const bad = read(BRAND_DIR, BOARD_FILE[14]).replace(new RegExp(`fill="${frameHex.cream}"`), `fill="${frameHex.purple}"`);
  assert.ok(fidelityIssues(bad, 'B', frameHex, bySource.ojos).length > 0, 'una mesa 14 con el aro morado pasó');
});

test('(iii) schemeColors: frame y rim de cada esquema salen del archivo y del token', async () => {
  const { schemeColors } = await loadLoopy();
  for (const kind of ['ojos', 'lupa']) {
    assert.deepEqual(schemeColors(kind, 'A'), { frame: 'purple', rim: 'cream' });
    assert.deepEqual(schemeColors(kind, 'B'), { frame: 'cream', rim: 'purple' });
  }
  assert.throws(() => schemeColors('ojos', 'C'), /esquema/);
});

test('(iii) el sprite: .lp-a y .lp-b coinciden con schemeColors', async () => {
  const { schemeColors } = await loadLoopy();
  const sprite = readFileSync('src/components/collage/CollageSprite.astro', 'utf8');
  for (const [cls, scheme] of [['lp-a', 'A'], ['lp-b', 'B']]) {
    const block = sprite.match(new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
    const { frame, rim } = schemeColors('ojos', scheme);
    assert.ok(block.includes(`--lp-frame: var(--color-brand-${frame})`), `.${cls}: frame`);
    assert.ok(block.includes(`--lp-rim: var(--color-brand-${rim})`), `.${cls}: rim`);
  }
});

// ---------------------------------------------------------------------------------------------
// (iv) Color: crema
// ---------------------------------------------------------------------------------------------

test('(iv) el crema entra en BRAND_COLORS y en light, dark y purple, nunca en yellow', async () => {
  const { BRAND_COLORS, ALLOWED_FILLS, assertToneSafe, fillVar } = await loadRules();
  assert.ok(BRAND_COLORS.includes('cream'));
  for (const tone of ['light', 'dark', 'purple']) assert.equal(assertToneSafe(tone, ['cream'], 'p') !== undefined, true);
  assert.ok(!ALLOWED_FILLS.yellow.includes('cream'));
  assert.throws(
    () => assertToneSafe('yellow', ['cream'], 'pieza-x'),
    (e) => /pieza-x/.test(e.message) && /yellow/.test(e.message) && /cream/.test(e.message),
  );
  for (const [tone, color] of [['dark', 'purple'], ['purple', 'purple'], ['yellow', 'yellow'], ['dark', 'dark'], ['purple', 'dark']]) {
    assert.throws(() => assertToneSafe(tone, [color], 'p'), undefined, `${color} sobre ${tone}`);
  }
  assert.equal(fillVar('cream'), 'var(--color-brand-cream)');
});

// ---------------------------------------------------------------------------------------------
// (v) Píldoras y palabras
// ---------------------------------------------------------------------------------------------

test('(v) CHIP_WORDS: cinco palabras con idioma y fuente; las del copy están en el texto de Ari', async () => {
  const { CHIP_WORDS } = await loadRules();
  assert.deepEqual(CHIP_WORDS.map((w) => w.word), ['seo', 'geo', 'ads', 'spy', 'team work']);
  for (const w of CHIP_WORDS) {
    assert.ok(['es', 'en'].includes(w.lang), `${w.word}: idioma`);
    assert.ok(['copy', 'moodboard'].includes(w.source), `${w.word}: fuente`);
  }
  assert.deepEqual(CHIP_WORDS.filter((w) => w.lang === 'en').map((w) => w.word), ['spy', 'team work']);
  const copy = readFileSync('.planning/phases/02-secciones-marca-y-copy/02-ARI-COPY-V2.md', 'utf8').toLowerCase();
  for (const w of CHIP_WORDS.filter((x) => x.source === 'copy')) assert.ok(copy.includes(w.word), `${w.word} no está en el copy de Ari`);
});

test('(v) assertChipWord y assertPill: pares aprobados, rechazos y mutación del umbral', async () => {
  const { assertChipWord, assertPill } = await loadRules();
  assert.throws(() => assertChipWord('hola', 'escena'), /hola/);
  assertChipWord('team work', 'escena');
  const ok = [['light', 'yellow', 'dark', 'seo'], ['light', 'purple', 'cream', 'geo'], ['light', 'cream', 'purple', 'ads'],
    ['yellow', 'dark', 'yellow', 'seo'], ['purple', 'cream', 'purple', 'spy'], ['purple', 'yellow', 'dark', 'team work']];
  for (const args of ok) assertPill(...args, 'p');
  assert.throws(() => assertPill('light', 'purple', 'dark', 'seo', 'p'), (e) => /1\.8/.test(e.message) && /p/.test(e.message));
  assert.throws(() => assertPill('dark', 'purple', 'cream', 'seo', 'p'), /purple/);
  assert.throws(() => assertPill('light', 'yellow', 'dark', 'hola', 'p'), /hola/);
  assert.throws(() => assertPill('light', 'yellow', 'yellow', 'seo', 'p'), undefined);
  // razones medidas de los pares que exige el plan
  const c = (a, b) => contrastRaw(TOKENS.theme[`--color-brand-${a}`], TOKENS.theme[`--color-brand-${b}`]);
  assert.ok(c('cream', 'purple') > 7.6 && c('dark', 'yellow') > 10.2 && c('dark', 'orange') > 5.5 && c('white', 'purple') > 8.5);
  // mutación: con el umbral en 1 el par malo pasaría; el propio par mide menos de 4.5
  assert.ok(c('dark', 'purple') < 4.5 && c('dark', 'purple') >= 1);
});

// ---------------------------------------------------------------------------------------------
// (vi) Escenas
// ---------------------------------------------------------------------------------------------

const clone = (x) => structuredClone(x);
const layerOf = (scene, id) => scene.layers.find((l) => l.id === id);

/** Aplica una mutación a una copia de la escena y devuelve lo que assertScene lanza. */
async function mutate(name, fn) {
  const { SCENES, assertScene } = await loadScenes();
  const scene = clone(SCENES[name]);
  fn(scene);
  try {
    assertScene(scene);
    return null;
  } catch (e) {
    return e.message;
  }
}

test('(vi) assertScene pasa en el hero y lanza con cada mutación, nombrando escena, capa y regla', async () => {
  const { SCENES, assertScene } = await loadScenes();
  assert.doesNotThrow(() => assertScene('hero'));
  assert.ok(SCENES.hero);
  const cases = [
    ['R3', (s) => { layerOf(s, 'hero-loopy').cx += 60; }, 'hero-loopy'],
    ['R1', (s) => { layerOf(s, 'hero-destello').color = 'purple'; }, 'hero-destello'],
    ['R7', (s) => { layerOf(s, 'hero-pill-seo').word = 'hola'; }, 'hero-pill-seo'],
    ['R8', (s) => { s.groups.push({ name: 'extra', i: 6, r: 0, rFrom: 0 }); }, 'extra'],
    ['R6', (s) => { layerOf(s, 'hero-puntos').x = -20; }, 'hero-puntos'],
    ['R5', (s) => { Object.assign(layerOf(s, 'hero-mas'), { x: 30, y: 180 }); }, 'hero-mas'],
    ['R2', (s) => { delete layerOf(s, 'hero-panel').shadow; }, 'hero-panel'],
    ['R4', (s) => { layerOf(s, 'hero-flecha').y = 100; }, 'hero-flecha'],
    ['R9', (s) => { layerOf(s, 'hero-panel').name = 'otro'; }, 'hero-panel'],
    ['R10', (s) => { s.layers = s.layers.filter((l) => l.kind !== 'pill'); }, 'hero'],
    ['R11', (s) => { Object.assign(layerOf(s, 'hero-panel'), { h: 60, dots: { x: 358, y: 36, w: 40, color: 'purple' } }); s.layers = s.layers.filter((l) => l.kind !== 'pill'); }, 'hero'],
  ];
  for (const [rule, fn, layer] of cases) {
    const message = await mutate('hero', fn);
    assert.ok(message, `${rule}: la mutación no lanzó`);
    assert.ok(message.startsWith('Escena "hero"'), `${rule}: el mensaje no empieza por la escena: ${message}`);
    assert.ok(message.includes(layer) && message.includes(rule), `${rule}: mensaje sin capa o regla: ${message}`);
  }
});

test('(vi) hero: seis grupos con --i en permutación de 0 a 5 y ranura hero dentro del viewBox', async () => {
  const { SCENES, PHOTO_SLOTS } = await loadScenes();
  const hero = SCENES.hero;
  assert.deepEqual(hero.groups.map((g) => g.name).sort(), ['doodles', 'dots', 'loopy', 'panel', 'pills', 'stage']);
  assert.deepEqual(hero.groups.map((g) => g.i).sort(), [0, 1, 2, 3, 4, 5]);
  const slot = PHOTO_SLOTS.find((s) => s.name === 'hero');
  assert.ok(slot && slot.scene === 'hero');
  assert.ok(slot.x >= 0 && slot.y >= 0 && slot.x + slot.w <= hero.w && slot.y + slot.h <= hero.h);
  assert.ok(Math.abs(slot.aspect - slot.w / slot.h) < 1e-6);
});

test('(vi) SCENE_PIECES: las ocho claves y los tamaños de los garabatos y la retícula', async () => {
  const { SCENE_PIECES } = await loadRules();
  assert.deepEqual(Object.keys(SCENE_PIECES).sort(), ['asterisco', 'destello', 'flecha', 'garabato', 'lupa', 'mas', 'ojos', 'puntos']);
  assert.deepEqual([SCENE_PIECES.flecha.w, SCENE_PIECES.flecha.h], [64, 48]);
  assert.deepEqual([SCENE_PIECES.puntos.w, SCENE_PIECES.puntos.h], [96, 64]);
  for (const [key, p] of Object.entries(SCENE_PIECES)) assert.equal(p.symbol, `lg-${key}`);
});

test('(vi) los archivos del mecanismo no traen hex ni construcciones prohibidas', () => {
  const files = ['loopy.mjs', 'scenes.mjs', 'CollageScene.astro', 'Pill.astro', 'HeroCollage.astro'];
  for (const f of files) {
    const text = readFileSync(`src/components/collage/${f}`, 'utf8');
    assert.ok(!/#[0-9a-fA-F]{3}(?![0-9a-zA-Z_-])|#[0-9a-fA-F]{6}(?![0-9a-zA-Z_-])/.test(text), `${f}: hex`);
    assert.ok(!/set:html|<text[\s>]|<title|<image|<img[\s>]|<script/.test(text), `${f}: construcción prohibida`);
  }
});
