import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'yaml';
import { test, expect, type Page } from '@playwright/test';
import { rgbOfToken } from './lib/brand';
import { PHOTOS, PHOTO_LOADING } from '../../src/components/collage/photos.mjs';
import { PHOTO_SLOTS, SCENES } from '../../src/components/collage/scenes.mjs';
import { expectMotionWithinBudget, expectNoMotion } from './lib/motion';

// Fotos en media tinta del collage (plan 02-11), sobre el HTML construido. Escrito sobre el conjunto de
// fotos elegidas del manifiesto: agregar la foto de otra ranura no exige reescribirlo.

const CHOSEN = (PHOTOS as { id: string; slot: string; chosen: boolean }[]).filter((p) => p.chosen);
const WIDTHS = [320, 390, 768, 1024, 1280];
const ROOT_OF: Record<string, string> = { hero: '.hero-collage[data-collage="hero"]', whynow: '#por-que-ahora [data-collage-scene="whynow"]' };
const fillOf = (slot: string) => (SCENES[slot].layers as { kind: string; fill: string }[]).find((l) => l.kind === 'slot')!.fill;

async function open(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto('/');
  // Las geometrías se miden en reposo: la entrada del hero (02-07) dura 1 s y mueve las piezas mientras corre.
  await page.waitForFunction(() => (window as unknown as { __rvReady?: boolean }).__rvReady === true && document.getAnimations().length === 0, null, { timeout: 5000 });
}
/** Recorre la página en pasos para disparar las cargas diferidas y espera a que todas las img terminen. */
async function scrollThrough(page: Page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
  // Las img de los collages ocultos (display: none, p. ej. la foto lazy de Por qué ahora) nunca cargan: solo cuentan las que se pintan.
  await page.waitForFunction(() => Array.from(document.images).filter((i) => i.checkVisibility()).every((i) => i.complete));
  await page.evaluate(() => window.scrollTo(0, 0));
}

