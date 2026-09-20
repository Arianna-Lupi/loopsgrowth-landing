import { test, expect, type Page } from '@playwright/test';
import { rgbOfToken } from './lib/brand';
import { PHOTOS, PHOTO_LOADING } from '../../src/components/collage/photos.mjs';
import { PHOTO_SLOTS, SCENES } from '../../src/components/collage/scenes.mjs';

// Fotos en media tinta del collage (plan 02-11), sobre el HTML construido. Escrito sobre el conjunto de
// fotos elegidas del manifiesto: agregar la foto de otra ranura no exige reescribirlo.

const CHOSEN = (PHOTOS as { id: string; slot: string; chosen: boolean }[]).filter((p) => p.chosen);
const WIDTHS = [320, 390, 768, 1024, 1280];
const ROOT_OF: Record<string, string> = { hero: '.hero-collage[data-collage="hero"]', whynow: '#por-que-ahora [data-collage-scene="whynow"]' };
const fillOf = (slot: string) => (SCENES[slot].layers as { kind: string; fill: string }[]).find((l) => l.kind === 'slot')!.fill;

async function open(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto('/');
}
/** Recorre la página en pasos para disparar las cargas diferidas y espera a que todas las img terminen. */
async function scrollThrough(page: Page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
  await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete));
  await page.evaluate(() => window.scrollTo(0, 0));
}

