// Guarda del SEO programático por país. Lee src/content/paises/*.yaml. Sin archivos, pasa: no hay
// contenido único y verdadero, así que no se genera ninguna página (comportamiento esperado hoy).
// Uso: node scripts/check-programmatic.mjs [--dir <carpeta>]
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse } from 'yaml';
import { evaluate, forbiddenText, SCHEMA_ADDRESS_RE } from './lib/programmatic-rules.mjs';

const args = process.argv.slice(2);
const dir = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'src/content/paises';
const template = JSON.parse(readFileSync('src/lib/pais-template.json', 'utf8'));

const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort() : [];
const pages = files.map((f) => {
  const d = parse(readFileSync(join(dir, f), 'utf8')) ?? {};
  return { id: basename(f, '.yaml'), draft: d.draft !== false, tipo: 'pais', secciones: [], hechos: [], faq: [], h1: '', intro: '', ...d };
});

const findings = evaluate(pages, template);

// Páginas de servicio, nosotros y autora (src/content/paginas) y artículos del blog: mismas reglas de texto
// prohibido que las de país. No miden unicidad ni hechos: eso es de las páginas programáticas.
if (!args.includes('--dir')) {
  const scan = (dirPath, ext, textOf) => {
    if (!existsSync(dirPath)) return;
    for (const f of readdirSync(dirPath).filter((n) => n.endsWith(ext)).sort()) {
      const raw = readFileSync(join(dirPath, f), 'utf8');
      for (const x of forbiddenText(textOf(raw))) findings.push({ id: `${dirPath}/${f}`, rule: x.rule, level: 'block', detail: x.detail });
    }
  };
  // Del YAML solo se escanean los valores visibles (no `pendientes`, que es metadato y nunca se imprime).
  scan('src/content/paginas', '.yaml', (raw) => {
    const d = parse(raw) ?? {};
    const visible = { ...d, pendientes: undefined };
    return JSON.stringify(visible).replace(/\\n/g, '\n');
  });
  // Del markdown del blog solo cuenta el cuerpo (el front matter lleva metadatos).
  scan('src/content/blog', '.md', (raw) => raw.replace(/^---[\s\S]*?---/, ''));
}

// Sin dirección ni oficina en el código: ningún LocalBusiness, address, mapa ni ProfessionalService en src/.
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
if (!args.includes('--dir')) {
  for (const f of walk('src').filter((f) => /\.(astro|ts|mjs|json)$/.test(f))) {
    const code = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');
    const m = code.match(SCHEMA_ADDRESS_RE);
    if (m) findings.push({ id: f, rule: 'DIRECCION', level: 'block', detail: `schema u oficina prohibidos: ${m[0]}` });
  }
}
for (const f of findings) console.log(`${f.level === 'block' ? 'FAIL' : 'WARN'} [${f.rule}] ${f.id}: ${f.detail}`);
const blocks = findings.filter((f) => f.level === 'block').length;
console.log(`check-programmatic: ${blocks ? 'FALLA' : 'OK'}; ${pages.length} páginas de país (${pages.filter((p) => !p.draft).length} publicables), ${findings.length - blocks} avisos, ${blocks} bloqueos`);
process.exit(blocks ? 1 : 0);
