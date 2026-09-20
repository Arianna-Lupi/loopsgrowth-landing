import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Cierre de la fase 2 (plan 02-07). 02-08 extiende este archivo. El texto esperado del CTA sale
// del YAML: nunca una cadena escrita a mano (COPY-01).
type Claim = { text: string };
const es = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: { call: { duration: Claim }; cta: { label_template: Claim } };
}).es;
const CTA_LABEL = es.cta.label_template.text.replaceAll('{duration}', es.call.duration.text);

test.describe('conexiones de fase', () => {
  for (const path of ['/', '/privacidad/']) {
    test.describe(`en ${path}`, () => {
      test('dos enlaces de favicon y cada archivo responde 200 con su tipo y cuerpo', async ({ page }) => {
        await page.goto(path);
        const icons = await page
          .locator('head link[rel="icon"]')
          .evaluateAll((els) => els.map((el) => ({ href: el.getAttribute('href') ?? '', type: el.getAttribute('type') })));
        expect(icons.map((i) => i.href).sort()).toEqual(['/favicon.ico', '/favicon.svg']);
        expect(icons.find((i) => i.href === '/favicon.svg')?.type).toBe('image/svg+xml');
        for (const { href } of icons) {
          const res = await page.request.get(href);
          expect(res.status(), href).toBe(200);
          const contentType = res.headers()['content-type'] ?? '';
          if (href.endsWith('.svg')) expect(contentType, href).toContain('image/svg+xml');
          else expect(contentType, href).toMatch(/image\/(x-icon|vnd\.microsoft\.icon)/);
          expect((await res.body()).length, `${href} vacío`).toBeGreaterThan(0);
        }
      });

      test('un solo sprite y todo use con href a un id del mismo documento se resuelve', async ({ page }) => {
        await page.goto(path);
        await expect(page.locator('svg.collage-sprite')).toHaveCount(1);
        const ids = await page.locator('svg.collage-sprite symbol').evaluateAll((els) => els.map((el) => el.id));
        expect(ids).toHaveLength(8);
        expect(ids.every((id) => id.startsWith('lg-'))).toBe(true);
        const refs = await page
          .locator('use[href^="#"]')
          .evaluateAll((els) => els.map((el) => (el.getAttribute('href') ?? '').slice(1)));
        const missing = await page.evaluate(
          (targets) => targets.filter((id) => !document.getElementById(id)),
          refs,
        );
        expect(missing, `use sin destino: ${missing.join(', ')}`).toEqual([]);
      });
    });
  }

  test('en / hay 1 collage del hero, 1 de #agenda y 4 avatares', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-collage="hero"]')).toHaveCount(1);
    await expect(page.locator('div[data-collage="hero"]')).toHaveCount(1);
    await expect(page.locator('[data-collage="agenda"]')).toHaveCount(1);
    await expect(page.locator('#agenda div[data-collage="agenda"]')).toHaveCount(1);
    await expect(page.locator('svg[data-collage="avatar"]')).toHaveCount(4);
  });

  test('en / hay 4 CTA a #agenda con el texto del YAML como nombre accesible', async ({ page }) => {
    await page.goto('/');
    const ctas = page.locator('a[data-cta]');
    await expect(ctas).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const cta = ctas.nth(i);
      await expect(cta).toHaveAttribute('href', '#agenda');
      await expect(cta).toHaveText(CTA_LABEL);
      await expect(cta).not.toHaveAttribute('aria-label', /.*/);
    }
  });
});
