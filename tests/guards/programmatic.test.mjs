import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from '../../scripts/lib/programmatic-rules.mjs';

// Cada regla se prueba por mutación: una página buena pasa y cada variante mala debe bloquear.
const template = { servicio_intro: 'Loops Growth ofrece SEO y GEO para negocios de {pais}.', cierre_titulo: 'Revisa tu caso', cierre_texto: 'Agenda una llamada con el equipo.' };
const gen = (w, n = 90) => Array.from({ length: n }, (_, i) => `${w}${i}`).join(' ');
const good = (id) => ({
  id, draft: false, reviewedBy: 'Ari', h1: `Agencia SEO en ${id}`, intro: gen(`${id}i`),
  secciones: [1, 2, 3].map((n) => ({ titulo: `Sección ${n}`, cuerpo: gen(`${id}s${n}`) })),
  hechos: [1, 2, 3].map((n) => ({ dato: `Dato ${id} ${n}`, fuente: `https://example.com/${id}/${n}` })),
});
const rules = (pages) => evaluate(pages, template).filter((f) => f.level === 'block').map((f) => f.rule);

test('página con contenido propio, secciones, hechos y revisión pasa', () => {
  assert.deepEqual(rules([good('aa'), good('bb')]), []);
});
test('sin revisión de Ari no se publica', () => {
  assert.ok(rules([{ ...good('aa'), reviewedBy: undefined }]).includes('REVISION'));
});
test('menos de 3 secciones o 3 hechos bloquea', () => {
  const p = good('aa');
  assert.ok(rules([{ ...p, secciones: p.secciones.slice(0, 2) }]).includes('SECCIONES'));
  assert.ok(rules([{ ...p, hechos: p.hechos.slice(0, 2) }]).includes('HECHOS'));
});
test('página delgada (pocas palabras) bloquea', () => {
  assert.ok(rules([{ ...good('aa'), intro: 'corto', secciones: good('aa').secciones.map((s) => ({ ...s, cuerpo: 'poco' })) }]).includes('PALABRAS'));
});
test('texto copiado entre países bloquea por contenido único', () => {
  const a = good('aa');
  const b = { ...good('bb'), intro: a.intro, secciones: a.secciones };
  assert.ok(rules([a, b]).includes('UNICO'));
});
test('precios, oficina, reseñas, rayas y marcas de faltante bloquean', () => {
  const bad = (text) => rules([{ ...good('aa'), intro: `${good('aa').intro} ${text}` }]);
  assert.ok(bad('desde USD 500 al mes').includes('PRECIO'));
  assert.ok(bad('Tenemos oficina en la ciudad').includes('OFICINA'));
  assert.ok(bad('Lee las reseñas de clientes').includes('RESENA'));
  assert.ok(bad('Dos rutas — una larga').includes('RAYA'));
  assert.ok(bad('FALTA CONFIRMAR').includes('FALTA'));
});
test('fuente no https bloquea', () => {
  const p = good('aa');
  assert.ok(rules([{ ...p, hechos: [{ dato: 'x', fuente: 'http://a.com' }, ...p.hechos.slice(1)] }]).includes('FUENTE'));
});
test('más de 14 páginas bloquea (index bloat)', () => {
  assert.ok(rules(Array.from({ length: 15 }, (_, i) => good(`p${i}`))).includes('MAX'));
});
test('un borrador incompleto solo avisa', () => {
  const r = evaluate([{ ...good('aa'), draft: true, secciones: [] }], template);
  assert.ok(r.length > 0 && r.every((f) => f.level === 'warn' || f.rule === 'FUENTE' || f.rule === 'PRECIO' || f.rule === 'OFICINA'));
});
