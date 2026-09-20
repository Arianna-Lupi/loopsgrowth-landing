import { test, expect, type Page } from '@playwright/test';
import { expectNoMotion, motionSnapshot } from './lib/motion';

// Movimiento de la landing (plan 02-07, DSGN-05). Todo es CSS puro bajo `prefers-reduced-motion:
// no-preference`, solo `transform`, finito y sin esconder contenido. Con `reduce` no hay ninguna
// animación. La lista blanca de lo que puede correr vive en `lib/motion.ts`.

const PIECES = '#inicio [data-piece]';
const FRAME = '#inicio [data-piece-of]';
const ANY_PIECE = `${PIECES}, ${FRAME}`;
const COLLAGE = '#inicio .hero-collage';
const HERO = { h1: '#inicio h1', sub: '#inicio .hero-sub', cta: '#inicio a[data-cta="hero"]' };

/** Espera a que corra al menos una animación (el reloj manda: el `describe` que la usa lleva `retries`). */
async function waitForAnimations(page: Page) {
  await page.waitForFunction(() => document.getAnimations().length > 0, null, { timeout: 3000 });
}

/** Detiene todas las animaciones vivas en `ms` desde su inicio: mide un cuadro exacto sin depender del reloj. */
async function freezeAt(page: Page, ms: number) {
  await page.evaluate((t) => {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t;
    }
  }, ms);
}

test.describe('entrada del collage del hero con reduce', () => {
  test.use({ reducedMotion: 'reduce' });

  test('las 6 piezas y el marco de foto no tienen animación y getAnimations() vale 0 a la carga y a los 2,5 s', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator(PIECES).count()).toBe(6);
    expect(await page.locator(FRAME).count()).toBe(1);
    const names = await page.locator(ANY_PIECE).evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));
    expect(names).toEqual(Array(7).fill('none'));
    await expectNoMotion(page);
    await page.waitForTimeout(2500);
    await expectNoMotion(page);
  });

  test('/privacidad/ no tiene ninguna animación', async ({ page }) => {
    await page.goto('/privacidad/');
    await expectNoMotion(page);
    await page.waitForTimeout(2500);
    await expectNoMotion(page);
  });
});

