#!/usr/bin/env node
/**
 * Extrae las mesas oficiales del logo de Loops Growth del `.ai` de Ari como SVG limpios
 * en `src/assets/brand` (plan 02-09). Solo corre a mano al autorar, cuando Ari entrega un `.ai`
 * nuevo; el sitio no depende de este script en tiempo de build.
 *
 * Uso:
 *   node scripts/brand/extract-artboards.mjs --source <ruta al .ai> [--only 6,13] [--out <dir>]
 *
 * Requisitos (no se instala nada aquí):
 *   - poppler: `pdftocairo` en el PATH (`brew install poppler`).
 *   - SVGO: el binario de `node_modules/.bin/svgo` (ya viene con las dependencias del repo).
 *   - Chromium de `@playwright/test`, para medir la caja real del dibujo con `getBBox()`.
 *
 * El `.ai` es un PDF de 32 mesas de 800 x 800 y NO se versiona (`.gitignore` cubre `*.ai`). Ari lo
 * comparte en Google Drive; se baja una vez a una carpeta fuera del repositorio:
 *   curl -sL 'https://drive.google.com/uc?export=download&id=<id>' -o /ruta/fuera/del/repo/logo.ai
 * y `file /ruta/fuera/del/repo/logo.ai` debe decir "PDF document". Registra en el SUMMARY el id de
 * Drive y `shasum -a 256` del archivo usado, nunca el archivo.
 *
 * Pasos por mesa: `pdftocairo -svg -f N -l N`; `cleanArtboard` (sin fondo, sin dimensiones,
 * rellenos oficiales en hex; falla si un color queda fuera de la paleta); SVGO; medida de la caja
 * en Chromium y sustitución del `viewBox` por esa caja, sin holgura (el área de salvado del logo es
 * CSS, no arte). Todas las llamadas a procesos usan `spawnSync` con lista de argumentos, sin shell.
 * Sale con 1 si un color queda fuera de la paleta, si queda algún `<rect>` o si la caja se sale
 * de 0 a 800.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { cleanArtboard } from '../lib/brand-svg.mjs';
import { ARTBOARDS } from '../../src/components/brand/logo-variants.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SVGO = join(ROOT, 'node_modules/.bin/svgo');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

/** @param {string} cmd @param {string[]} args */
function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: 'utf8' });
  if (result.error) fail(`no se pudo ejecutar ${cmd}: ${result.error.message}`);
  if (result.status !== 0) fail(`${cmd} ${args.join(' ')} terminó con ${result.status}: ${result.stderr}`);
  return result.stdout;
}

function parseArgs(argv) {
  const opts = { source: '', only: null, out: join(ROOT, 'src/assets/brand') };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--source') opts.source = argv[++i] ?? '';
    else if (flag === '--only') opts.only = (argv[++i] ?? '').split(',').map((n) => Number(n.trim())).filter(Boolean);
    else if (flag === '--out') opts.out = resolve(argv[++i] ?? '');
    else fail(`opción desconocida: ${flag}`);
  }
  if (!opts.source) fail('falta --source <ruta al .ai>');
  return opts;
}

const round2 = (v) => Number(v.toFixed(2));

/** Sustituye el viewBox por la caja medida, redondeada hacia afuera a dos decimales. */
function withMeasuredViewBox(svg, box) {
  const x = round2(Math.floor(box.x * 100) / 100);
  const y = round2(Math.floor(box.y * 100) / 100);
  const right = round2(Math.ceil((box.x + box.width) * 100) / 100);
  const bottom = round2(Math.ceil((box.y + box.height) * 100) / 100);
  if (x < 0 || y < 0 || right > 800 || bottom > 800) {
    fail(`la caja ${x} ${y} ${right} ${bottom} se sale de 0 a 800`);
  }
  const viewBox = `${x} ${y} ${round2(right - x)} ${round2(bottom - y)}`;
  return { viewBox, svg: svg.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`) };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!existsSync(opts.source)) fail(`no existe ${opts.source}`);
  if (!existsSync(SVGO)) fail('falta node_modules/.bin/svgo (ejecuta npm install)');
  if (!/PDF document/.test(run('file', [opts.source]))) fail(`${opts.source} no es un PDF según \`file\``);

  const boards = ARTBOARDS.filter((b) => b.use && (!opts.only || opts.only.includes(b.n)));
  if (boards.length === 0) fail('ninguna mesa seleccionada');
  mkdirSync(opts.out, { recursive: true });

  const work = mkdtempSync(join(tmpdir(), 'brand-extract-'));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const rows = [];
  try {
    for (const board of boards) {
      const raw = join(work, `${board.n}.svg`);
      const clean = join(work, `${board.n}-clean.svg`);
      const min = join(work, `${board.n}-min.svg`);
      run('pdftocairo', ['-svg', '-f', String(board.n), '-l', String(board.n), opts.source, raw]);
      writeFileSync(clean, cleanArtboard(readFileSync(raw, 'utf8'), board.n));
      run(SVGO, ['-i', clean, '-o', min, '-p', '2', '--multipass', '-q']);
      const optimized = readFileSync(min, 'utf8');
      if (/<rect\b/.test(optimized)) fail(`mesa ${board.n}: quedó un <rect> tras la limpieza`);
      await page.setContent(`<!doctype html><body style="margin:0">${optimized}</body>`);
      const box = await page.evaluate(() => {
        const { x, y, width, height } = document.querySelector('svg').getBBox();
        return { x, y, width, height };
      });
      const { viewBox, svg } = withMeasuredViewBox(optimized, box);
      const target = join(opts.out, `${board.file}.svg`);
      writeFileSync(target, svg);
      rows.push({ mesa: board.n, archivo: `${board.file}.svg`, bytes: Buffer.byteLength(svg), rutas: (svg.match(/<path\b/g) ?? []).length, viewBox });
    }
  } finally {
    await browser.close();
    rmSync(work, { recursive: true, force: true });
  }
  console.table(rows);
}

main().catch((error) => fail(error.message));
