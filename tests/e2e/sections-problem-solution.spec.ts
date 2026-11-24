import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { walkClaims, MISSING_MARK } from '../../scripts/lib/copy-rules.mjs';
import { PURPLE_RGB, rgbOfToken } from './lib/brand';
import { expectMotionWithinBudget, expectNoMotion } from './lib/motion';

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
const PURPLE = PURPLE_RGB;

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
      // Tras la ronda 2 no queda ninguna sección en tono amarillo: Por qué ahora pasó a `light`.
      await expect(page.locator('#por-que-ahora')).toHaveAttribute('data-tone', 'light');
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

    // Tras la ronda 2, #problema son tres columnas sin caja (`.blocker-col`): pegatina, h3 fijo y texto del YAML.
    test('tres columnas de bloqueadores con el texto del YAML, en orden y con el mismo tamaño en fila', async ({ page }) => {
      await page.goto('/');
      const cols = page.locator('#problema .blocker-col');
      await expect(cols).toHaveCount(es.problem.items.length);
      for (let i = 0; i < es.problem.items.length; i++) {
        expect(norm((await cols.nth(i).locator('.blocker-text').textContent()) ?? '')).toBe(norm(es.problem.items[i].text));
      }
      const b = await boxes(page, '#problema .blocker-col');
      if (viewport.width >= 768) {
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

    test('cada columna: centrada, sin caja ni hover, h3 en Title 700 blanco y texto de 15 px', async ({ page }) => {
      await page.goto('/');
      const styles = await page.locator('#problema .blocker-col').evaluateAll((els) =>
        els.map((el) => {
          const cs = getComputedStyle(el);
          const h3 = el.querySelector('h3')!;
          const text = el.querySelector('.blocker-text')!;
          return {
            align: cs.textAlign,
            borderWidth: cs.borderTopWidth,
            cursor: cs.cursor,
            transform: cs.transform,
            h3Count: el.querySelectorAll('h3').length,
            h3Weight: getComputedStyle(h3).fontWeight,
            h3Color: getComputedStyle(h3).color,
            h3Size: parseFloat(getComputedStyle(h3).fontSize),
            textSize: getComputedStyle(text).fontSize,
          };
        }),
      );
      expect(styles).toHaveLength(es.problem.items.length);
      for (const s of styles) {
        expect(s.align).toBe('center');
        expect(s.borderWidth).toBe('0px');
        expect(s.cursor).not.toBe('pointer');
        expect(s.transform).toBe('none');
        expect(s.h3Count).toBe(1);
        expect(s.h3Weight).toBe('700');
        expect(s.h3Color).toBe(WHITE);
        expect(s.h3Size).toBeGreaterThanOrEqual(20);
        expect(s.h3Size).toBeLessThanOrEqual(24);
        expect(s.textSize).toBe('15px');
      }
    });

    test('tres pegatinas distintas, decorativas y de 96 x 80 px', async ({ page }) => {
      await page.goto('/');
      const stickers = page.locator('#problema .blocker-col [data-collage="sticker"]');
      await expect(stickers).toHaveCount(3);
      const info = await stickers.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            piece: el.getAttribute('data-collage-piece'),
            aria: el.getAttribute('aria-hidden'),
            focusable: el.querySelectorAll('a[href], button, input, select, textarea, [tabindex]').length,
            w: r.width,
            h: r.height,
            title: el.querySelectorAll('title, text').length,
          };
        }),
      );
      expect(new Set(info.map((i) => i.piece)).size).toBe(3);
      expect(info.map((i) => i.piece)).toEqual(['sticker-lupa', 'sticker-clic', 'sticker-ojos']);
      for (const i of info) {
        expect(i.aria).toBe('true');
        expect(i.focusable).toBe(0);
        expect(i.title).toBe(0);
        expect(Math.abs(i.w - 96)).toBeLessThanOrEqual(1);
        expect(Math.abs(i.h - 80)).toBeLessThanOrEqual(1);
      }
    });

    test('la frase final va en el recuadro, en Title 700, con borde de 3 px y 56 px bajo las columnas', async ({ page }) => {
      await page.goto('/');
      const closing = page.locator('#problema .blocker-callout-text');
      expect(norm((await closing.textContent()) ?? '')).toBe(norm(es.problem.closing.text));
      expect(await closing.evaluate((el) => getComputedStyle(el).fontWeight)).toBe('700');
      await expect(page.locator('#problema .blocker-callout')).toHaveCSS('border-top-width', '3px');
      const grid = (await boxes(page, '#problema .blocker-grid'))[0];
      const c = (await boxes(page, '#problema .blocker-callout'))[0];
      expect(Math.abs(c.y - (grid.y + grid.height) - 56)).toBeLessThanOrEqual(2);
    });

    // Por qué ahora (ronda 2): dos cajas (Google y asistentes de IA), un banner morado y una píldora final. Entre las
    // cuatro piezas salen las seis afirmaciones del YAML, en este orden de lectura.
    test('Por qué ahora: dos cajas, banner y píldora con las seis afirmaciones del YAML y sombra dura', async ({ page }) => {
      await page.goto('/');
      const wn = es.why_now.items;
      const read = async (sel: string) => norm((await page.locator(`#por-que-ahora ${sel}`).textContent()) ?? '');
      expect(await read('.whynow-box--google .box-lead')).toBe(norm(wn[0].text));
      expect(await read('.whynow-box--ai .box-lead')).toBe(norm(wn[1].text));
      expect(await read('.banner-title')).toBe(norm(wn[2].text));
      expect(await read('.whynow-box--google .box-note')).toBe(norm(wn[3].text));
      expect(await read('.banner-text')).toBe(norm(wn[4].text));
      expect(await read('.action-pill')).toBe(norm(wn[5].text));
      for (const sel of ['.whynow-box--google', '.whynow-box--ai', '.whynow-banner', '.action-pill']) {
        const st = await page.locator(`#por-que-ahora ${sel}`).evaluate((el) => {
          const cs = getComputedStyle(el);
          return { bw: cs.borderTopWidth, bc: cs.borderTopColor, shadow: cs.boxShadow, cursor: cs.cursor, transform: cs.transform };
        });
        expect(st.bw, sel).toBe('3px');
        expect(st.bc, sel).toBe(DARK);
        expect(st.shadow, sel).toBe('rgb(33, 33, 33) 4px 4px 0px 0px');
        expect(st.cursor, sel).not.toBe('pointer');
        expect(st.transform, sel).toBe('none');
      }
      const lead = await page.locator('#por-que-ahora .box-lead').first().evaluate((el) => getComputedStyle(el).fontWeight);
      expect(lead).toBe('600');
    });

    test('Por qué ahora: las dos cajas van en fila desde 768 px y apiladas debajo; el banner ocupa todo el ancho', async ({ page }) => {
      await page.goto('/');
      const [g, a] = await boxes(page, '#por-que-ahora .whynow-box');
      const banner = (await boxes(page, '#por-que-ahora .whynow-banner'))[0];
      const cols = (await boxes(page, '#por-que-ahora .whynow-cols'))[0];
      if (viewport.width >= 768) {
        expect(Math.abs(g.y - a.y)).toBeLessThanOrEqual(1);
        expect(a.x).toBeGreaterThan(g.x + g.width - 1);
        expect(Math.abs(g.height - a.height)).toBeLessThanOrEqual(1);
      } else {
        expect(Math.abs(g.x - a.x)).toBeLessThanOrEqual(1);
        expect(a.y).toBeGreaterThan(g.y + g.height - 1);
      }
      expect(Math.abs(banner.x - cols.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(banner.width - cols.width)).toBeLessThanOrEqual(1);
      expect(banner.y).toBeGreaterThan(cols.y + cols.height - 1);
    });

    // El collage de Por qué ahora ya no se ve: la escena se conserva oculta (`.whynow-preserve`, display: none y
    // aria-hidden) con su ranura de foto, para no perder el contrato accesible si vuelve a mostrarse.
    test('collage de Por qué ahora: escena conservada, oculta y decorativa con su ranura de foto', async ({ page }) => {
      await page.goto('/');
      const keep = page.locator('#por-que-ahora .whynow-preserve');
      await expect(keep).toHaveCount(1);
      await expect(keep).toBeHidden();
      await expect(keep).toHaveAttribute('aria-hidden', 'true');
      const root = keep.locator('[data-collage="whynow"]');
      await expect(root).toHaveCount(1);
      await expect(root).toHaveAttribute('aria-hidden', 'true');
      await expect(root.locator('[data-photo-slot="whynow"]')).toHaveCount(1);
      await expect(page.locator('#por-que-ahora [data-collage="whynow"]:visible')).toHaveCount(0);
    });

    test('ni #problema ni #por-que-ahora traen enlaces ni la marca de dato faltante', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#problema a, #por-que-ahora a')).toHaveCount(0);
      const txt = await page.evaluate(() => (document.getElementById('problema')?.innerText ?? '') + (document.getElementById('por-que-ahora')?.innerText ?? ''));
      expect(txt).not.toContain(MISSING_MARK);
      await page.locator('#problema .blocker-col').first().hover();
      const t = await page.locator('#problema .blocker-col').first().evaluate((el) => getComputedStyle(el).transform);
      expect(t).toBe('none');
    });
  });
}

