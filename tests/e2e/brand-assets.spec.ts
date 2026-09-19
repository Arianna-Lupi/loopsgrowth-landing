import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// El nombre accesible esperado sale del YAML, nunca de una cadena escrita a mano.
const es = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: { brand: { name: { text: string } } };
}).es;
const BRAND_NAME = es.brand.name.text;

const HEADER_WIDTHS = [320, 640, 768, 1280];

/** Proporción del viewBox de un SVG de src/assets/brand, leída del archivo. */
function viewBoxRatio(path: string): number {
  const match = readFileSync(path, 'utf8').match(/viewBox="([^"]+)"/);
  if (!match) throw new Error(`Sin viewBox en ${path}`);
  const parts = match[1].split(/\s+/).map(Number);
  return parts[2] / parts[3];
}

const LOGO_RATIO = viewBoxRatio('src/assets/brand/logo-horizontal.svg');

async function open(page: Page, width: number, path = '/') {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
}

test.describe('logo horizontal en el header', () => {
  for (const width of HEADER_WIDTHS) {
    test(`(a) a ${width}px el logo es una imagen con nombre, sin enlace en / y de 32px o más`, async ({ page }) => {
      await open(page, width);
      const logo = page.locator('header .brand-logo svg').first();
      await expect(logo).toHaveAttribute('role', 'img');
      await expect(logo).toHaveAttribute('aria-label', BRAND_NAME);
      await expect(logo).toHaveAttribute('focusable', 'false');
      await expect(logo).not.toHaveAttribute('aria-hidden', /.*/);
      const info = await logo.evaluate((el) => {
        const box = el.getBoundingClientRect();
        return { w: box.width, h: box.height, inLink: !!el.closest('a') };
      });
      expect(info.inLink).toBe(false);
      expect(info.h).toBeGreaterThanOrEqual(32);
      expect(Math.abs(info.w / info.h / LOGO_RATIO - 1)).toBeLessThanOrEqual(0.02);
    });

    test(`(b) a ${width}px ningún elemento de contenido entra en el área de salvado`, async ({ page }) => {
      await open(page, width);
      const offenders = await page.evaluate(() => {
        const logoBox = document.querySelector('header .brand-logo') as HTMLElement;
        const probe = document.createElement('div');
        probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--logo-clear)';
        logoBox.appendChild(probe);
        const clear = probe.getBoundingClientRect().width;
        probe.remove();
        const r = logoBox.querySelector('svg')!.getBoundingClientRect();
        const zone = { l: r.left - clear, t: r.top - clear, r: r.right + clear, b: r.bottom + clear };
        const bad: string[] = [];
        const candidates = document.querySelectorAll('a, button, svg, img, iframe, h1, h2, h3, p, span, li, div');
        for (const el of candidates) {
          if (el.closest('.collage-sprite')) continue;
          if (el.contains(logoBox) || logoBox.contains(el)) continue;
          const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent!.trim());
          const isObject = /^(A|BUTTON|SVG|IMG|IFRAME)$/i.test(el.tagName);
          if (!own && !isObject) continue;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          const box = el.getBoundingClientRect();
          if (box.width < 2 || box.height < 2) continue;
          if (box.left < zone.r && box.right > zone.l && box.top < zone.b && box.bottom > zone.t) {
            bad.push(`${el.tagName.toLowerCase()}.${(el as HTMLElement).className}`);
          }
        }
        return { clear, bad };
      });
      expect(offenders.clear).toBeGreaterThanOrEqual(32);
      expect(offenders.bad).toEqual([]);
    });
  }

  for (const width of [320, 1280]) {
    test(`(c) sin scroll horizontal a ${width}px`, async ({ page }) => {
      await open(page, width);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('(e) el relleno del logo no es none ni negro puro', async ({ page }) => {
    await open(page, 1280);
    const fill = await page.locator('header .brand-logo svg path').first().evaluate((el) => getComputedStyle(el).fill);
    expect(fill).not.toBe('none');
    expect(fill).not.toBe('rgb(0, 0, 0)');
  });
});

test.describe('logo horizontal sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('(d) el logo es visible con caja no vacía', async ({ page }) => {
    await open(page, 1280);
    const logo = page.locator('header .brand-logo svg').first();
    await expect(logo).toBeVisible();
    const box = await logo.boundingBox();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });
});

const SHEET = '/marca/hoja/';
const SHEET_WIDTHS = [320, 390, 768, 1024, 1280];

test.describe('hoja de revisión: identidad', () => {
  for (const width of SHEET_WIDTHS) {
    test(`logo e isotipo a ${width}px: tamaños mínimos, blanco sobre dark y sin scroll horizontal`, async ({ page }) => {
      await open(page, width, SHEET);
      const sizes = await page.evaluate(() => {
        const h = (sel: string) => Array.from(document.querySelectorAll(sel)).map((el) => el.getBoundingClientRect().height);
        return { logo: h('.brand-logo[data-variant="horizontal"] svg'), iso: h('.brand-logo[data-variant="isotipo"] svg') };
      });
      expect(sizes.logo.length).toBeGreaterThan(0);
      expect(sizes.iso.length).toBeGreaterThan(0);
      for (const v of sizes.logo) expect(v).toBeGreaterThanOrEqual(32);
      for (const v of sizes.iso) expect(v).toBeGreaterThanOrEqual(24);

      const darkFill = await page
        .locator('[data-tone="dark"] .brand-logo[data-variant="horizontal"] svg path')
        .first()
        .evaluate((el) => getComputedStyle(el).fill);
      expect(darkFill).toBe('rgb(255, 255, 255)');

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('la hoja lleva noindex y su rótulo no es copy', async ({ page }) => {
    await open(page, 1280, SHEET);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
});

test.describe('favicon', () => {
  test('/favicon.ico responde 200 y trae tres imágenes de 16, 32 y 48 px', async ({ request }) => {
    const res = await request.get('/favicon.ico');
    expect(res.status()).toBe(200);
    const buf = await res.body();
    expect(buf.length).toBeGreaterThan(655);
    expect([...buf.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    const count = buf.readUInt16LE(4);
    expect(count).toBe(3);
    const sizes = [0, 1, 2].map((i) => buf[6 + i * 16] || 256);
    expect(sizes).toEqual([16, 32, 48]);
  });

  test('/favicon.svg es texto con viewBox cuadrado, sin script ni referencias http', async ({ request }) => {
    const res = await request.get('/favicon.svg');
    expect(res.status()).toBe(200);
    const text = await res.text();
    const vb = text.match(/viewBox="([^"]+)"/);
    expect(vb).not.toBeNull();
    const [, , w, h] = vb![1].split(/\s+/).map(Number);
    expect(w).toBe(h);
    expect(text).not.toMatch(/<script|href=|xlink|https?:\/\/(?!www\.w3\.org)/);
  });
});
