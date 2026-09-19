import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { walkClaims, MISSING_MARK } from '../../scripts/lib/copy-rules.mjs';

// Los textos esperados salen del YAML (walkClaims y el propio arreglo): nunca cadenas escritas a mano
// (COPY-01). Los espacios se normalizan al comparar porque el HTML colapsa el espacio doble del doc de Ari.
type Claim = { text: string; status: string };
type Pillar = { title: Claim; body: Claim; list?: Claim[] };
const doc = parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    problem: { title: Claim; items: Claim[]; closing: Claim };
    why_now: { title: Claim; items: Claim[] };
    solution: { title: Claim; lead: Claim; items: Pillar[] };
  };
};
const es = doc.es;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const marksUnder = (prefix: string) =>
  walkClaims(doc).filter(
    (n: { kind: string; path: string; claim?: { text: string } }) =>
      n.kind === 'claim' && n.claim?.text === MISSING_MARK && n.path.startsWith(prefix),
  ).length;

const WHITE = 'rgb(255, 255, 255)';
const PURPLE = 'rgb(115, 24, 127)';

const color = (page: Page, sel: string) =>
  page.locator(sel).evaluate((el) => getComputedStyle(el).color);

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
]) {
  test.describe(`tres secciones a ${viewport.width} px`, () => {
    test.use({ viewport });

    test('las tres secciones existen en orden, con su tono y su h2', async ({ page }) => {
      await page.goto('/');
      const ids = await page.evaluate(() => [...document.querySelectorAll('main > section')].map((s) => s.id));
      const idx = (id: string) => ids.indexOf(id);
      expect(idx('problema')).toBeGreaterThan(-1);
      expect(idx('problema')).toBeLessThan(idx('por-que-ahora'));
      expect(idx('por-que-ahora')).toBeLessThan(idx('solucion'));

      await expect(page.locator('#problema')).toHaveAttribute('data-tone', 'dark');
      await expect(page.locator('#por-que-ahora')).toHaveAttribute('data-tone', 'yellow');
      await expect(page.locator('#solucion')).toHaveAttribute('data-tone', 'light');

      const h2 = (id: string) => page.locator(`#${id} h2`);
      expect(norm((await h2('problema').textContent()) ?? '')).toBe(norm(es.problem.title.text));
      expect(norm((await h2('por-que-ahora').textContent()) ?? '')).toBe(norm(es.why_now.title.text));
      // El titular de La solución es la marca de dato faltante (el del doc trae la sigla que la guarda rechaza).
      expect(norm((await h2('solucion').textContent()) ?? '')).toBe(norm(es.solution.title.text));
      expect(await color(page, '#problema h2')).toBe(WHITE);
      expect(await color(page, '#por-que-ahora h2')).toBe(PURPLE);
      expect(await color(page, '#solucion h2')).toBe(PURPLE);
    });

    test('La solución: lead, cuatro h3, cuerpo del Pilar 4 y ninguna palabra rechazada', async ({ page }) => {
      await page.goto('/');
      expect(norm((await page.locator('#solucion .section-lead').textContent()) ?? '')).toBe(
        norm(es.solution.lead.text),
      );
      const h3 = page.locator('#solucion h3');
      await expect(h3).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        expect(norm((await h3.nth(i).textContent()) ?? '')).toBe(norm(es.solution.items[i].title.text));
      }
      const pillars = page.locator('#solucion .pillar-grid > li');
      await expect(pillars).toHaveCount(4);
      // Cuerpo del cuarto pilar: el texto guardado (la marca), no la nota de verificación del doc.
      const fourth = norm((await pillars.nth(3).textContent()) ?? '');
      expect(fourth).toContain(norm(es.solution.items[3].body.text));

      const three = await page.evaluate(() =>
        ['problema', 'por-que-ahora', 'solucion'].map((id) => document.getElementById(id)?.textContent ?? '').join(' '),
      );
      expect(three).not.toMatch(/\bAEO\b/i);
      expect(three).not.toMatch(/\[VERIFICAR/i);
    });

    test('las marcas de dato faltante de las tres secciones vienen del YAML', async ({ page }) => {
      await page.goto('/');
      const expected =
        marksUnder('solution') + marksUnder('problem') + marksUnder('why_now');
      const count = await page.evaluate(
        (mark) =>
          ['problema', 'por-que-ahora', 'solucion']
            .map((id) => (document.getElementById(id)?.innerText ?? '').split(mark).length - 1)
            .reduce((a, b) => a + b, 0),
        MISSING_MARK,
      );
      expect(count).toBe(expected);
    });

    test('#problema y #por-que-ahora no llevan enlaces; #solucion tiene un solo CTA', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#problema a')).toHaveCount(0);
      await expect(page.locator('#por-que-ahora a')).toHaveCount(0);
      await expect(page.locator('#solucion a')).toHaveCount(1);
      const cta = page.locator('#solucion a[data-cta="solucion"]');
      await expect(cta).toHaveCount(1);
      await expect(cta).toHaveAttribute('href', '#agenda');
      expect(await cta.getAttribute('aria-label')).toBeNull();
      const heroName = norm((await page.locator('a[data-cta="hero"]').textContent()) ?? '');
      expect(norm((await cta.textContent()) ?? '')).toBe(heroName);
      const box = (await cta.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(48);
      const lead = (await page.locator('#solucion .section-lead').boundingBox())!;
      expect(box.y).toBeGreaterThanOrEqual(lead.y + lead.height);
    });

    test('un clic en el CTA de La solución deja el foco en #agenda-title', async ({ page }) => {
      await page.goto('/');
      await page.locator('a[data-cta="solucion"]').click();
      await expect(page).toHaveURL(/#agenda$/);
      await expect(page.locator('#agenda-title')).toBeFocused();
    });
  });
}

const DARK = 'rgb(33, 33, 33)';
const ORANGE_SHADOW = 'rgb(253, 105, 56) 6px 6px 0px 0px';

type Box = { x: number; y: number; width: number; height: number };
const boxes = async (page: Page, sel: string): Promise<Box[]> =>
  page.locator(sel).evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
    }),
  );

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
]) {
  test.describe(`problema y por qué ahora a ${viewport.width} px`, () => {
    test.use({ viewport });
    const wide = viewport.width >= 1024;

    test('tres tarjetas de dolor con el texto del YAML, en orden y con el mismo tamaño en fila', async ({ page }) => {
      await page.goto('/');
      const cards = page.locator('#problema .pain-card');
      await expect(cards).toHaveCount(es.problem.items.length);
      for (let i = 0; i < es.problem.items.length; i++) {
        expect(norm((await cards.nth(i).locator('.pain-text').textContent()) ?? '')).toBe(norm(es.problem.items[i].text));
      }
      const b = await boxes(page, '#problema .pain-card');
      if (wide) {
        for (const box of b) {
          expect(Math.abs(box.y - b[0].y)).toBeLessThanOrEqual(1);
          expect(Math.abs(box.height - b[0].height)).toBeLessThanOrEqual(1);
          expect(Math.abs(box.width - b[0].width)).toBeLessThanOrEqual(1);
        }
      } else {
        for (const box of b) expect(Math.abs(box.x - b[0].x)).toBeLessThanOrEqual(1);
        expect(b[1].y).toBeGreaterThan(b[0].y + b[0].height - 1);
      }
    });

    test('cada tarjeta: fondo blanco, borde de 3 px, radio 16, sombra dura naranja, padding y numeral', async ({ page }) => {
      await page.goto('/');
      const styles = await page.locator('#problema .pain-card').evaluateAll((els) =>
        els.map((el) => {
          const cs = getComputedStyle(el);
          const num = el.querySelector('.pain-num')!;
          const before = getComputedStyle(num, '::before');
          return {
            bg: cs.backgroundColor,
            color: cs.color,
            borderWidth: cs.borderTopWidth,
            borderColor: cs.borderTopColor,
            radius: cs.borderTopLeftRadius,
            shadow: cs.boxShadow,
            padding: cs.paddingTop,
            content: before.content,
            increment: cs.counterIncrement,
            reset: getComputedStyle(el.parentElement!).counterReset,
            numColor: before.color,
            cursor: cs.cursor,
            transform: cs.transform,
          };
        }),
      );
      const pad = viewport.width >= 640 ? '32px' : '24px';
      styles.forEach((s, i) => {
        expect(s.bg).toBe(WHITE);
        expect(s.color).toBe(DARK);
        expect(s.borderWidth).toBe('3px');
        expect(s.borderColor).toBe(DARK);
        expect(s.radius).toBe('16px');
        expect(s.shadow).toBe(ORANGE_SHADOW);
        expect(s.padding).toBe(pad);
        // getComputedStyle no resuelve el valor de un contador: se comprueba la expresión con dos dígitos
        // y el contador (reset en la rejilla, incremento en cada tarjeta), que da 01, 02 y 03 en orden.
        expect(s.content).toBe('counter(pain, decimal-leading-zero)');
        expect(s.reset).toBe('pain 0');
        expect(s.increment).toBe('pain 1');
        void i;
        expect(s.numColor).toBe(PURPLE);
        expect(s.cursor).not.toBe('pointer');
        expect(s.transform).toBe('none');
      });
    });

    test('tres pegatinas distintas, decorativas y de 64 px', async ({ page }) => {
      await page.goto('/');
      const stickers = page.locator('#problema .pain-card svg[data-collage]');
      await expect(stickers).toHaveCount(3);
      const info = await stickers.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            piece: el.getAttribute('data-collage-piece'),
            aria: el.getAttribute('aria-hidden'),
            focusable: el.getAttribute('focusable'),
            w: r.width,
            h: r.height,
            title: el.querySelectorAll('title, text').length,
          };
        }),
      );
      expect(new Set(info.map((i) => i.piece)).size).toBe(3);
      expect(info.map((i) => i.piece)).toEqual(['sticker-clic', 'sticker-lupa', 'sticker-ojos']);
      for (const i of info) {
        expect(i.aria).toBe('true');
        expect(i.focusable).toBe('false');
        expect(i.title).toBe(0);
        expect(Math.abs(i.w - 64)).toBeLessThanOrEqual(1);
        expect(Math.abs(i.h - 64)).toBeLessThanOrEqual(1);
      }
    });

    test('la frase final va en Title 700, 48 px bajo la rejilla', async ({ page }) => {
      await page.goto('/');
      const closing = page.locator('#problema .pain-closing');
      expect(norm((await closing.textContent()) ?? '')).toBe(norm(es.problem.closing.text));
      expect(await closing.evaluate((el) => getComputedStyle(el).fontWeight)).toBe('700');
      const grid = (await boxes(page, '#problema .pain-grid'))[0];
      const c = (await boxes(page, '#problema .pain-closing'))[0];
      expect(Math.abs(c.y - (grid.y + grid.height) - 48)).toBeLessThanOrEqual(2);
    });

    test('Por qué ahora: una fila por afirmación con reglas de 3 px y peso 600', async ({ page }) => {
      await page.goto('/');
      const rows = page.locator('#por-que-ahora .whynow-list > li');
      await expect(rows).toHaveCount(es.why_now.items.length);
      const info = await rows.evaluateAll((els) =>
        els.map((el) => {
          const cs = getComputedStyle(el);
          return {
            text: el.textContent ?? '',
            weight: cs.fontWeight,
            top: `${cs.borderTopWidth} ${cs.borderTopColor}`,
            bottom: cs.borderBottomWidth,
            pad: cs.paddingTop,
            cursor: cs.cursor,
            transform: cs.transform,
          };
        }),
      );
      info.forEach((r, i) => {
        expect(norm(r.text)).toBe(norm(es.why_now.items[i].text));
        expect(r.weight).toBe('600');
        expect(r.top).toBe(`3px ${DARK}`);
        expect(r.bottom).toBe(i === info.length - 1 ? '3px' : '0px');
        expect(r.pad).toBe(viewport.width >= 640 ? '24px' : '16px');
        expect(r.cursor).not.toBe('pointer');
        expect(r.transform).toBe('none');
      });
    });

    test('collage compacto: 160 px, dos piezas dentro de su caja y sin cruzar el h2 ni la lista', async ({ page }) => {
      await page.goto('/');
      const art = (await boxes(page, '#por-que-ahora .whynow-art'))[0];
      expect(Math.abs(art.width - 160)).toBeLessThanOrEqual(1);
      const pieces = await page.locator('#por-que-ahora .whynow-art svg[data-collage-piece]').evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { piece: el.getAttribute('data-collage-piece'), x: r.x, y: r.y + window.scrollY, w: r.width, h: r.height };
        }),
      );
      expect(pieces.map((p) => p.piece).sort()).toEqual(['lupa', 'ojos-abajo']);
      for (const p of pieces) {
        expect(p.x).toBeGreaterThanOrEqual(art.x - 1);
        expect(p.y).toBeGreaterThanOrEqual(art.y - 1);
        expect(p.x + p.w).toBeLessThanOrEqual(art.x + art.width + 1);
        expect(p.y + p.h).toBeLessThanOrEqual(art.y + art.height + 1);
      }
      const h2 = (await boxes(page, '#por-que-ahora h2'))[0];
      const list = (await boxes(page, '#por-que-ahora .whynow-list'))[0];
      const overlaps = (a: Box, b: Box) =>
        a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
      expect(overlaps(art, h2)).toBe(false);
      expect(overlaps(art, list)).toBe(false);
      if (wide) {
        expect(art.x + art.width).toBeLessThanOrEqual(list.x + 1);
        expect(Math.abs(art.x - h2.x)).toBeLessThanOrEqual(1);
      } else {
        expect(h2.y + h2.height).toBeLessThanOrEqual(art.y + 1);
        expect(art.y + art.height).toBeLessThanOrEqual(list.y + 1);
      }
    });

    test('ni #problema ni #por-que-ahora traen enlaces ni la marca de dato faltante', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#problema a, #por-que-ahora a')).toHaveCount(0);
      const txt = await page.evaluate(() => (document.getElementById('problema')?.innerText ?? '') + (document.getElementById('por-que-ahora')?.innerText ?? ''));
      expect(txt).not.toContain(MISSING_MARK);
      await page.locator('#problema .pain-card').first().hover();
      const t = await page.locator('#problema .pain-card').first().evaluate((el) => getComputedStyle(el).transform);
      expect(t).toBe('none');
    });
  });
}
