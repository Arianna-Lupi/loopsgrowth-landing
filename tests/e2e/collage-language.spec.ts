import { test, expect, type Page } from '@playwright/test';
import { rgbOfToken } from './lib/brand';
import { CHIP_WORDS } from '../../src/components/collage/collage-rules.mjs';
import { PHOTO_SLOTS } from '../../src/components/collage/scenes.mjs';

// Lenguaje del moodboard sobre el HTML construido (plan 02-10): rasgos por estructura, píldoras
// decorativas, cajas, árbol de accesibilidad, ranuras de foto, ganchos, pesos y espaciado de texto.

const WORDS: string[] = CHIP_WORDS.map((w: { word: string }) => w.word);
const WIDTHS = [320, 390, 768, 1024, 1280];

/** Escenas de la página `/` que este spec revisa (selector de la raíz). */
const SCENES: Record<string, string> = { hero: '.hero-collage[data-collage="hero"]' };

async function open(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
}

test.describe('hero: lenguaje del moodboard', () => {
  test('rasgos por estructura: escenario, sombra, Loopy, garabato, retícula, píldora y ranura', async ({ page }) => {
    await open(page, 1280);
    const traits = await page.locator('.hero-collage [data-trait]').evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('data-trait')))].sort());
    expect(traits).toEqual(['doodle', 'dots', 'loopy', 'pill', 'shadow', 'slot', 'stage']);
  });

  test('paleta: aparecen el morado y el amarillo de marca', async ({ page }) => {
    await open(page, 1280);
    const fills = await page.locator('.hero-collage svg *').evaluateAll((els) => [...new Set(els.map((e) => getComputedStyle(e).fill))]);
    expect(fills).toContain(rgbOfToken('purple'));
    const strokes = await page.locator('.hero-collage svg *').evaluateAll((els) => [...new Set(els.flatMap((e) => [getComputedStyle(e).fill, getComputedStyle(e).stroke]))]);
    const pillBg = await page.locator('.hero-collage [data-pill]').evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundColor));
    expect([...strokes, ...pillBg]).toContain(rgbOfToken('yellow'));
  });

  test('píldoras: palabra de la lista, ocultas a tecnologías de asistencia y sin foco', async ({ page }) => {
    await open(page, 1280);
    const pills = await page.locator('.hero-collage [data-pill]').evaluateAll((els) =>
      els.map((e) => ({
        text: (e.textContent ?? '').trim(),
        word: e.getAttribute('data-pill'),
        hidden: !!e.closest('[aria-hidden="true"]'),
        tabindex: e.getAttribute('tabindex'),
        interactive: !!e.closest('a, button, input, select, textarea, [tabindex]:not(main)'),
        lang: e.getAttribute('lang'),
      })),
    );
    expect(pills.length).toBe(2);
    for (const p of pills) {
      expect(WORDS).toContain(p.text);
      expect(p.word).toBe(p.text);
      expect(p.hidden).toBe(true);
      expect(p.tabindex).toBeNull();
      expect(p.interactive).toBe(false);
      const entry = CHIP_WORDS.find((w: { word: string }) => w.word === p.text);
      if (entry.lang === 'en') expect(p.lang).toBe('en');
    }
  });

  for (const width of WIDTHS) {
    test(`caja: nada de lo pintado ni ninguna píldora sale de la raíz a ${width} px`, async ({ page }) => {
      await open(page, width);
      const bad = await page.locator(SCENES.hero).evaluate((root) => {
        const r = root.getBoundingClientRect();
        const out: string[] = [];
        for (const el of root.querySelectorAll('[data-trait], [data-pill]')) {
          const b = el.getBoundingClientRect();
          if (b.left < r.left - 0.5 || b.right > r.right + 0.5 || b.top < r.top - 0.5 || b.bottom > r.bottom + 0.5) {
            out.push(`${el.getAttribute('data-trait')}:${el.getAttribute('data-pill') ?? ''}`);
          }
        }
        return out;
      });
      expect(bad).toEqual([]);
    });
  }

  test('accesibilidad: el árbol de main es idéntico con y sin el collage, y la comprobación no es vacía', async ({ page }) => {
    await open(page, 1280);
    const withCollage = await page.locator('main').ariaSnapshot();
    await page.evaluate(() => document.querySelectorAll('[data-collage]').forEach((e) => e.remove()));
    const without = await page.locator('main').ariaSnapshot();
    expect(without).toBe(withCollage);
    // mutación: quitar aria-hidden de la raíz y de una píldora cambia el árbol
    await open(page, 1280);
    await page.evaluate(() => {
      const root = document.querySelector('.hero-collage[data-collage="hero"]') as HTMLElement;
      root.removeAttribute('aria-hidden');
      root.querySelector('[data-pill]')?.setAttribute('aria-hidden', 'false');
    });
    const mutated = await page.locator('main').ariaSnapshot();
    expect(mutated).not.toBe(withCollage);
  });

  test('ranura: una sola, sin imagen y con la proporción de PHOTO_SLOTS', async ({ page }) => {
    await open(page, 1280);
    const slot = page.locator('[data-photo-slot="hero"]');
    await expect(slot).toHaveCount(1);
    await expect(slot.locator('img, image')).toHaveCount(0);
    const box = await slot.evaluate((el) => {
      const b = el.getBoundingClientRect();
      return b.width / b.height;
    });
    const spec = PHOTO_SLOTS.find((s: { name: string }) => s.name === 'hero');
    expect(Math.abs(box - spec.w / spec.h)).toBeLessThan(0.02);
  });

  test('ganchos: dos pupilas path dentro del Loopy y grupos sin transform', async ({ page }) => {
    await open(page, 1280);
    const pupils = await page.locator('.hero-collage .hc-pupil').evaluateAll((els) =>
      els.map((e) => ({ tag: e.tagName.toLowerCase(), inLoopy: !!e.closest('[data-piece="loopy"]') })),
    );
    expect(pupils).toEqual([{ tag: 'path', inLoopy: true }, { tag: 'path', inLoopy: true }]);
    const transforms = await page.locator('.hero-collage [data-piece]').evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));
    expect(transforms.every((t) => t === 'none')).toBe(true);
  });

  test('cero animaciones con reduce y con no-preference', async ({ page }) => {
    for (const reducedMotion of ['reduce', 'no-preference'] as const) {
      await page.emulateMedia({ reducedMotion });
      await open(page, 1280);
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    }
  });

  for (const width of [320, 1280]) {
    test(`espaciado de texto (SC 1.4.12) a ${width} px: sin desborde y píldoras sin recorte`, async ({ page }) => {
      await open(page, width);
      await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }' });
      const doc = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      expect(doc).toBe(true);
      const clipped = await page.locator('.hero-collage [data-pill]').evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).length);
      expect(clipped).toBe(0);
    });
  }

  test('pesos: raíz del hero menor a 8192 bytes y sprite menor a 16384', async ({ page }) => {
    await open(page, 1280);
    const root = await page.locator(SCENES.hero).evaluate((el) => new TextEncoder().encode(el.outerHTML).length);
    const sprite = await page.locator('svg.collage-sprite').evaluate((el) => new TextEncoder().encode(el.outerHTML).length);
    expect(root).toBeLessThan(8192);
    expect(sprite).toBeLessThan(16384);
  });
});

test.describe('hero: sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('la raíz y las píldoras son visibles', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator(SCENES.hero)).toBeVisible();
    for (const pill of await page.locator('.hero-collage [data-pill]').all()) await expect(pill).toBeVisible();
  });
});