const SOFT_SHADOW = 'rgb(33, 33, 33) 4px 4px 0px 0px';
const CREAM = rgbOfToken('cream');

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
]) {
  test.describe(`La solución a ${viewport.width} px`, () => {
    test.use({ viewport });
    const wide = viewport.width >= 1024;

    test('cuatro pilares en orden con h3 y cuerpo; la lista del equipo ya no va en los pilares', async ({ page }) => {
      await page.goto('/');
      const cards = page.locator('#solucion .pillar-card');
      await expect(cards).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        const item = es.solution.items[i];
        const card = cards.nth(i);
        expect(norm((await card.locator('h3').textContent()) ?? '')).toBe(norm(item.title.text));
        expect(norm((await card.locator(':scope > p').textContent()) ?? '')).toBe(norm(item.body.text));
        // Tras la ronda 2 Solution.astro no pasa `list` a PillarCard: el equipo vive en #nosotros.
        await expect(card.locator('ul.pillar-team')).toHaveCount(0);
      }
      await expect(page.locator('#solucion .pillar-team')).toHaveCount(0);
      // El conteo de marcas bajo `solution` sale del YAML (el h2 y el cuerpo del Pilar 4).
      const shown = await page.evaluate(
        (mark) => (document.getElementById('solucion')?.innerText ?? '').split(mark).length - 1,
        MISSING_MARK,
      );
      expect(shown).toBe(marksUnder('solution'));
    });

    test('cuatro chips distintos, decorativos y de 96 x 80 px; h3 a 16 px y cuerpo a 8 px', async ({ page }) => {
      await page.goto('/');
      const chips = page.locator('#solucion [data-collage="chip"]');
      await expect(chips).toHaveCount(4);
      const info = await chips.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            piece: el.getAttribute('data-collage-piece'),
            aria: el.getAttribute('aria-hidden'),
            focusable: el.querySelectorAll('a[href], button, input, select, textarea, [tabindex]').length,
            w: r.width,
            h: r.height,
            bottom: r.bottom,
            extra: el.querySelectorAll('title, text').length,
          };
        }),
      );
      expect(info.map((i) => i.piece)).toEqual(['chip-lupa', 'chip-ojos', 'chip-loop', 'chip-clic']);
      for (const i of info) {
        expect(i.aria).toBe('true');
        expect(i.focusable).toBe(0);
        expect(i.extra).toBe(0);
        expect(Math.abs(i.w - 96)).toBeLessThanOrEqual(1);
        expect(Math.abs(i.h - 80)).toBeLessThanOrEqual(1);
      }
      const gaps = await page.locator('#solucion .pillar-card').evaluateAll((els) =>
        els.map((el) => {
          const chip = el.querySelector(':scope > [data-collage="chip"]')!.getBoundingClientRect();
          const h3 = el.querySelector('h3')!.getBoundingClientRect();
          const p = el.querySelector(':scope > p')!.getBoundingClientRect();
          return { chipToH3: h3.top - chip.bottom, h3ToP: p.top - h3.bottom };
        }),
      );
      for (const g of gaps) {
        expect(Math.abs(g.chipToH3 - 16)).toBeLessThanOrEqual(2);
        expect(Math.abs(g.h3ToP - 8)).toBeLessThanOrEqual(2);
      }
    });

    test('cada tarjeta: fondo blanco, borde 3 px, radio 16, sombra dura, padding y h3 en Title 700', async ({ page }) => {
      await page.goto('/');
      const styles = await page.locator('#solucion .pillar-card').evaluateAll((els) =>
        els.map((el) => {
          const cs = getComputedStyle(el);
          const h3 = getComputedStyle(el.querySelector('h3')!);
          return {
            bg: cs.backgroundColor,
            bw: cs.borderTopWidth,
            bc: cs.borderTopColor,
            radius: cs.borderTopLeftRadius,
            shadow: cs.boxShadow,
            pad: cs.paddingTop,
            display: cs.display,
            dir: cs.flexDirection,
            cursor: cs.cursor,
            transform: cs.transform,
            h3Weight: h3.fontWeight,
            h3Color: h3.color,
            h3Size: parseFloat(h3.fontSize),
          };
        }),
      );
      expect(styles).toHaveLength(4);
      styles.forEach((s, i) => {
        // Ritmo en tablero: blanco en las tarjetas 1 y 3 y crema en la 2 y la 4.
        expect(s.bg).toBe(i % 2 === 0 ? WHITE : CREAM);
        expect(s.bw).toBe('3px');
        expect(s.bc).toBe(DARK);
        expect(s.radius).toBe('16px');
        expect(s.shadow).toBe(SOFT_SHADOW);
        expect(s.pad).toBe(viewport.width >= 640 ? '32px' : '24px');
        expect(s.display).toBe('flex');
        expect(s.dir).toBe('column');
        expect(s.cursor).not.toBe('pointer');
        expect(s.transform).toBe('none');
        expect(s.h3Weight).toBe('700');
        expect(s.h3Color).toBe(DARK);
        expect(s.h3Size).toBeGreaterThanOrEqual(20);
        expect(s.h3Size).toBeLessThanOrEqual(24);
      });
    });

    test('rejilla de pilares: una columna en móvil y dos en escritorio con alto parejo por fila', async ({ page }) => {
      await page.goto('/');
      const b = await boxes(page, '#solucion .pillar-card');
      if (wide) {
        expect(Math.abs(b[0].y - b[1].y)).toBeLessThanOrEqual(1);
        expect(Math.abs(b[2].y - b[3].y)).toBeLessThanOrEqual(1);
        expect(Math.abs(b[0].height - b[1].height)).toBeLessThanOrEqual(1);
        expect(Math.abs(b[2].height - b[3].height)).toBeLessThanOrEqual(1);
        expect(b[1].x).toBeGreaterThan(b[0].x + b[0].width - 1);
      } else {
        for (const box of b) expect(Math.abs(box.x - b[0].x)).toBeLessThanOrEqual(1);
      }
    });

    test('el CTA queda a 48 px bajo la rejilla y centrado respecto a ella', async ({ page }) => {
      await page.goto('/');
      const grid = (await boxes(page, '#solucion .pillar-grid'))[0];
      const cta = (await boxes(page, '#solucion a[data-cta="solucion"]'))[0];
      expect(Math.abs(cta.y - (grid.y + grid.height) - 48)).toBeLessThanOrEqual(2);
      expect(Math.abs(cta.x + cta.width / 2 - (grid.x + grid.width / 2))).toBeLessThanOrEqual(1.5);
    });
  });
}

