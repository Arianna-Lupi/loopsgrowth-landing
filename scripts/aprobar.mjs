// Aprueba contenido: pone `draft: false` y `reviewedBy` en los archivos elegidos. Es el único paso humano
// entre un borrador y la publicación programada: el cron diario solo publica lo aprobado y con fecha cumplida.
// Uso:
//   node scripts/aprobar.mjs --lista                      lista pendientes con su fecha
//   node scripts/aprobar.mjs --por "Juan Angulo" <id>...  aprueba por id (slug de archivo)
//   node scripts/aprobar.mjs --por "Juan Angulo" --todo   aprueba todos los borradores con fecha programada
// Antes de aprobar, lee cada pieza con `npm run dev` (los borradores se ven con noindex).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const args = process.argv.slice(2);
const por = args.includes('--por') ? args[args.indexOf('--por') + 1] : null;
const ids = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--por');
const todo = args.includes('--todo');
const hoy = new Date().toISOString().slice(0, 10);

const DIRS = [
  { dir: 'src/content/blog', ext: '.md', dateKey: 'pubDate' },
  { dir: 'src/content/paginas', ext: '.yaml', dateKey: 'publishAt' },
  { dir: 'src/content/paises', ext: '.yaml', dateKey: 'publishAt' },
];

const items = [];
for (const { dir, ext, dateKey } of DIRS) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((n) => n.endsWith(ext))) {
    const path = `${dir}/${f}`;
    const raw = readFileSync(path, 'utf8');
    const fm = ext === '.md' ? raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '' : raw;
    const d = parseYaml(fm) ?? {};
    items.push({ id: f.slice(0, -ext.length), path, raw, draft: d.draft !== false, date: d[dateKey] ? new Date(d[dateKey]).toISOString().slice(0, 10) : '', dir, tipo: d.tipo ?? 'blog', reviewedBy: d.reviewedBy });
  }
}

if (args.includes('--lista') || (!ids.length && !todo)) {
  const pend = items.filter((i) => i.draft).sort((a, b) => a.date.localeCompare(b.date));
  for (const i of pend) console.log(`${i.date || 'sin fecha'}  ${i.tipo.padEnd(8)} ${i.id}`);
  console.log(`${pend.length} borradores; ${items.length - pend.length} aprobados.`);
  process.exit(0);
}
if (!por) { console.error('Falta --por "Nombre" (quien revisó).'); process.exit(1); }

const objetivo = todo ? items.filter((i) => i.draft && i.date) : ids.map((id) => items.find((i) => i.id === id)).filter(Boolean);
for (const id of ids) if (!items.find((i) => i.id === id)) console.error(`No existe: ${id}`);
let n = 0;
for (const i of objetivo) {
  if (!i.draft) continue;
  const rev = `reviewedBy: "${por} (revisión, ${hoy})"`;
  let out = i.raw.replace(/^draft:\s*true\s*$/m, 'draft: false');
  out = /^reviewedBy:.*$/m.test(out) ? out.replace(/^reviewedBy:.*$/m, rev) : out.replace(/^draft: false$/m, `draft: false\n${rev}`);
  writeFileSync(i.path, out);
  n++;
}
console.log(`${n} aprobados por ${por}. Salen en su fecha con el cron diario (o en el próximo deploy si la fecha ya pasó).`);
