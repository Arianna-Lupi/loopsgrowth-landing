import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Quiénes somos, Qué incluye y Cómo funciona (plan 02-05). Los textos esperados salen del YAML y no
// se copian a mano (COPY-01): si Ari cambia una cadena, la prueba sigue midiendo lo que la página debe
// mostrar. Los espacios se normalizan porque el HTML colapsa los repetidos.
type Claim = { text: string; status: string };
const es = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    team: { title: Claim; members: { name: Claim; role: Claim }[] };
    includes: { title: Claim; items: { title: Claim; description: Claim }[] };
    how_it_works: { title: Claim; steps: { title: Claim; description: Claim; timeframe: Claim }[] };
  };
}).es;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

// Variantes de avatar que fija 02-10 (la asignación por posición vive en `AVATARS` de Team.astro).
const AVATAR_VARIANTS = ['ojo-morado', 'ojo-amarillo', 'ojos-morado', 'ojos-amarillo'];

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
  test.describe(`Quiénes somos a ${viewport.width} px`, () => {
    test.use({ viewport });

    test('la sección tiene su tono, su h2 del YAML y cuatro tarjetas en lista', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('main > section#nosotros');
      await expect(section).toHaveCount(1);
      await expect(section).toHaveAttribute('data-tone', 'yellow');
      const labelledby = await section.getAttribute('aria-labelledby');
      const h2 = section.locator('h2');
      await expect(h2).toHaveCount(1);
      await expect(h2).toHaveAttribute('id', labelledby ?? '');
      expect(norm((await h2.textContent()) ?? '')).toBe(norm(es.team.title.text));
      const list = section.locator('ul');
      await expect(list).toHaveCount(1);
      await expect(list).toHaveAttribute('role', 'list');
      await expect(list.locator('> li')).toHaveCount(4);
    });

    test('cuatro h3 con los nombres y cuatro cargos del YAML, en orden', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#nosotros');
      const names = (await section.locator('h3').allTextContents()).map(norm);
      expect(names).toEqual(es.team.members.map((m) => norm(m.name.text)));
      const roles = (await section.locator('p.team-role').allTextContents()).map(norm);
      expect(roles).toEqual(es.team.members.map((m) => norm(m.role.text)));
      // Sin biografía ni ningún otro párrafo (CONT-07).
      await expect(section.locator('p')).toHaveCount(4);
    });

    test('ningún enlace, botón ni tabindex dentro de la sección', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#nosotros a, #nosotros button, #nosotros [tabindex]')).toHaveCount(0);
    });

    test('cuatro avatares Loopy decorativos, distintos y del mismo tamaño', async ({ page }) => {
      await page.goto('/');
      const cards = page.locator('#nosotros li.team-card');
      await expect(cards).toHaveCount(4);
      const avatars = page.locator('#nosotros svg[data-collage="avatar"]');
      await expect(avatars).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        const svg = cards.nth(i).locator('svg[data-collage="avatar"]');
        await expect(svg).toHaveCount(1);
        await expect(svg).toHaveAttribute('aria-hidden', 'true');
        await expect(svg).toHaveAttribute('focusable', 'false');
        await expect(svg.locator('title')).toHaveCount(0);
        await expect(svg.locator('text')).toHaveCount(0);
        await expect(svg.locator('[data-pill]')).toHaveCount(0);
      }
      const variants = await avatars.evaluateAll((els) => els.map((el) => el.getAttribute('data-variant')));
      expect([...variants].sort()).toEqual([...AVATAR_VARIANTS].sort());
      expect(new Set(variants).size).toBe(4);
      const bytes = await avatars.evaluateAll((els) =>
        els.map((el) => new TextEncoder().encode(el.outerHTML).length),
      );
      for (const n of bytes) expect(n).toBeLessThanOrEqual(2560);
      const widths = (await boxes(page, '#nosotros svg[data-collage="avatar"]')).map((b) => Math.round(b.width));
      expect(new Set(widths).size).toBe(1);
      expect(widths[0]).toBe(viewport.width >= 640 ? 120 : 96);
    });

    test('jerarquía de encabezados y sin scroll horizontal', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toHaveCount(1);
      const order = await page.locator('main h1, main h2, main h3').evaluateAll((els) =>
        els.map((el) => ({ tag: el.tagName, section: el.closest('section')?.id ?? '' })),
      );
      let seenH2 = false;
      let seenSection = '';
      for (const h of order) {
        if (h.tag === 'H2') {
          seenH2 = true;
          seenSection = h.section;
        }
        if (h.tag === 'H3') {
          expect(seenH2, 'h3 sin h2 antes').toBe(true);
          expect(h.section, 'h3 dentro de la sección de su h2').toBe(seenSection);
        }
      }
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  });
}