// ---------------------------------------------------------------------------------------------
// Tarea 4 (lote B): matriz de cinco anchos, ritmo de 64 y 96 px, espaciado de texto (SC 1.4.12),
// cero animaciones, sin JavaScript y herramienta de capturas. Todo se mide con el DOM real.
// ---------------------------------------------------------------------------------------------
const SECTION_IDS = ['problema', 'por-que-ahora', 'solucion'] as const;
const MATRIX = [320, 390, 768, 1024, 1280];

const overlapsBox = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

for (const width of MATRIX) {
  test.describe(`matriz de anchos: ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('columnas esperadas, sin scroll horizontal y nada fuera del viewport', async ({ page }) => {
      await page.goto('/');

      // Bloqueadores: 3 columnas desde 768 px y 1 debajo.
      const pain = await boxes(page, '#problema .blocker-col');
      const painCols = new Set(pain.map((b) => Math.round(b.x))).size;
      expect(painCols).toBe(width >= 768 ? 3 : 1);

      // Pilares: 2 columnas desde 640 px y 1 debajo.
      const pillars = await boxes(page, '#solucion .pillar-card');
      const pillarCols = new Set(pillars.map((b) => Math.round(b.x))).size;
      expect(pillarCols).toBe(width >= 640 ? 2 : 1);

      // Por qué ahora: las dos cajas en dos columnas desde 768 px y apiladas debajo; ninguna pieza se cruza.
      const whyBoxes = await boxes(page, '#por-que-ahora .whynow-box');
      const whyCols = new Set(whyBoxes.map((b) => Math.round(b.x))).size;
      expect(whyCols).toBe(width >= 768 ? 2 : 1);
      const whyAll = await boxes(page, '#por-que-ahora .whynow-box, #por-que-ahora .whynow-banner, #por-que-ahora .action-pill');
      for (let i = 0; i < whyAll.length; i++) {
        for (let j = i + 1; j < whyAll.length; j++) expect(overlapsBox(whyAll[i], whyAll[j]), `piezas ${i} y ${j}`).toBe(false);
      }

      const inner = await page.evaluate(() => window.innerWidth);
      const scroll = await page.evaluate((ids) => ids.map((id) => document.getElementById(id)!.scrollWidth), [
        ...SECTION_IDS,
      ]);
      for (const sw of scroll) expect(sw).toBeLessThanOrEqual(inner);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(inner);

      const all = [
        ...pain,
        ...pillars,
        ...whyAll,
      ];
      for (const b of all) {
        expect(b.x).toBeGreaterThanOrEqual(-0.5);
        expect(b.x + b.width).toBeLessThanOrEqual(inner + 0.5);
      }
    });

    test('ritmo vertical: 64 px bajo 1024 px y 96 px desde 1024 px', async ({ page }) => {
      await page.goto('/');
      const expected = width >= 1024 ? '96px' : '64px';
      for (const id of SECTION_IDS) {
        const pad = await page
          .locator(`#${id}`)
          .evaluate((el) => [getComputedStyle(el).paddingTop, getComputedStyle(el).paddingBottom]);
        expect(pad, `#${id}`).toEqual([expected, expected]);
      }
    });
  });
}