test.describe('fotos en media tinta', () => {
  test('un marco por foto elegida con una sola img decorativa, dimensiones y carga según su ranura', async ({ page }) => {
    await open(page, 1280);
    expect(CHOSEN.length).toBeGreaterThan(0);
    await expect(page.locator('[data-photo-frame]')).toHaveCount(CHOSEN.length);
    await expect(page.locator('[data-collage] img')).toHaveCount(CHOSEN.length);
    for (const p of CHOSEN) {
      const frame = page.locator(`${ROOT_OF[p.slot]} [data-photo-frame="${p.slot}"]`);
      await expect(frame).toHaveCount(1);
      await expect(frame).toHaveAttribute('data-photo-id', p.id);
      await expect(frame).toHaveAttribute('data-trait', 'photo');
      await expect(frame.locator('img')).toHaveCount(1);
      const info = await frame.locator('img').evaluate((img: HTMLImageElement) => ({
        alt: img.alt, hasAlt: img.hasAttribute('alt'), w: img.getAttribute('width'), h: img.getAttribute('height'),
        loading: img.getAttribute('loading'), decoding: img.getAttribute('decoding'), prio: img.getAttribute('fetchpriority'),
        title: img.getAttribute('title'), role: img.getAttribute('role'), src: img.getAttribute('src'),
      }));
      expect(info.alt).toBe('');
      expect(info.hasAlt).toBe(true);
      expect(Number(info.w)).toBeGreaterThan(0);
      expect(Number(info.h)).toBeGreaterThan(0);
      expect(info.loading).toBe(PHOTO_LOADING[p.slot as 'hero' | 'whynow']);
      expect(info.decoding).toBe('async');
      expect(info.prio).toBeNull();
      expect(info.title).toBeNull();
      expect(info.role).toBeNull();
      expect(info.src).toMatch(/^\/_astro\//);
    }
    await expect(page.locator('[data-photo-slot]')).toHaveCount(2);
  });

  test('dos fotos: hero eager y whynow lazy, un marco por ranura y Por qué ahora sin cruces', async ({ page }) => {
    await open(page, 1280);
    await expect(page.locator('[data-photo-frame]')).toHaveCount(2);
    await expect(page.locator('.hero-collage [data-photo-frame="hero"] img')).toHaveAttribute('loading', 'eager');
    const wn = page.locator('#por-que-ahora .whynow-art [data-photo-frame="whynow"]');
    await expect(wn).toHaveCount(1);
    await expect(wn.locator('img')).toHaveCount(1);
    await expect(wn.locator('img')).toHaveAttribute('loading', 'lazy');
    expect(await wn.locator('img').evaluate((img: HTMLImageElement) => img.alt)).toBe('');
  });

  for (const width of WIDTHS) {
    test(`a ${width}px Por qué ahora conserva su caja, no cruza el h2 ni la lista y no desborda`, async ({ page }) => {
      await open(page, width);
      const wide = width >= 1024;
      const box = (sel: string) => page.locator(sel).first().evaluate((el) => { const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
      await page.locator('#por-que-ahora').scrollIntoViewIfNeeded();
      const art = await box('#por-que-ahora .whynow-art');
      const h2 = await box('#por-que-ahora h2');
      const list = await box('#por-que-ahora .whynow-list');
      expect(Math.abs(art.w - (wide ? 320 : 224))).toBeLessThanOrEqual(1);
      const hit = (a: typeof art, b: typeof art) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
      expect(hit(art, h2)).toBe(false);
      expect(hit(art, list)).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  for (const width of WIDTHS) {
    test(`a ${width}px el marco coincide con su ranura y no hay scroll horizontal`, async ({ page }) => {
      await open(page, width);
      for (const p of CHOSEN) {
        const slot = page.locator(`[data-photo-slot="${p.slot}"]`);
        await slot.scrollIntoViewIfNeeded();
        const [s, f] = await Promise.all([
          slot.evaluate((el) => { const b = el.getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; }),
          page.locator(`[data-photo-frame="${p.slot}"]`).evaluate((el) => { const b = el.getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; }),
        ]);
        s.forEach((v, i) => expect(Math.abs(v - f[i]), `${p.slot} ${['x', 'y', 'w', 'h'][i]}`).toBeLessThanOrEqual(0.5));
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  test('el marco lleva el relleno del token de su ranura, sin transform propio, y sigue a su panel', async ({ page }) => {
    await open(page, 1280);
    for (const p of CHOSEN) {
      const frame = page.locator(`[data-photo-frame="${p.slot}"]`);
      expect(await frame.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(rgbOfToken(fillOf(p.slot)));
      expect(await frame.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
      expect(await frame.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');
    }
    if (CHOSEN.some((p) => p.slot === 'hero')) {
      await expect(page.locator('.hero-collage [data-piece]')).toHaveCount(6);
      const vars = (sel: string) => page.locator(sel).evaluate((el) => ['--i', '--r', '--r-from'].map((v) => (el as HTMLElement).style.getPropertyValue(v)));
      const panel = await vars('.hero-collage [data-piece="panel"]');
      expect(await vars('.hero-collage [data-piece-of="panel"]')).toEqual(panel);
      expect(panel.every((v) => v !== '')).toBe(true);
      await expect(page.locator('[data-photo-frame="hero"]')).not.toHaveAttribute('data-piece', /.*/);
    }
  });

  test('árbol de accesibilidad de main idéntico con y sin fotos; con alt y sin aria-hidden cambia (mutación)', async ({ page }) => {
    await open(page, 1280);
    await scrollThrough(page);
    const withPhotos = await page.locator('main').ariaSnapshot();
    await page.evaluate(() => document.querySelectorAll('[data-photo-frame]').forEach((el) => el.remove()));
    expect(await page.locator('main').ariaSnapshot()).toBe(withPhotos);
    await page.reload();
    await page.evaluate(() => {
      document.querySelectorAll('[data-collage] img').forEach((img) => img.setAttribute('alt', 'foto'));
      document.querySelectorAll('[data-collage]').forEach((el) => el.removeAttribute('aria-hidden'));
    });
    expect(await page.locator('main').ariaSnapshot()).not.toBe(withPhotos);
  });

  for (const [w, h] of [[390, 844], [1280, 800]] as const) {
    test(`a ${w}x${h} el elemento LCP no es una img ni cae dentro del collage y el CLS es 0`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as any).__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await open(page, w, h);
      await page.waitForTimeout(500);
      const lcp = await page.evaluate(
        () =>
          new Promise<{ tag: string; inCollage: boolean }>((resolve) => {
            new PerformanceObserver((list) => {
              const e = list.getEntries().at(-1) as any;
              resolve({ tag: e.element?.tagName ?? 'NONE', inCollage: !!e.element?.closest('[data-collage]') });
            }).observe({ type: 'largest-contentful-paint', buffered: true });
          }),
      );
      expect(lcp.tag).not.toBe('IMG');
      expect(lcp.inCollage).toBe(false);
      await scrollThrough(page);
      await page.waitForTimeout(300);
      expect(await page.evaluate(() => (window as any).__cls)).toBe(0);
    });
  }

  test('las peticiones de imagen son del mismo origen, cada una de 25600 bytes o menos y en conjunto 40960 o menos', async ({ page }) => {
    const origin = new URL(String(test.info().project.use.baseURL)).origin;
    const sizes: number[] = [];
    const foreign: string[] = [];
    page.on('response', async (res) => {
      if (res.request().resourceType() !== 'image') return;
      const url = new URL(res.url());
      if (url.origin !== origin) foreign.push(res.url());
      if (url.pathname.startsWith('/_astro/')) sizes.push((await res.body()).length);
    });
    await open(page, 1280);
    await scrollThrough(page);
    await page.waitForTimeout(300);
    expect(foreign).toEqual([]);
    expect(sizes.length).toBeGreaterThanOrEqual(CHOSEN.length);
    for (const s of sizes) expect(s).toBeLessThanOrEqual(25600);
    expect(sizes.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(40960);
  });

  test('sin JavaScript la foto se pinta', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto('/');
    for (const p of CHOSEN) {
      const img = page.locator(`[data-photo-frame="${p.slot}"] img`);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await context.close();
  });

  for (const motion of ['reduce', 'no-preference'] as const) {
    test(`cero animaciones con prefers-reduced-motion ${motion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: motion });
      await open(page, 1280);
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    });
  }
});