// Columnas por ancho: distintas posiciones `left` (o `top`) entre los elementos de una lista.
const distinct = (values: number[], tol = 1) => {
  const out: number[] = [];
  for (const v of [...values].sort((a, b) => a - b)) if (!out.length || v - out[out.length - 1] > tol) out.push(v);
  return out;
};

const INCLUDE_COLS: [number, number][] = [
  [320, 1],
  [390, 1],
  [768, 2],
  [1024, 3],
  [1280, 3],
];

for (const [width, cols] of INCLUDE_COLS) {
  test.describe(`Qué incluye a ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test(`seis entregables en ${cols} columna(s), sin scroll horizontal`, async ({ page }) => {
      await page.goto('/');
      const items = await boxes(page, '#incluye li.include-item');
      expect(items).toHaveLength(6);
      expect(distinct(items.map((b) => b.x)).length).toBe(cols);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  });
}

test.describe('Qué incluye (estructura)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('tono, h2 del YAML y seis li en lista con h3 y descripción del YAML en orden', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('main > section#incluye');
    await expect(section).toHaveCount(1);
    await expect(section).toHaveAttribute('data-tone', 'light');
    const labelledby = await section.getAttribute('aria-labelledby');
    const h2 = section.locator('h2');
    await expect(h2).toHaveCount(1);
    await expect(h2).toHaveAttribute('id', labelledby ?? '');
    expect(norm((await h2.textContent()) ?? '')).toBe(norm(es.includes.title.text));
    const list = section.locator('ul');
    await expect(list).toHaveCount(1);
    await expect(list).toHaveAttribute('role', 'list');
    await expect(list.locator('> li.include-item')).toHaveCount(6);
    const titles = (await section.locator('h3').allTextContents()).map(norm);
    expect(titles).toEqual(es.includes.items.map((it) => norm(it.title.text)));
    const descs = (await section.locator('p.include-desc').allTextContents()).map(norm);
    expect(descs).toEqual(es.includes.items.map((it) => norm(it.description.text)));
  });

  test('el primer entregable muestra FALTA CONFIRMAR y el texto con AEO no llega a la página', async ({ page }) => {
    await page.goto('/');
    expect(es.includes.items[0].title.text).toBe('FALTA CONFIRMAR');
    await expect(page.locator('#incluye h3').first()).toHaveText('FALTA CONFIRMAR');
    const html = await page.content();
    expect(html).not.toContain('Auditoría SEO + AEO completa');
  });

  test('un check SVG decorativo por entregable y ningún control interactivo', async ({ page }) => {
    await page.goto('/');
    const checks = page.locator('#incluye .include-check');
    await expect(checks).toHaveCount(6);
    await expect(page.locator('#incluye .include-check svg[aria-hidden="true"][focusable="false"]')).toHaveCount(6);
    await expect(page.locator('#incluye a, #incluye button, #incluye [tabindex]')).toHaveCount(0);
  });

  test('estilos calculados: borde superior oscuro de 3 px, sin sombra ni puntero; disco amarillo de 32 px', async ({
    page,
  }) => {
    await page.goto('/');
    const item = page.locator('#incluye li.include-item').first();
    const s = await item.evaluate((el) => {
      const c = getComputedStyle(el);
      return {
        w: c.borderTopWidth,
        style: c.borderTopStyle,
        color: c.borderTopColor,
        shadow: c.boxShadow,
        cursor: c.cursor,
      };
    });
    expect(s.w).toBe('3px');
    expect(s.style).toBe('solid');
    expect(s.color).toBe('rgb(33, 33, 33)');
    expect(s.shadow).toBe('none');
    expect(s.cursor).not.toBe('pointer');
    const check = page.locator('#incluye .include-check').first();
    const box = await check.boundingBox();
    expect(Math.abs((box?.width ?? 0) - 32)).toBeLessThanOrEqual(0.5);
    expect(Math.abs((box?.height ?? 0) - 32)).toBeLessThanOrEqual(0.5);
    expect(await check.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 198, 2)');
  });
});

for (const width of [320, 390, 768, 1024, 1280]) {
  test.describe(`Cómo funciona a ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('cuatro fases: en columna hasta 1023 px y en cuatro columnas con el mismo top desde 1024 px', async ({
      page,
    }) => {
      await page.goto('/');
      const steps = await boxes(page, '#como-funciona li.step');
      expect(steps).toHaveLength(4);
      for (const b of steps) expect(b.x + b.width).toBeLessThanOrEqual(width + 0.5);
      if (width >= 1024) {
        const tops = steps.map((b) => b.y);
        expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(1);
        const lefts = steps.map((b) => b.x);
        for (let i = 1; i < 4; i++) expect(lefts[i]).toBeGreaterThan(lefts[i - 1]);
      } else {
        const lefts = steps.map((b) => b.x);
        expect(Math.max(...lefts) - Math.min(...lefts)).toBeLessThanOrEqual(1);
        const tops = steps.map((b) => b.y);
        for (let i = 1; i < 4; i++) expect(tops[i]).toBeGreaterThan(tops[i - 1]);
      }
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    test('conector discontinuo naranja de 3 px, vertical bajo 1024 px y horizontal desde 1024 px', async ({ page }) => {
      await page.goto('/');
      const steps = page.locator('#como-funciona li.step');
      const first = await steps.first().evaluate((el) => {
        const c = getComputedStyle(el, '::after');
        return {
          leftStyle: c.borderLeftStyle,
          leftW: c.borderLeftWidth,
          leftColor: c.borderLeftColor,
          topStyle: c.borderTopStyle,
          topW: c.borderTopWidth,
          topColor: c.borderTopColor,
        };
      });
      if (width >= 1024) {
        expect(first.topStyle).toBe('dashed');
        expect(first.topW).toBe('3px');
        expect(first.topColor).toBe('rgb(253, 105, 56)');
      } else {
        expect(first.leftStyle).toBe('dashed');
        expect(first.leftW).toBe('3px');
        expect(first.leftColor).toBe('rgb(253, 105, 56)');
      }
      const last = await steps.last().evaluate((el) => getComputedStyle(el, '::after').content);
      expect(last).toBe('none');
    });
  });
}

test.describe('Cómo funciona (estructura)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('tono dark, h2 del YAML y ol de cuatro fases con h3, descripción y plazo del YAML en orden', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('main > section#como-funciona');
    await expect(section).toHaveCount(1);
    await expect(section).toHaveAttribute('data-tone', 'dark');
    const labelledby = await section.getAttribute('aria-labelledby');
    const h2 = section.locator('h2');
    await expect(h2).toHaveCount(1);
    await expect(h2).toHaveAttribute('id', labelledby ?? '');
    expect(norm((await h2.textContent()) ?? '')).toBe(norm(es.how_it_works.title.text));
    const list = section.locator('ol');
    await expect(list).toHaveCount(1);
    await expect(list).toHaveAttribute('role', 'list');
    await expect(list.locator('> li.step')).toHaveCount(4);
    const h3 = (await section.locator('h3').allTextContents()).map(norm);
    expect(h3).toEqual(es.how_it_works.steps.map((s) => norm(s.title.text)));
    const desc = (await section.locator('p.step-desc').allTextContents()).map(norm);
    expect(desc).toEqual(es.how_it_works.steps.map((s) => norm(s.description.text)));
    const time = (await section.locator('p.step-time').allTextContents()).map(norm);
    expect(time).toEqual(es.how_it_works.steps.map((s) => norm(s.timeframe.text)));
    await expect(page.locator('#como-funciona a, #como-funciona button, #como-funciona [tabindex]')).toHaveCount(0);
  });

  test('disco numerado de 48 px amarillo con número oscuro y chip de plazo amarillo', async ({ page }) => {
    await page.goto('/');
    const step = page.locator('#como-funciona li.step').first();
    const disc = await step.evaluate((el) => {
      const c = getComputedStyle(el, '::before');
      return { w: c.width, h: c.height, bg: c.backgroundColor, color: c.color, content: c.content };
    });
    expect(disc.w).toBe('48px');
    expect(disc.h).toBe('48px');
    expect(disc.bg).toBe('rgb(255, 198, 2)');
    expect(disc.color).toBe('rgb(33, 33, 33)');
    expect(disc.content).toMatch(/counter\(|"\d"/);
    const chip = await page.locator('#como-funciona p.step-time').first().evaluate((el) => {
      const c = getComputedStyle(el);
      return {
        color: c.color,
        borderW: c.borderTopWidth,
        maxW: c.maxWidth,
        wrap: c.overflowWrap,
        minH: parseFloat(c.minHeight),
      };
    });
    expect(chip.color).toBe('rgb(255, 198, 2)');
    expect(chip.borderW).toBe('3px');
    expect(chip.maxW).toBe('100%');
    expect(chip.wrap).toBe('anywhere');
    expect(chip.minH).toBeGreaterThanOrEqual(32);
  });
});