test.describe('entrada del collage del hero con no-preference', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1280, height: 800 } });

  test('cada pieza y el marco: hc-enter, 0,6 s, una iteración, relleno backwards, retraso de --i por 0,08 s y fin en 1,0 s o menos', async ({ page }) => {
    await page.goto('/');
    const rows = await page.locator(ANY_PIECE).evaluateAll((els) =>
      els.map((e) => {
        const c = getComputedStyle(e);
        return {
          who: e.getAttribute('data-piece') ?? `frame:${e.getAttribute('data-piece-of')}`,
          i: Number(e.style.getPropertyValue('--i')),
          name: c.animationName,
          dur: parseFloat(c.animationDuration),
          delay: parseFloat(c.animationDelay),
          iter: c.animationIterationCount,
          fill: c.animationFillMode,
          transform: c.transform,
        };
      }),
    );
    expect(rows).toHaveLength(7);
    const panel = rows.find((r) => r.who === 'panel')!;
    for (const r of rows) {
      expect(r.name, r.who).toBe('hc-enter');
      expect(r.dur, r.who).toBeCloseTo(0.6, 3);
      expect(r.iter, r.who).toBe('1');
      expect(r.fill, r.who).toBe('backwards');
      expect(r.delay, r.who).toBeCloseTo(r.i * 0.08, 3);
    }
    const frame = rows.find((r) => r.who.startsWith('frame:'))!;
    expect(frame.delay).toBeCloseTo(panel.delay, 3);
    expect(frame.i).toBe(panel.i);
    // Retraso de 0 a 0,4 s en pasos de 0,08 s: los seis grupos son una permutación de 0 a 5.
    expect(rows.filter((r) => !r.who.startsWith('frame:')).map((r) => r.i).sort()).toEqual([0, 1, 2, 3, 4, 5]);
    const end = Math.max(...rows.map((r) => r.delay + r.dur));
    expect(end).toBeLessThanOrEqual(1.0 + 1e-6);
    expect(end).toBeLessThan(1.2);
  });

  test('@keyframes hc-enter declara solo transform y su último cuadro es el reposo (rotate(0deg), no --r)', async ({ page }) => {
    await page.goto('/');
    const frames = await page.evaluate(() => {
      for (const sheet of [...document.styleSheets]) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        const walk = (list: CSSRuleList): CSSKeyframesRule | null => {
          for (const r of [...list]) {
            if (r instanceof CSSKeyframesRule && r.name === 'hc-enter') return r;
            const inner = (r as CSSGroupingRule).cssRules;
            if (inner) {
              const f = walk(inner);
              if (f) return f;
            }
          }
          return null;
        };
        const k = walk(rules);
        if (k) {
          return [...k.cssRules].map((kf) => {
            const s = (kf as CSSKeyframeRule).style;
            return { key: (kf as CSSKeyframeRule).keyText, props: [...Array(s.length).keys()].map((i) => s.item(i)), text: (kf as CSSKeyframeRule).cssText };
          });
        }
      }
      return null;
    });
    expect(frames, '@keyframes hc-enter existe en las hojas de estilo').not.toBeNull();
    expect(frames!.length).toBeGreaterThanOrEqual(2);
    for (const f of frames!) expect(f.props, f.key).toEqual(['transform']);
    const last = frames![frames!.length - 1];
    expect(['100%', 'to']).toContain(last.key);
    expect(last.text).not.toContain('var(--r)');
    expect(last.text).toMatch(/rotate\(0(deg)?\)/);
  });

  test('h1, subtítulo y CTA del hero no tienen animación y su opacidad es 1', async ({ page }) => {
    await page.goto('/');
    for (const sel of Object.values(HERO)) {
      await expect(page.locator(sel).first()).toHaveCSS('animation-name', 'none');
      await expect(page.locator(sel).first()).toHaveCSS('opacity', '1');
    }
  });

  test('a los 2,5 s no queda ninguna animación y el marco coincide con la ranura de foto', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2500);
    await expectNoMotion(page);
    const boxes = await page.evaluate(() => {
      const r = (s: string) => {
        const b = document.querySelector(s)!.getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height };
      };
      return { frame: r('#inicio [data-photo-frame="hero"]'), slot: r('#inicio [data-photo-slot="hero"]') };
    });
    for (const k of ['x', 'y', 'w', 'h'] as const) expect(Math.abs(boxes.frame[k] - boxes.slot[k]), k).toBeLessThanOrEqual(1);
  });

  test.describe('muestreo del reloj', () => {
    test.describe.configure({ retries: 1 });

    test('tras cargar solo corren CSSAnimation de la lista blanca sobre las piezas del hero y a los 2,5 s vuelve a 0', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForAnimations(page);
      const live = await motionSnapshot(page);
      expect(live.length).toBeGreaterThan(0);
      for (const e of live) {
        expect(e.type, e.target).toBe('CSSAnimation');
        expect(e.allowed, `${e.name} sobre ${e.target}`).toBe(true);
        expect(e.properties, e.target).toEqual(['transform']);
      }
      await page.waitForTimeout(2500);
      await expectNoMotion(page);
    });

    test('primer cuadro: cada pieza con opacidad 1, visible y dentro del collage (con la holgura de la desviación 12)', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForAnimations(page);
      await freezeAt(page, 0);
      const out = await page.evaluate(
        ([pieces, frame, collage]) => {
          const root = document.querySelector(collage)!.getBoundingClientRect();
          const pad = root.width * 0.08;
          return [...document.querySelectorAll(`${pieces}, ${frame}`)].map((e) => {
            const c = getComputedStyle(e);
            const b = e.getBoundingClientRect();
            return {
              who: e.getAttribute('data-piece') ?? 'frame',
              opacity: c.opacity,
              visibility: c.visibility,
              display: c.display,
              inside: b.left >= root.left - pad && b.right <= root.right + pad && b.top >= root.top - pad && b.bottom <= root.bottom + pad,
            };
          });
        },
        [PIECES, FRAME, COLLAGE],
      );
      expect(out).toHaveLength(7);
      for (const o of out) {
        expect(o.opacity, o.who).toBe('1');
        expect(o.visibility, o.who).toBe('visible');
        expect(o.display, o.who).not.toBe('none');
        expect(o.inside, `${o.who} dentro del collage`).toBe(true);
      }
    });
  });

  test('/marca/hoja/ no tiene ninguna animación (el alcance es #inicio)', async ({ page }) => {
    await page.goto('/marca/hoja/');
    await expectNoMotion(page);
    await page.waitForTimeout(500);
    await expectNoMotion(page);
  });

  test('sin scroll horizontal a 320 px durante la entrada', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAnimations(page);
    for (const t of [0, 200, 400, 700]) {
      await freezeAt(page, t);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(over, `a ${t} ms`).toBeLessThanOrEqual(0);
    }
  });

  test('con JavaScript desactivado el hero y su collage se ven', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference', viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator(HERO.h1)).toBeVisible();
    await expect(page.locator(HERO.cta)).toBeVisible();
    await expect(page.locator(COLLAGE)).toBeVisible();
    const opacities = await page.locator(ANY_PIECE).evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacities).toEqual(Array(7).fill('1'));
    await context.close();
  });
});
