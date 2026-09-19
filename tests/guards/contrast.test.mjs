import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  APPROVED_PAIRS,
  FORBIDDEN_PAIRS,
  contrastRaw,
  contrastRatio,
  parseTokens,
} from '../../scripts/lib/contrast.mjs';

const CLI = 'scripts/check-contrast.mjs';
const TOKENS = 'src/styles/tokens.css';

const HEX = {
  purple: '#73187f',
  orange: '#fd6938',
  yellow: '#ffc602',
  dark: '#212121',
  white: '#ffffff',
};

const run = (...args) => spawnSync('node', [CLI, ...args], { encoding: 'utf8' });

function mutatedTokens(mutate) {
  const dir = mkdtempSync(join(tmpdir(), 'contrast-'));
  const file = join(dir, 'tokens.css');
  writeFileSync(file, mutate(readFileSync(TOKENS, 'utf8')));
  return file;
}

// Reemplaza una declaración dentro del bloque de un tono (el bloque `[data-tone="x"] { ... }`).
function replaceInTone(css, tone, prop, value) {
  const re = new RegExp(`(\\[data-tone="${tone}"\\]\\s*\\{[^}]*?${prop}:\\s*)[^;]+;`);
  assert.match(css, re, `no se encontró ${prop} en el tono ${tone}`);
  return css.replace(re, `$1${value};`);
}

test('contrastRatio reproduce los 15 ratios medidos (9 aprobados y 6 prohibidos)', () => {
  const known = [
    [HEX.dark, HEX.white, 16.1],
    [HEX.purple, HEX.white, 9.69],
    [HEX.white, HEX.purple, 9.69],
    [HEX.yellow, HEX.purple, 6.15],
    [HEX.dark, HEX.yellow, 10.22],
    [HEX.dark, HEX.orange, 5.56],
    [HEX.yellow, HEX.dark, 10.22],
    [HEX.orange, HEX.dark, 5.56],
    [HEX.orange, HEX.purple, 3.35],
    [HEX.white, HEX.orange, 2.89],
    [HEX.orange, HEX.white, 2.89],
    [HEX.yellow, HEX.white, 1.58],
    [HEX.white, HEX.yellow, 1.58],
    [HEX.purple, HEX.dark, 1.66],
    [HEX.orange, HEX.yellow, 1.84],
  ];
  assert.equal(known.length, 15);
  for (const [fg, bg, expected] of known) {
    assert.ok(
      Math.abs(contrastRatio(fg, bg) - expected) <= 0.01 + 1e-9,
      `${fg} sobre ${bg}: se esperaba ${expected} y salió ${contrastRatio(fg, bg)}`,
    );
  }
});

test('contrastRaw no redondea: #6473b6 sobre blanco (4.4971) no cumple 4.5 aunque se muestre como 4.5', () => {
  assert.equal(contrastRatio('#6473b6', HEX.white), 4.5);
  assert.ok(contrastRaw('#6473b6', HEX.white) < 4.5);
});

test('un enlace de tono con ratio real 4.4971 falla check-contrast aunque el ratio redondeado sea 4.5', () => {
  const file = mutatedTokens((css) => replaceInTone(css, 'light', '--link', '#6473b6'));
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /tono light: --link sobre --surface/);
  assert.match(res.stderr, /real 4\.4971/);
});

test('las listas exportadas traen 9 pares aprobados y 6 prohibidos', () => {
  assert.equal(APPROVED_PAIRS.length, 9);
  assert.equal(FORBIDDEN_PAIRS.length, 6);
});

test('parseTokens lee @theme static, resuelve los tonos y no toma un :root suelto por tono', () => {
  const { theme, tones } = parseTokens(readFileSync(TOKENS, 'utf8'));
  assert.equal(theme['--color-brand-purple'], HEX.purple);
  // Comprobación de forma, no de valor: la medida del formulario cambia cada vez que se vuelve a medir.
  assert.match(theme['--form-min-h-sm'], /^\d+px$/, 'el bloque @theme static debe exponer --form-min-h-sm');
  assert.deepEqual(Object.keys(tones).sort(), ['light', 'purple']);
  assert.equal(tones.light['--on-cta'], HEX.dark);
  assert.equal(tones.purple['--surface'], HEX.purple);
  assert.equal(tones.purple['--focus-ring'], HEX.yellow);
  assert.equal(tones.light['--dur-1'], undefined);
});

