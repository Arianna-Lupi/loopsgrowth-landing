import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Las entradas del home (src/scripts/reveal.ts) ocultan sus elementos con reveal.css hasta animarlos: si un selector
// de reveal-selectors.ts no tiene su regla de ocultamiento, ese elemento parpadea (se ve, desaparece y entra).
const ts = readFileSync('src/scripts/reveal-selectors.ts', 'utf8');
const css = readFileSync('src/styles/reveal.css', 'utf8');
const ru = readFileSync('src/scripts/reveal.ts', 'utf8');

const quoted = (name) => {
  const m = ts.match(new RegExp(`${name}[^=]*=\\s*([\\s\\S]*?);`));
  return [...(m?.[1] ?? '').matchAll(/'([^']+)'/g)].map((x) => x[1]);
};

test('cada selector de entrada tiene su regla de ocultamiento en reveal.css', () => {
  const selectors = [...quoted('HERO_SELECTOR'), ...quoted('GROUPS')].flatMap((s) => s.split(/,\s*(?![^()]*\))/)).map((s) => s.trim());
  assert.ok(selectors.length >= 8, `pocos selectores: ${selectors.length}`);
  for (const s of selectors) {
    const base = s.replace(/:not\(\[aria-hidden\]\)/, '');
    assert.ok(css.includes(base.split(' > ').pop().split(':')[0]) || css.includes(base), `sin regla para ${s}`);
  }
});

test('el ocultamiento solo aplica con js-reveal y movimiento permitido, y nunca declara animation ni transition', () => {
  assert.ok(/@media \(prefers-reduced-motion: no-preference\)/.test(css));
  assert.ok(/html\.js-reveal/.test(css));
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/animation|transition/.test(code), 'reveal.css no debe animar');
});

test('reveal.ts respeta reduce, no anima sin IntersectionObserver y deja el valor final para lectores', () => {
  assert.ok(/prefers-reduced-motion: reduce/.test(ru));
  assert.ok(/IntersectionObserver/.test(ru));
  assert.ok(/aria-hidden/.test(ru) && /rv-sr/.test(ru));
  assert.ok(/fill: 'backwards'/.test(ru), 'sin fill backwards el elemento no vuelve a su estilo estático');
});