test.describe('espaciado de texto (SC 1.4.12) a 320 px', () => {
  test.use({ viewport: { width: 320, height: 800 } });

  test('con interlineado 1.5, letras 0.12em, palabras 0.16em y párrafos 2em nada se recorta ni desborda', async ({
    page,
  }) => {
    await page.goto('/');
    await page.addStyleTag({
      content: `*{line-height:1.5 !important;letter-spacing:0.12em !important;word-spacing:0.16em !important}
p{margin-bottom:2em !important}`,
    });
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll('.blocker-col, .blocker-callout, .pillar-card, .whynow-box, .whynow-banner, .action-pill')]
        .filter((el) => el.scrollHeight > el.clientHeight + 1)
        .map((el) => `${el.className || el.tagName}: ${el.scrollHeight}>${el.clientHeight}`),
    );
    expect(clipped).toEqual([]);
    const inner = await page.evaluate(() => window.innerWidth);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(inner);
    for (const id of SECTION_IDS) {
      expect(await page.evaluate((i) => document.getElementById(i)!.scrollWidth, id)).toBeLessThanOrEqual(inner);
    }
  });
});

test.describe('sin movimiento y sin JavaScript', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    test(`document.getAnimations().length es 0 con ${reducedMotion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto('/');
      await page.locator('#problema').scrollIntoViewIfNeeded();
      if (reducedMotion === 'reduce') await expectNoMotion(page);
      else await expectMotionWithinBudget(page);
    });
  }

  test.describe('con JavaScript desactivado', () => {
    test.use({ javaScriptEnabled: false });

    test('las tres secciones y el CTA solucion se ven', async ({ page }) => {
      await page.goto('/');
      for (const id of SECTION_IDS) await expect(page.locator(`#${id}`)).toBeVisible();
      await expect(page.locator('#problema .blocker-col')).toHaveCount(es.problem.items.length);
      await expect(page.locator('#solucion .pillar-card')).toHaveCount(4);
      await expect(page.locator('a[data-cta="solucion"]')).toBeVisible();
    });
  });
});

// Herramienta de capturas del lote (solo con PHASE2_BATCH definida, p. ej. PHASE2_BATCH=B): las tres
// secciones a 390 y 1280 px con todo lo que no es localhost abortado (ClickUp incluido).
test.describe('captura de secciones del lote', () => {
  test.skip(!process.env.PHASE2_BATCH, 'define PHASE2_BATCH (p. ej. B) para generar capturas de sección');
  for (const width of [390, 1280]) {
    test(`captura de las tres secciones a ${width} px`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, viewport: { width, height: 800 } });
      await context.route('**/*', (route) => {
        const host = new URL(route.request().url()).hostname;
        return host === 'localhost' || host === '127.0.0.1' ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      await page.goto('/');
      for (const id of SECTION_IDS) {
        await page.locator(`#${id}`).screenshot({
          path: `test-results/phase2/${process.env.PHASE2_BATCH}-${id}-${width}.png`,
        });
      }
      await context.close();
    });
  }
});