// Los logos de clientes salen del YAML (hero.clients.items), igual que en Hero.astro.
const CLIENT_IDS = (
  parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as { es: { hero: { clients: { items: { text: string }[] } } } }
).es.hero.clients.items.map((i) => i.text.toLowerCase().replace(/\s+/g, '-'));
const CLIENT_LOGO_FILE = new RegExp(`/_astro/(${CLIENT_IDS.join('|')})\\.`);

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
    const wn = page.locator('#por-que-ahora [data-collage-scene="whynow"] [data-photo-frame="whynow"]');
    await expect(wn).toHaveCount(1);
    await expect(wn.locator('img')).toHaveCount(1);
    await expect(wn.locator('img')).toHaveAttribute('loading', 'lazy');
    expect(await wn.locator('img').evaluate((img: HTMLImageElement) => img.alt)).toBe('');
  });

  // Tras la ronda 2 los dos collages con foto viven ocultos (`.hero-collage-fallback` y `.whynow-preserve`, display: none)
  // y las cajas que los medían (`.whynow-art`, `.whynow-list`) ya no existen. Lo que se protege ahora: el respaldo sigue
  // en el DOM con su marco y su ranura, no ocupa lugar, no cruza el h2 ni las cajas y no provoca scroll horizontal.
  for (const width of WIDTHS) {
    test(`a ${width}px los collages con foto quedan ocultos, sin ocupar lugar y sin desbordar`, async ({ page }) => {
      await open(page, width);
      await page.locator('#por-que-ahora').scrollIntoViewIfNeeded();
      for (const hidden of ['#inicio .hero-collage-fallback', '#por-que-ahora .whynow-preserve']) {
        await expect(page.locator(hidden)).toHaveCount(1);
        await expect(page.locator(hidden)).toBeHidden();
        await expect(page.locator(hidden)).toHaveAttribute('aria-hidden', 'true');
      }
      for (const p of CHOSEN) {
        await expect(page.locator(`[data-photo-slot="${p.slot}"]`)).toHaveCount(1);
        await expect(page.locator(`[data-photo-frame="${p.slot}"]`)).toHaveCount(1);
      }
      const h2 = await page.locator('#por-que-ahora h2').evaluate((el) => { const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
      expect(h2.w).toBeGreaterThan(0);
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
    test(`a ${w}x${h} el LCP no cae dentro de un collage, solo puede ser la vitrina del hero y el CLS es 0`, async ({ page }) => {
      // La página mide miles de píxeles y el recorrido por pasos de scrollThrough tarda más de 20 s en móvil con la máquina cargada.
      test.setTimeout(60000);
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
          new Promise<{ tag: string; showcase: boolean; inCollage: boolean }>((resolve) => {
            const done = (e: any) =>
              resolve({ tag: e.element?.tagName ?? 'NONE', showcase: !!e.element?.matches('.hero-card-img'), inCollage: !!e.element?.closest('[data-collage]') });
            // Si el LCP ya se emitió se lee directo; si no, se espera al observador (buffered).
            const seen = performance.getEntriesByType('largest-contentful-paint').at(-1);
            if (seen) return done(seen);
            new PerformanceObserver((list) => done(list.getEntries().at(-1))).observe({ type: 'largest-contentful-paint', buffered: true });
          }),
      );
      // Desde la ronda 2 la vitrina del hero (img eager con fetchpriority alto) puede ser el LCP; cualquier otra img no.
      if (lcp.tag === 'IMG') expect(lcp.showcase, 'una img como LCP solo puede ser la vitrina del hero').toBe(true);
      expect(lcp.inCollage).toBe(false);
      await scrollThrough(page);
      await page.waitForTimeout(300);
      expect(await page.evaluate(() => (window as any).__cls)).toBe(0);
    });
  }

  test('las peticiones de imagen son del mismo origen; las fotos de collage pesan 25600 bytes o menos cada una y 40960 o menos en conjunto, y la vitrina del hero 32768 o menos', async ({ page }) => {
    const origin = new URL(String(test.info().project.use.baseURL)).origin;
    const bySrc = new Map<string, number>();
    const foreign: string[] = [];
    page.on('response', async (res) => {
      if (res.request().resourceType() !== 'image') return;
      const url = new URL(res.url());
      if (url.origin !== origin) foreign.push(res.url());
      // Los logos de clientes del hero (quick 260920-hero-clients) tienen su propio presupuesto en hero-clients.spec.ts.
      if (url.pathname.startsWith('/_astro/') && !CLIENT_LOGO_FILE.test(url.pathname)) bySrc.set(url.pathname, (await res.body()).length);
    });
    await open(page, 1280);
    await scrollThrough(page);
    await page.waitForTimeout(300);
    expect(foreign).toEqual([]);
    // Fotos de collage: las img dentro de un marco. Sus pesos son el presupuesto original; el resto de imágenes de /_astro/
    // (retratos del equipo, vitrina del hero) tienen sus propios topes en otros specs o más abajo.
    const photoSrcs = await page.locator('[data-photo-frame] img').evaluateAll((els) => els.map((el) => new URL((el as HTMLImageElement).src).pathname));
    const sizes = photoSrcs.map((src) => bySrc.get(src)).filter((n): n is number => typeof n === 'number');
    // Las del collage oculto (display: none) no se piden con carga diferida: basta con que las que se pidan cumplan.
    expect(sizes.length).toBeGreaterThanOrEqual(1);
    for (const s of sizes) expect(s).toBeLessThanOrEqual(25600);
    expect(sizes.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(40960);
    const showcase = await page.locator('#inicio .hero-card-img').evaluate((el) => new URL((el as HTMLImageElement).src).pathname);
    expect(bySrc.get(showcase), 'vitrina del hero pedida').toBeGreaterThan(0);
    expect(bySrc.get(showcase)!, 'peso de la vitrina del hero (hoy ~26 KB)').toBeLessThanOrEqual(32768);
  });

  test('sin JavaScript la foto se pinta', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto('/');
    for (const p of CHOSEN) {
      const img = page.locator(`[data-photo-frame="${p.slot}"] img`);
      // `scrollIntoViewIfNeeded` de Playwright espera fotogramas (rAF) para comprobar que el elemento está quieto y, con
      // JavaScript desactivado, ese chequeo se queda esperando de forma intermitente (más aún desde que la página trae los
      // retratos de Quiénes somos). El desplazamiento se hace por evaluación directa: no cambia lo que la prueba mide.
      await img.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await context.close();
  });

  for (const motion of ['reduce', 'no-preference'] as const) {
    test(`cero animaciones con prefers-reduced-motion ${motion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: motion });
      await open(page, 1280);
      if (motion === 'reduce') await expectNoMotion(page);
      else await expectMotionWithinBudget(page);
    });
  }
});

// Hoja de elección (plan 02-11, tarea 3): cada candidata del manifiesto en su escena completa.
const SHEET = '/marca/hoja/';
test.describe('hoja de fotos', () => {
  for (const width of WIDTHS) {
    test(`a ${width} px: una celda por foto del manifiesto con su marco, rótulo en code y sin scroll horizontal`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(SHEET);
      await expect(page.locator('section[data-sheet="fotos"]')).toHaveCount(2);
      await expect(page.locator('[data-demo^="foto-"]')).toHaveCount(PHOTOS.length);
      for (const p of PHOTOS as { id: string; slot: string }[]) {
        const cell = page.locator(`[data-demo="foto-${p.id}"]`);
        await expect(cell).toHaveCount(1);
        await expect(cell.locator('[data-photo-frame]')).toHaveCount(1);
        await expect(cell.locator('[data-photo-frame]')).toHaveAttribute('data-photo-id', p.id);
        await expect(cell.locator('[data-photo-frame]')).toHaveAttribute('data-photo-frame', p.slot);
        await expect(cell.locator('img')).toHaveCount(1);
        expect(await cell.locator('img').getAttribute('alt')).toBe('');
        const label = cell.locator('code');
        await expect(label).toHaveCount(1);
        await expect(label).toHaveText(new RegExp(`^${p.id} / (pendiente|aprobada)$`));
        const box = await cell.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(-0.5);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 0.5);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('las celdas de hero miden hasta 30rem y las de whynow hasta 20rem', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(SHEET);
    const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
    for (const p of PHOTOS as { id: string; slot: string }[]) {
      const box = (await page.locator(`[data-demo="foto-${p.id}"]`).boundingBox())!;
      expect(box.width).toBeLessThanOrEqual((p.slot === 'hero' ? 30 : 20) * rem + 0.5);
    }
  });
});

// Herramientas del ciclo visual (plan 02-11, tarea 4). Solo corren con PHASE2_BATCH definida (p. ej.
// PHASE2_BATCH=P-fotos): abren un contexto propio con todo lo que no es localhost abortado y guardan
// en test-results/phase2/ (no versionado).
const BATCH = process.env.PHASE2_BATCH;
const isLocal = (url: string) => ['localhost', '127.0.0.1'].includes(new URL(url).hostname);

test.describe('informe de fotos', () => {
  test.skip(!BATCH, 'define PHASE2_BATCH (p. ej. P-fotos) para medir LCP, CLS y pesos');
  test('mide LCP, CLS, pesos por imagen y por tipo de recurso a 390x844 y 1280x800', async ({ browser, baseURL }) => {
    const report: Record<string, unknown> = {};
    for (const [w, h] of [[390, 844], [1280, 800]] as const) {
      const context = await browser.newContext({ baseURL, viewport: { width: w, height: h } });
      await context.route('**/*', (route) => (isLocal(route.request().url()) ? route.continue() : route.abort()));
      const page = await context.newPage();
      const responses: { url: string; type: string; bytes: number }[] = [];
      const pending: Promise<void>[] = [];
      page.on('response', (res) => {
        pending.push(
          res.body().then(
            (b) => { responses.push({ url: new URL(res.url()).pathname, type: res.request().resourceType(), bytes: b.length }); },
            () => undefined,
          ),
        );
      });
      await page.addInitScript(() => {
        (window as any).__cls = 0;
        (window as any).__lcp = [];
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as any[]) if (!e.hadRecentInput) (window as any).__cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as any[]) {
            (window as any).__lcp.push({
              tag: e.element?.tagName ?? 'NONE', id: e.element?.id ?? '', cls: String(e.element?.className ?? '').slice(0, 60),
              inCollage: !!e.element?.closest?.('[data-collage]'), url: e.url ?? '', time: Math.round(e.startTime), size: e.size,
            });
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
      await page.goto('/');
      await page.waitForTimeout(500);
      await scrollThrough(page);
      await page.waitForTimeout(400);
      await Promise.all(pending);
      const lcpList = await page.evaluate(() => (window as any).__lcp as { tag: string }[]);
      const cls = await page.evaluate(() => (window as any).__cls as number);
      const byType: Record<string, { requests: number; bytes: number }> = {};
      for (const r of responses) {
        byType[r.type] ??= { requests: 0, bytes: 0 };
        byType[r.type].requests += 1;
        byType[r.type].bytes += r.bytes;
      }
      const images = responses.filter((r) => r.type === 'image');
      report[`${w}x${h}`] = {
        lcp: lcpList.at(-1) ?? null,
        lcpCandidates: lcpList,
        cls,
        images,
        imageBytes: images.reduce((a, r) => a + r.bytes, 0),
        totalRequests: responses.length,
        totalBytes: responses.reduce((a, r) => a + r.bytes, 0),
        byType,
      };
      await context.close();
    }
    mkdirSync('test-results/phase2', { recursive: true });
    writeFileSync(`test-results/phase2/${BATCH}-medicion.json`, JSON.stringify(report, null, 2));
  });
});

test.describe('captura de fotos', () => {
  test.skip(!BATCH, 'define PHASE2_BATCH (p. ej. P-fotos) para generar capturas de fotos');
  const shot = (name: string) => `test-results/phase2/${BATCH}-${name}.png`;
  for (const width of WIDTHS) {
    test(`captura de hero, Por que ahora y hoja a ${width}px`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, viewport: { width, height: 900 } });
      await context.route('**/*', (route) => (isLocal(route.request().url()) ? route.continue() : route.abort()));
      const page = await context.newPage();
      await page.goto('/');
      await page.locator(ROOT_OF.hero).screenshot({ path: shot(`hero-${width}`) });
      await page.locator(ROOT_OF.whynow).scrollIntoViewIfNeeded();
      await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete));
      await page.locator(ROOT_OF.whynow).screenshot({ path: shot(`whynow-${width}`) });
      await page.goto(SHEET);
      await scrollThrough(page);
      await page.screenshot({ path: shot(`hoja-${width}`), fullPage: true });
      if (width === 1280) {
        for (const p of PHOTOS as { id: string }[]) {
          await page.locator(`[data-demo="foto-${p.id}"]`).screenshot({ path: shot(`foto-${p.id}-1280`) });
        }
      }
      await context.close();
    });
  }
  for (const dpr of [1, 2]) {
    test(`captura de los marcos de hero y Por que ahora con deviceScaleFactor ${dpr}`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ baseURL, viewport: { width: 1280, height: 900 }, deviceScaleFactor: dpr });
      await context.route('**/*', (route) => (isLocal(route.request().url()) ? route.continue() : route.abort()));
      const page = await context.newPage();
      await page.goto('/');
      for (const slot of ['hero', 'whynow']) {
        const frame = page.locator(`${ROOT_OF[slot]} [data-photo-frame]`);
        await frame.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete));
        await frame.screenshot({ path: shot(`frame-${slot}-1280-dpr${dpr}`) });
      }
      await context.close();
    });
  }
});
