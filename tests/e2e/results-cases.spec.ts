import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Los textos esperados salen del YAML: nunca cadenas escritas a mano (COPY-01). Los espacios se
// normalizan al comparar porque el HTML colapsa los espacios repetidos.
type Claim = { text: string; status: string };
const doc = parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    results: { title: Claim; items: { lead: Claim; body: Claim }[] };
  };
};
const es = doc.es;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

// Colores de los pares medidos (tono dark: blanco sobre oscuro y amarillo solo en borde y disco).
const WHITE = 'rgb(255, 255, 255)';
const DARK = 'rgb(33, 33, 33)';
const YELLOW = 'rgb(255, 198, 2)';

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
  test.describe(`Lo que logramos juntos a ${viewport.width} px`, () => {
    test.use({ viewport });

    test('la sección tiene su tono, su h2 del YAML y ningún enfocable', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('main > section#resultados');
      await expect(section).toHaveCount(1);
      await expect(section).toHaveAttribute('data-tone', 'dark');
      expect(await section.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(DARK);

      const h2 = section.locator('h2');
      await expect(h2).toHaveCount(1);
      expect(norm((await h2.textContent()) ?? '')).toBe(norm(es.results.title.text));
      expect(await h2.evaluate((el) => getComputedStyle(el).color)).toBe(WHITE);
      const labelled = await section.getAttribute('aria-labelledby');
      expect(labelled).toBe(await h2.getAttribute('id'));

      await expect(section.locator('h3, a, button, [tabindex]')).toHaveCount(0);
    });

    test('cuatro resultados en el orden del YAML, con lead y cuerpo', async ({ page }) => {
      await page.goto('/');
      const list = page.locator('#resultados ul[role="list"]');
      await expect(list).toHaveCount(1);
      const items = list.locator('> li');
      await expect(items).toHaveCount(es.results.items.length);
      for (let i = 0; i < es.results.items.length; i++) {
        const item = items.nth(i);
        expect(norm((await item.locator('.result-lead').textContent()) ?? '')).toBe(
          norm(es.results.items[i].lead.text),
        );
        expect(norm((await item.locator('.result-body').textContent()) ?? '')).toBe(
          norm(es.results.items[i].body.text),
        );
      }
    });

    test('el rango de presupuesto de ads no se publica: ni 30 ni 50 por ciento', async ({ page }) => {
      await page.goto('/');
      const text = await page.locator('#resultados').evaluate((el) => (el as HTMLElement).innerText);
      expect(text).not.toMatch(/(^|[^\d.,])(30|50)\s?%/);
      expect(text).not.toMatch(/\[VERIFICAR/i);
    });

    test('cada resultado lleva borde amarillo de 3 px, lead 600, cuerpo 400 y un disco de 32 px', async ({
      page,
    }) => {
      await page.goto('/');
      const items = page.locator('#resultados ul[role="list"] > li');
      await expect(items).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        const item = items.nth(i);
        const style = await item.evaluate((el) => {
          const s = getComputedStyle(el);
          return {
            width: s.borderTopWidth,
            style: s.borderTopStyle,
            color: s.borderTopColor,
            bg: s.backgroundColor,
            shadow: s.boxShadow,
            cursor: s.cursor,
          };
        });
        expect(style.width).toBe('3px');
        expect(style.style).toBe('solid');
        expect(style.color).toBe(YELLOW);
        expect(style.bg).toBe('rgba(0, 0, 0, 0)');
        expect(style.shadow).toBe('none');
        expect(style.cursor).not.toBe('pointer');

        const lead = await item.locator('.result-lead').evaluate((el) => {
          const s = getComputedStyle(el);
          return { weight: s.fontWeight, color: s.color };
        });
        expect(lead.weight).toBe('600');
        expect(lead.color).toBe(WHITE);
        const body = await item.locator('.result-body').evaluate((el) => {
          const s = getComputedStyle(el);
          return { weight: s.fontWeight, color: s.color };
        });
        expect(body.weight).toBe('400');
        expect(body.color).toBe(WHITE);

        const svg = item.locator('svg');
        await expect(svg).toHaveCount(1);
        await expect(svg).toHaveAttribute('aria-hidden', 'true');
        await expect(svg).toHaveAttribute('focusable', 'false');
        await expect(svg.locator('title, text')).toHaveCount(0);
        const box = (await svg.boundingBox())!;
        expect(Math.abs(box.width - 32)).toBeLessThanOrEqual(1);
        expect(Math.abs(box.height - 32)).toBeLessThanOrEqual(1);
      }
    });

    test('la rejilla: una columna en móvil y 2x2 con alturas parejas en escritorio', async ({ page }) => {
      await page.goto('/');
      const r = await boxes(page, '#resultados ul[role="list"] > li');
      expect(r).toHaveLength(4);
      if (viewport.width < 640) {
        for (const b of r) expect(Math.abs(b.x - r[0].x)).toBeLessThanOrEqual(2);
      } else {
        expect(Math.abs(r[0].y - r[1].y)).toBeLessThanOrEqual(2);
        expect(Math.abs(r[2].y - r[3].y)).toBeLessThanOrEqual(2);
        expect(Math.abs(r[0].x - r[2].x)).toBeLessThanOrEqual(2);
        expect(r[1].x).toBeGreaterThan(r[0].x + r[0].width - 2);
        expect(Math.abs(r[0].height - r[1].height)).toBeLessThanOrEqual(1);
        expect(Math.abs(r[2].height - r[3].height)).toBeLessThanOrEqual(1);
      }
    });
  });
}

test.describe('sin movimiento en Lo que logramos juntos', () => {
  for (const motion of ['reduce', 'no-preference'] as const) {
    test(`cero animaciones y opacidad 1 con prefers-reduced-motion ${motion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto('/');
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
      const opacities = await page
        .locator('#resultados li')
        .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
      expect(opacities).toEqual(['1', '1', '1', '1']);
    });
  }
});
