import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Estructura de la página (fase 2, plan 01). Los textos esperados salen del YAML y no se copian
// a mano: se resuelven {term} y {duration} igual que `fill()` de src/lib/content.ts.
type Claim = { text: string };
const es = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    brand: { term: Claim };
    call: { duration: Claim };
    hero: { h1: Claim; subtitle: Claim; description: Claim[] };
  };
}).es;
const resolveText = (claim: Claim) =>
  claim.text.replaceAll('{term}', es.brand.term.text).replaceAll('{duration}', es.call.duration.text);

const H1_TEXT = resolveText(es.hero.h1);
const SUBTITLE_TEXT = resolveText(es.hero.subtitle);
const DESCRIPTION_TEXTS = es.hero.description.map(resolveText);

// Orden vertical del hero (desviación 1 del plan 02-01): h1, subtítulo, CTA y después la descripción.
const HERO_ORDER = ['h1', 'subtitle', 'cta', 'description'] as const;

const PURPLE = 'rgb(115, 24, 127)';

type Box = { top: number; bottom: number; left: number; right: number; width: number; height: number };

/** Rectángulo (getBoundingClientRect) de la primera coincidencia del selector, en px de la ventana. */
async function box(page: Page, selector: string): Promise<Box> {
  return page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
  });
}

const HERO_SELECTORS: Record<(typeof HERO_ORDER)[number], string> = {
  h1: '#inicio h1',
  subtitle: '#inicio .hero-sub',
  cta: '#inicio a[data-cta="hero"]',
  description: '#inicio .hero-desc',
};

const viewports = [
  { name: '1280 px', width: 1280, height: 800, sectionY: 96, heroTop: 64 },
  { name: '390 px', width: 390, height: 844, sectionY: 64, heroTop: 48 },
];

for (const vp of viewports) {
  test.describe(`hero y ritmo a ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('un solo h1 con el texto del YAML y color morado', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(H1_TEXT);
      await expect(page.locator('h1')).toHaveCSS('color', PURPLE);
    });

    test('subtítulo y los tres párrafos de la descripción salen del YAML, en orden', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#inicio .hero-sub')).toHaveText(SUBTITLE_TEXT);
      const paragraphs = page.locator('#inicio .hero-desc p');
      await expect(paragraphs).toHaveCount(3);
      expect(DESCRIPTION_TEXTS).toHaveLength(3);
      for (let i = 0; i < 3; i++) await expect(paragraphs.nth(i)).toHaveText(DESCRIPTION_TEXTS[i]);
    });

    test('el CTA del hero lleva #agenda, es visible y queda completo en el primer pantallazo', async ({
      page,
    }) => {
      await page.goto('/');
      const cta = page.locator('#inicio a[data-cta="hero"]');
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', '#agenda');
      const r = await box(page, HERO_SELECTORS.cta);
      expect(r.top).toBeGreaterThanOrEqual(0);
      expect(r.bottom).toBeLessThanOrEqual(vp.height);
      expect(r.left).toBeGreaterThanOrEqual(0);
      expect(r.right).toBeLessThanOrEqual(vp.width);
    });

    test('orden vertical del hero: h1, subtítulo, CTA, descripción', async ({ page }) => {
      await page.goto('/');
      const tops: number[] = [];
      for (const key of HERO_ORDER) tops.push((await box(page, HERO_SELECTORS[key])).top);
      const sorted = [...tops].sort((a, b) => a - b);
      expect(tops).toEqual(sorted);
    });

    test(`padding de #inicio (arriba ${vp.heroTop} px, abajo ${vp.sectionY} px) y de #agenda (${vp.sectionY} px)`, async ({
      page,
    }) => {
      await page.goto('/');
      await expect(page.locator('#inicio')).toHaveCSS('padding-top', `${vp.heroTop}px`);
      await expect(page.locator('#inicio')).toHaveCSS('padding-bottom', `${vp.sectionY}px`);
      await expect(page.locator('#agenda')).toHaveCSS('padding-top', `${vp.sectionY}px`);
      await expect(page.locator('#agenda')).toHaveCSS('padding-bottom', `${vp.sectionY}px`);
    });

    test('el h2 de #agenda sigue en blanco sobre el tono morado', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#agenda-title')).toHaveCSS('color', 'rgb(255, 255, 255)');
    });
  });
}