test('parseTokens acepta comillas simples y sin comillas en [data-tone] y no reporta problemas', () => {
  const css = `[data-tone='light'] { --surface: #ffffff; } [data-tone=purple] { --surface: #73187f; }`;
  const { tones, problems } = parseTokens(css);
  assert.deepEqual(Object.keys(tones).sort(), ['light', 'purple']);
  assert.deepEqual(problems, []);
});

test('un tono con comillas simples sigue verificándose: check-contrast lo evalúa y no lo ignora', () => {
  const file = mutatedTokens((css) =>
    css
      .replace('[data-tone="purple"]', "[data-tone='purple']")
      .replace(/(\[data-tone='purple'\]\s*\{[^}]*?--focus-ring:\s*)[^;]+;/, '$1var(--color-brand-dark);'),
  );
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /tono purple: --focus-ring sobre --surface/);
});

test('si falta un tono obligatorio (light o purple) check-contrast sale con 1 y lo nombra', () => {
  for (const tone of ['light', 'purple']) {
    const file = mutatedTokens((css) => css.replaceAll(`[data-tone="${tone}"]`, '[data-tono="x"]'));
    const res = run('--tokens', file);
    assert.equal(res.status, 1, `sin el tono ${tone} debía fallar`);
    assert.match(res.stderr, new RegExp(`tono ${tone}: .*no se encontró|tono ${tone} = n/a`));
  }
});

test('CSS anidado dentro de un bloque [data-tone] hace fallar la guarda en vez de pasar en silencio', () => {
  const file = mutatedTokens((css) =>
    css.replace('[data-tone="purple"] {', '[data-tone="purple"] {\n  .card { color: red; }'),
  );
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /llaves anidadas|no se encontró/);
});

test('un selector descendiente [data-tone="x"] .card no se fusiona con el tono: se reporta y falla', () => {
  const file = mutatedTokens(
    (css) => `${css}\n[data-tone="purple"] .card { --surface: #ffffff; }\n`,
  );
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /selector de tono no admitido/);
  const { tones } = parseTokens(readFileSync(file, 'utf8'));
  assert.equal(tones.purple['--surface'], HEX.purple);
});

test('ejecución por defecto: código 0 y 9 pares aprobados ok en --json', () => {
  const res = run();
  assert.equal(res.status, 0, res.stderr);
  const json = run('--json');
  assert.equal(json.status, 0, json.stderr);
  const results = JSON.parse(json.stdout);
  const approved = results.filter((r) => r.kind === 'approved');
  const forbidden = results.filter((r) => r.kind === 'forbidden');
  assert.equal(approved.length, 9);
  assert.ok(approved.every((r) => r.ok));
  assert.equal(forbidden.length, 6);
  assert.ok(forbidden.every((r) => r.ok && r.ratio < r.threshold));
  assert.ok(results.filter((r) => r.kind === 'tone').every((r) => r.ok));
});

test('cambiar --color-brand-dark a #777777 rompe check-contrast con código 1', () => {
  const file = mutatedTokens((css) => css.replace(/(--color-brand-dark:\s*)#212121/, '$1#777777'));
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /FAIL/);
  assert.match(res.stderr, /dark sobre white/);
});

test('apuntar --on-cta del tono claro a blanco rompe con código 1 y menciona 2.89', () => {
  const file = mutatedTokens((css) =>
    replaceInTone(css, 'light', '--on-cta', 'var(--color-brand-white)'),
  );
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /tono light: --on-cta sobre --cta-bg/);
  assert.match(res.stderr, /2\.89/);
});

test('apuntar --focus-ring del tono morado a oscuro rompe con código 1 y menciona 1.66', () => {
  const file = mutatedTokens((css) =>
    replaceInTone(css, 'purple', '--focus-ring', 'var(--color-brand-dark)'),
  );
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /tono purple: --focus-ring sobre --surface/);
  assert.match(res.stderr, /1\.66/);
});

test('declarar un par prohibido en un tono (naranja sobre blanco como enlace) falla y lo nombra', () => {
  const file = mutatedTokens((css) =>
    replaceInTone(css, 'light', '--link', 'var(--color-brand-orange)'),
  );
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
  assert.match(res.stderr, /tono light: --link sobre --surface/);
  assert.match(res.stderr, /par prohibido/);
});

test('un token de marca que falta rompe check-contrast con código 1', () => {
  const file = mutatedTokens((css) => css.replace(/--color-brand-yellow:[^;]+;/, ''));
  const res = run('--tokens', file);
  assert.equal(res.status, 1);
});

test('una ruta de tokens inexistente sale con 1', () => {
  const res = run('--tokens', join(tmpdir(), 'no-existe', 'tokens.css'));
  assert.equal(res.status, 1);
});
