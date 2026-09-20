import { test, expect, type Browser, type BrowserContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
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

// ---------------------------------------------------------------------------------------------
// Cierre de la fase 2 (plan 02-08). Solo mide; la compuerta completa de accesibilidad es de la fase 3.
// ---------------------------------------------------------------------------------------------

// Contexto con todo lo que no es localhost abortado (ClickUp incluido): la página completa sin formulario.
async function isolatedContext(
  browser: Browser,
  baseURL: string | undefined,
  width: number,
  height: number,
  opts: { reducedMotion?: 'reduce' | 'no-preference'; javaScriptEnabled?: boolean } = {},
): Promise<BrowserContext> {
  const context = await browser.newContext({
    baseURL,
    viewport: { width, height },
    reducedMotion: opts.reducedMotion ?? 'no-preference',
    javaScriptEnabled: opts.javaScriptEnabled ?? true,
  });
  await context.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    return host === 'localhost' || host === '127.0.0.1' ? route.continue() : route.abort();
  });
  return context;
}

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('axe de humo', () => {
  for (const path of ['/', '/privacidad/']) {
    for (const [width, height] of [
      [320, 640],
      [390, 844],
      [1280, 800],
    ] as const) {
      test(`${path} a ${width} px: cero violaciones critical o serious`, async ({ browser, baseURL }, testInfo) => {
        const context = await isolatedContext(browser, baseURL, width, height);
        const page = await context.newPage();
        await page.goto(path);
        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).exclude('iframe').analyze();
        const blocking = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
        for (const v of results.violations.filter((x) => x.impact !== 'critical' && x.impact !== 'serious')) {
          testInfo.annotations.push({ type: `axe ${v.impact}`, description: `${path} ${width}px ${v.id} (${v.nodes.length} nodos)` });
        }
        testInfo.annotations.push({
          type: 'axe conteo',
          description: `${path} ${width}px: ${results.violations.length} violaciones, ${blocking.length} critical o serious`,
        });
        await context.close();
        expect(
          blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
        ).toEqual([]);
      });
    }
  }
});

// Hoja de contacto: recortes de header, de cada sección de main y de footer a 1280 y 390 px y dos hojas
// (1280 en 3 columnas, 390 en 6). Solo corre con PHASE2_BATCH; las capturas nunca se versionan.
test.describe('hoja de contacto', () => {
  test.skip(!process.env.PHASE2_BATCH, 'define PHASE2_BATCH (p. ej. CIERRE1) para generar la hoja de contacto');
  const batch = process.env.PHASE2_BATCH ?? '';
  for (const [width, height, cols] of [
    [1280, 800, 3],
    [390, 844, 6],
  ] as const) {
    test(`hoja de contacto a ${width} px`, async ({ browser, baseURL }) => {
      const context = await isolatedContext(browser, baseURL, width, height);
      const page = await context.newPage();
      await page.goto('/');
      const ids = await page.locator('main > section').evaluateAll((els) => els.map((el) => el.id));
      const targets: Array<[string, string]> = [
        ['header', 'body > header'],
        ...ids.map((id): [string, string] => [id, `main > section#${id}`]),
        ['footer', 'body > footer'],
      ];
      expect(targets).toHaveLength(14);
      const shots: Array<{ id: string; b64: string }> = [];
      for (const [id, sel] of targets) {
        const el = page.locator(sel).first();
        await el.scrollIntoViewIfNeeded();
        const buf = await el.screenshot({ path: `test-results/phase2/${batch}-${id}-${width}.png` });
        expect(buf.length, `${id} vacío`).toBeGreaterThan(0);
        shots.push({ id, b64: buf.toString('base64') });
      }
      const sheet = await context.newPage();
      await sheet.setViewportSize({ width: cols === 3 ? 1800 : 2400, height: 1000 });
      await sheet.setContent(
        `<body style="margin:0;background:#888"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;padding:8px;align-items:start">${shots
          .map(
            (s) =>
              `<figure style="margin:0;background:#fff"><figcaption style="font:12px monospace;padding:2px 4px">${s.id}</figcaption><img style="width:100%;display:block" src="data:image/png;base64,${s.b64}"></figure>`,
          )
          .join('')}</div></body>`,
      );
      await sheet.screenshot({ path: `test-results/phase2/${batch}-hoja-${width}.png`, fullPage: true });
      await context.close();
    });
  }
});
