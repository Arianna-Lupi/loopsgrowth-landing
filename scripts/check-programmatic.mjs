// Guarda del SEO programático por país. Lee src/content/paises/*.yaml. Sin archivos, pasa: no hay
// contenido único y verdadero, así que no se genera ninguna página (comportamiento esperado hoy).
// Uso: node scripts/check-programmatic.mjs [--dir <carpeta>]
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse } from 'yaml';
import { evaluate } from './lib/programmatic-rules.mjs';

const args = process.argv.slice(2);
const dir = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'src/content/paises';
const template = JSON.parse(readFileSync('src/lib/pais-template.json', 'utf8'));

const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort() : [];
const pages = files.map((f) => {
  const d = parse(readFileSync(join(dir, f), 'utf8')) ?? {};
  return { id: basename(f, '.yaml'), draft: d.draft !== false, secciones: [], hechos: [], h1: '', intro: '', ...d };
});

const findings = evaluate(pages, template);
for (const f of findings) console.log(`${f.level === 'block' ? 'FAIL' : 'WARN'} [${f.rule}] ${f.id}: ${f.detail}`);
const blocks = findings.filter((f) => f.level === 'block').length;
console.log(`check-programmatic: ${blocks ? 'FALLA' : 'OK'}; ${pages.length} páginas de país (${pages.filter((p) => !p.draft).length} publicables), ${findings.length - blocks} avisos, ${blocks} bloqueos`);
process.exit(blocks ? 1 : 0);
