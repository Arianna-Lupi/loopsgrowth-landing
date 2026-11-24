import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { parse } from 'yaml';
import { PURPLE_RGB } from './lib/brand';
import { HTML_GZIP_MAX, HTML_RAW_MAX } from './lib/budgets.mjs';
import { expectMotionWithinBudget, expectNoMotion } from './lib/motion';

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

// Orden vertical del hero tras el rediseño de la ronda 2: h1, subtítulo, CTA y después la lista de clientes.
// La descripción ya no vive en el hero: sus textos pasaron a #problema y `.hero-desc` quedó como contenedor
// vacío y oculto (display: none), así que no entra en el orden visual.
const HERO_ORDER = ['h1', 'subtitle', 'cta', 'clients'] as const;

const PURPLE = PURPLE_RGB;

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
  clients: '#inicio .hero-clients',
};

const viewports = [
  // Relleno del hero tras el rediseño de la ronda 2 (Hero.astro): arriba 3rem (48 px) y 4.5rem (72 px) desde 64em;
  // abajo `--section-y`, igual que el resto de secciones (96 px en escritorio, 64 px en móvil).
  { name: '1280 px', width: 1280, height: 800, sectionY: 96, heroTop: 72, heroBottom: 96 },
  { name: '390 px', width: 390, height: 844, sectionY: 64, heroTop: 48, heroBottom: 64 },
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

    test('el subtítulo sale del YAML y la descripción ya no se pinta en el hero (contenedor vacío y oculto)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#inicio .hero-sub')).toHaveText(SUBTITLE_TEXT);
      // Los tres textos siguen en el YAML (ahora los consume #problema), pero el hero deja su contenedor vacío.
      expect(DESCRIPTION_TEXTS).toHaveLength(3);
      const desc = page.locator('#inicio .hero-desc');
      await expect(desc).toHaveCount(1);
      await expect(desc).toBeHidden();
      await expect(desc).toHaveAttribute('aria-hidden', 'true');
      await expect(desc).toBeEmpty();
      await expect(page.locator('#inicio .hero-desc p')).toHaveCount(0);
    });

    // Tras el rediseño de la ronda 2 el CTA del header se muestra en todos los anchos (compacto en móvil, ver
    // SiteHeader.astro). Se exige h1 y subtítulo completos en el primer pantallazo, ambos CTA visibles con #agenda
    // y el CTA del hero dentro del ancho.
    test('h1 y subtítulo caben en el primer pantallazo y los CTA del header y del hero llevan #agenda', async ({
      page,
    }) => {
      await page.goto('/');
      for (const selector of [HERO_SELECTORS.h1, HERO_SELECTORS.subtitle]) {
        const r = await box(page, selector);
        expect(r.top, selector).toBeGreaterThanOrEqual(0);
        expect(r.bottom, selector).toBeLessThanOrEqual(vp.height);
      }
      const headerCta = page.locator('header a[data-cta="header"]');
      await expect(headerCta).toHaveAttribute('href', '#agenda');
      await expect(headerCta).toBeVisible();
      const h = await box(page, 'header a[data-cta="header"]');
      expect(h.top).toBeGreaterThanOrEqual(0);
      expect(h.bottom).toBeLessThanOrEqual(vp.height);
      expect(h.right).toBeLessThanOrEqual(vp.width);
      const cta = page.locator('#inicio a[data-cta="hero"]');
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', '#agenda');
      const r = await box(page, HERO_SELECTORS.cta);
      expect(r.left).toBeGreaterThanOrEqual(0);
      expect(r.right).toBeLessThanOrEqual(vp.width);
    });

    test('orden vertical del hero: h1, subtítulo, CTA, clientes', async ({ page }) => {
      await page.goto('/');
      const tops: number[] = [];
      for (const key of HERO_ORDER) tops.push((await box(page, HERO_SELECTORS[key])).top);
      const sorted = [...tops].sort((a, b) => a - b);
      expect(tops).toEqual(sorted);
    });

    test(`padding de #inicio (arriba ${vp.heroTop} px, abajo ${vp.heroBottom} px) y de #agenda (${vp.sectionY} px)`, async ({
      page,
    }) => {
      await page.goto('/');
      await expect(page.locator('#inicio')).toHaveCSS('padding-top', `${vp.heroTop}px`);
      await expect(page.locator('#inicio')).toHaveCSS('padding-bottom', `${vp.heroBottom}px`);
      await expect(page.locator('#agenda')).toHaveCSS('padding-top', `${vp.sectionY}px`);
      await expect(page.locator('#agenda')).toHaveCSS('padding-bottom', `${vp.sectionY}px`);
    });

    test('el h2 de #agenda sigue en blanco sobre el tono morado', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#agenda-title')).toHaveCSS('color', 'rgb(255, 255, 255)');
    });
  });
}

// ---------------------------------------------------------------------------------------------
// Tarea 3: orden y tono de las secciones, jerarquía de encabezados, desborde a cinco anchos,
// primer pantallazo, collage del hero (accesible, liviano, sin movimiento), sin JavaScript y
// herramienta de capturas por lote.
// ---------------------------------------------------------------------------------------------

type Tone = 'light' | 'yellow' | 'dark' | 'purple';

// Orden canónico de las 12 secciones de `main` y su tono tras el rediseño de la ronda 2 (src/pages/index.astro).
// Cambios frente al orden original: ya no hay tono `yellow` en las secciones (por-que-ahora y faq pasaron a
// `light`, nosotros a `dark`) y #agenda va antes de #faq.
const PAGE_ORDER: ReadonlyArray<readonly [string, Tone]> = [
  ['inicio', 'light'],
  ['problema', 'dark'],
  ['por-que-ahora', 'light'],
  ['solucion', 'light'],
  ['resultados', 'dark'],
  ['casos', 'light'],
  ['nosotros', 'dark'],
  ['incluye', 'light'],
  ['como-funciona', 'dark'],
  ['para-quien', 'light'],
  ['agenda', 'purple'],
  ['faq', 'light'],
];
// Único par vecino que repite tono a propósito (ambos `light`, separados por el aire de la sección).
const SAME_TONE_NEIGHBORS: ReadonlyArray<readonly [string, string]> = [['por-que-ahora', 'solucion']];

// Título (h2) de cada sección, en el orden de la página: id de sección a ruta del claim en el YAML.
// `inicio` no aparece: su encabezado es el h1.
const H2_SOURCE: Readonly<Record<string, string>> = {
  problema: 'problem.title',
  'por-que-ahora': 'why_now.title',
  solucion: 'solution.title',
  resultados: 'results.title',
  casos: 'cases.title',
  nosotros: 'team.title',
  incluye: 'includes.title',
  'como-funciona': 'how_it_works.title',
  'para-quien': 'for_whom.title',
  agenda: 'agenda.title',
  faq: 'faq.title',
};
const yamlTree = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as { es: Record<string, unknown> }).es;
const claimAt = (path: string): Claim => {
  const claim = path
    .split('.')
    .reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], yamlTree) as
    | Claim
    | undefined;
  if (typeof claim?.text !== 'string') throw new Error(`H2_SOURCE: ${path} no es un claim con text en el YAML`);
  return claim;
};

test.describe('orden y tono de las secciones', () => {
  test('la constante PAGE_ORDER: 12 ids, solo un par de vecinos repite tono y dark nunca toca purple', () => {
    expect(PAGE_ORDER).toHaveLength(12);
    expect(new Set(PAGE_ORDER.map(([id]) => id)).size).toBe(12);
    for (let i = 1; i < PAGE_ORDER.length; i++) {
      const [, prev] = PAGE_ORDER[i - 1];
      const [, cur] = PAGE_ORDER[i];
      const allowed = SAME_TONE_NEIGHBORS.some(([a, b]) => a === PAGE_ORDER[i - 1][0] && b === PAGE_ORDER[i][0]);
      if (!allowed) expect(cur, `${PAGE_ORDER[i - 1][0]} y ${PAGE_ORDER[i][0]} repiten tono`).not.toBe(prev);
      expect(new Set([prev, cur]), 'dark junto a purple').not.toEqual(new Set(['dark', 'purple']));
    }
  });

  test('las main > section son exactamente las 12 de PAGE_ORDER, en orden y con su tono', async ({
    page,
  }) => {
    await page.goto('/');
    const sections = await page
      .locator('main > section')
      .evaluateAll((els) => els.map((el) => ({ id: el.id, tone: el.getAttribute('data-tone') })));
    expect(sections.map((s) => s.id)).toEqual(PAGE_ORDER.map(([id]) => id));
    expect(sections.map((s) => s.tone)).toEqual(PAGE_ORDER.map(([, tone]) => tone));
  });

  test('hay un solo h1, dentro de #inicio, y 11 h2 con los títulos del YAML en orden', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#inicio h1')).toHaveCount(1);
    const h2 = await page.locator('h2').evaluateAll((els) => els.map((el) => el.textContent?.trim() ?? ''));
    expect(h2).toHaveLength(11);
    expect(h2).toEqual(Object.values(H2_SOURCE).map((path) => resolveText(claimAt(path))));
    // Cada h2 vive en la sección que su id de H2_SOURCE nombra.
    for (const id of Object.keys(H2_SOURCE)) await expect(page.locator(`main > section#${id} h2`)).toHaveCount(1);
  });
});

test.describe('encabezados', () => {
  test('un solo h1, ningún salto de nivel y cada sección con aria-labelledby a un encabezado existente', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((els) => els.map((el) => Number(el.tagName.slice(1))));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `salto de h${levels[i - 1]} a h${levels[i]}`).toBeLessThanOrEqual(1);
    }
    const links = await page.locator('main > section').evaluateAll((els) =>
      els.map((el) => {
        const id = el.getAttribute('aria-labelledby');
        const target = id ? document.getElementById(id) : null;
        return { section: el.id, id, isHeading: !!target && /^H[1-6]$/.test(target.tagName) };
      }),
    );
    for (const l of links) {
      expect(l.id, `${l.section} sin aria-labelledby`).toBeTruthy();
      expect(l.isHeading, `${l.section}: aria-labelledby no apunta a un encabezado`).toBe(true);
    }
  });
});

const WIDTHS = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
] as const;

for (const vp of WIDTHS) {
  test.describe(`hero a ${vp.width} px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('sin scroll horizontal y ninguna sección fuera de [0, ancho]', async ({ page }) => {
      await page.goto('/');
      const m = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        sections: Array.from(document.querySelectorAll('main > section')).map((el) => {
          const r = el.getBoundingClientRect();
          return { id: el.id, left: r.left, right: r.right };
        }),
      }));
      expect(m.scrollWidth).toBeLessThanOrEqual(m.innerWidth);
      for (const s of m.sections) {
        expect(s.left, `${s.id} left`).toBeGreaterThanOrEqual(-0.5);
        expect(s.right, `${s.id} right`).toBeLessThanOrEqual(m.innerWidth + 0.5);
      }
    });

    test('.hero-art no se cruza con .hero-copy y la vitrina cabe en el ancho', async ({ page }) => {
      await page.goto('/');
      const copy = await box(page, '#inicio .hero-copy');
      const art = await box(page, '#inicio .hero-art');
      const overlapX = Math.min(copy.right, art.right) - Math.max(copy.left, art.left);
      const overlapY = Math.min(copy.bottom, art.bottom) - Math.max(copy.top, art.top);
      expect(overlapX > 0.5 && overlapY > 0.5, 'el collage y el texto se cruzan').toBe(false);
      // El arte visible es la vitrina (`.hero-showcase`); el collage vectorial queda como respaldo oculto.
      const svg = await box(page, '#inicio .hero-showcase');
      expect(svg.left).toBeGreaterThanOrEqual(-0.5);
      expect(svg.right).toBeLessThanOrEqual(vp.width + 0.5);
    });
  });
}

test.describe('primer pantallazo', () => {
  test.describe('390x844', () => {
    test.use({ viewport: { width: 390, height: 844 } });
    // Tras la ronda 2 el hero móvil apila copy, arte y clientes: en el primer pantallazo caben h1, subtítulo y CTA
    // completos y el arte ya asoma (empieza dentro de la ventana; su alto completo baja al hacer scroll).
    test('h1, subtítulo y CTA quedan completos en el primer pantallazo y el arte empieza dentro de él', async ({ page }) => {
      await page.goto('/');
      for (const sel of [HERO_SELECTORS.h1, HERO_SELECTORS.subtitle, HERO_SELECTORS.cta]) {
        const r = await box(page, sel);
        expect(r.top, `${sel} top`).toBeGreaterThanOrEqual(0);
        expect(r.bottom, `${sel} bottom`).toBeLessThanOrEqual(844);
        expect(r.left).toBeGreaterThanOrEqual(0);
        expect(r.right).toBeLessThanOrEqual(390);
      }
      const art = await box(page, '.hero-art');
      expect(art.top, 'hero-art top').toBeLessThan(844);
      expect(art.left).toBeGreaterThanOrEqual(0);
      expect(art.right).toBeLessThanOrEqual(390);
    });
  });

  // El CTA del hero conserva su objetivo táctil de 44 px y el subtítulo (único texto corrido del hero desde la ronda 2)
  // el ritmo tipográfico.
  for (const [width, height] of [[360, 740], [390, 844], [412, 915], [375, 667]] as const) {
    test.describe(`${width}x${height}: CTA del hero y ritmo tipográfico`, () => {
      test.use({ viewport: { width, height } });
      test('el CTA tiene 44 px de objetivo y el subtítulo cumple ritmo', async ({ page }) => {
        await page.goto('/');
        const r = await box(page, HERO_SELECTORS.cta);
        expect(r.bottom - r.top, 'alto del CTA').toBeGreaterThanOrEqual(44);
        expect(r.left).toBeGreaterThanOrEqual(0);
        expect(r.right).toBeLessThanOrEqual(width);
        // Ritmo sin romper A11Y.md: interlineado >= 1.5 y ancho máximo <= 80ch.
        const rhythm = await page.evaluate(() => {
          const p = document.querySelector('#inicio .hero-sub') as HTMLElement;
          const cs = getComputedStyle(p);
          const probe = document.createElement('div');
          probe.style.cssText = 'position:absolute;visibility:hidden;width:80ch';
          p.appendChild(probe);
          const cap = probe.getBoundingClientRect().width;
          probe.remove();
          return { lh: parseFloat(cs.lineHeight) / parseFloat(cs.fontSize), maxW: parseFloat(cs.maxWidth), cap };
        });
        expect(rhythm.lh).toBeGreaterThanOrEqual(1.5);
        expect(rhythm.maxW).toBeLessThanOrEqual(rhythm.cap);
      });
    });
  }

  test.describe('1280x800', () => {
    test.use({ viewport: { width: 1280, height: 800 } });
    test('h1, subtítulo y la vitrina del hero completos, con la vitrina a la derecha del texto', async ({
      page,
    }) => {
      await page.goto('/');
      for (const sel of [HERO_SELECTORS.h1, HERO_SELECTORS.subtitle, '#inicio .hero-showcase']) {
        const r = await box(page, sel);
        expect(r.top, `${sel} top`).toBeGreaterThanOrEqual(0);
        expect(r.bottom, `${sel} bottom`).toBeLessThanOrEqual(800);
        expect(r.left).toBeGreaterThanOrEqual(0);
        expect(r.right).toBeLessThanOrEqual(1280);
      }
      const copy = await box(page, '#inicio .hero-copy');
      const svg = await box(page, '#inicio .hero-showcase');
      expect(svg.left).toBeGreaterThanOrEqual(copy.right - 0.5);
    });

    test('el h1 mide 64 px, peso 700 y color morado', async ({ page }) => {
      await page.goto('/');
      const h1 = page.locator('#inicio h1');
      await expect(h1).toHaveCSS('font-size', '64px');
      await expect(h1).toHaveCSS('font-weight', '700');
      await expect(h1).toHaveCSS('color', PURPLE);
    });
  });
});

test.describe('collage del hero', () => {
  // Desde la ronda 2 el arte visible del hero es la vitrina (una img decorativa); el collage vectorial vive en
  // `.hero-collage-fallback` con `display: none` (aria-hidden) y conserva su contrato accesible y de peso.
  test('vitrina visible con una img decorativa y collage de respaldo oculto: aria-hidden, svg sin title ni text, una sola img de foto y liviano', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('div.hero-collage[data-collage="hero"]');
    await expect(root).toHaveCount(1);
    await expect(root).toHaveAttribute('aria-hidden', 'true');
    const svg = root.locator('svg');
    await expect(svg).toHaveCount(1);
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('focusable', 'false');
    await expect(svg.locator('title')).toHaveCount(0);
    await expect(svg.locator('text')).toHaveCount(0);
    const showcaseImg = page.locator('#inicio .hero-showcase img');
    await expect(showcaseImg).toHaveCount(1);
    await expect(showcaseImg).toBeVisible();
    await expect(showcaseImg).toHaveAttribute('alt', '');
    await expect(page.locator('#inicio .hero-collage-fallback')).toBeHidden();
    await expect(page.locator('#inicio .hero-collage-fallback')).toHaveAttribute('aria-hidden', 'true');
    await expect(root).toBeHidden();
    await expect(page.locator('#inicio .hero-art img')).toHaveCount(2);
    await expect(root.locator('[data-photo-frame] img')).toHaveCount(1);
    await expect(root.locator('img')).toHaveCount(1);
    await expect(svg.locator('image')).toHaveCount(0);
    const size = await root.evaluate((el) => el.outerHTML.length);
    expect(size).toBeLessThan(8832);
  });

  test('seis grupos nombrados con --i, --r y --r-from y dos pupilas', async ({ page }) => {
    await page.goto('/');
    const pieces = await page
      .locator('.hero-collage [data-piece]')
      .evaluateAll((els) => els.map((el) => ({ name: el.getAttribute('data-piece') ?? '', style: el.getAttribute('style') ?? '' })));
    expect(pieces.map((p) => p.name).sort()).toEqual(['doodles', 'dots', 'loopy', 'panel', 'pills', 'stage']);
    for (const p of pieces) {
      expect(p.style).toMatch(/--i:\s*\d/);
      expect(p.style).toMatch(/--r:\s*-?\d/);
      expect(p.style).toMatch(/--r-from:\s*-?\d/);
    }
    const order = pieces.map((p) => Number(p.style.match(/--i:\s*(\d)/)?.[1])).sort();
    expect(order).toEqual([0, 1, 2, 3, 4, 5]);
    expect(await page.locator('.hero-collage .hc-pupil').count()).toBe(2);
    expect(await page.locator('.hero-collage [data-pupil]').count()).toBe(2);
  });
});

test(`el HTML de / pesa menos de ${HTML_RAW_MAX} bytes crudos y ${HTML_GZIP_MAX} con gzip`, async ({ page }) => {
  // Topes en tests/e2e/lib/budgets.mjs (única fuente, con su justificación).
  const res = await page.request.get('/');
  expect(res.ok()).toBe(true);
  const body = await res.body();
  expect(body.length).toBeLessThan(HTML_RAW_MAX);
  expect(gzipSync(body, { level: 9 }).length).toBeLessThan(HTML_GZIP_MAX);
});

for (const mode of ['reduce', 'no-preference'] as const) {
  test(`sin animaciones y con opacidad 1 en el hero (prefers-reduced-motion: ${mode})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: mode });
    await page.goto('/');
    await page.waitForTimeout(400);
    if (mode === 'reduce') await expectNoMotion(page);
    else await expectMotionWithinBudget(page);
    for (const sel of [HERO_SELECTORS.h1, HERO_SELECTORS.subtitle, HERO_SELECTORS.cta]) {
      await expect(page.locator(sel).first()).toHaveCSS('opacity', '1');
    }
  });
}

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('el hero es visible y el CTA lleva #agenda', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#inicio h1')).toBeVisible();
    await expect(page.locator('#inicio .hero-sub')).toBeVisible();
    await expect(page.locator('#inicio a[data-cta="hero"]')).toBeVisible();
    await expect(page.locator('#inicio a[data-cta="hero"]')).toHaveAttribute('href', '#agenda');
    await expect(page.locator('#inicio .hero-showcase img')).toBeVisible();
  });
});

// Herramienta de capturas por lote. Solo corre con PHASE2_BATCH definida (p. ej. PHASE2_BATCH=A).
// Guarda test-results/phase2/<lote>-<ancho>[-reduce|-nojs].png a página completa, con todo lo que
// no es localhost abortado (ClickUp incluido).
test.describe('captura de lote', () => {
  test.skip(!process.env.PHASE2_BATCH, 'define PHASE2_BATCH (p. ej. A) para generar capturas');
  const variants = [
    { suffix: '', reducedMotion: 'no-preference' as const, javaScriptEnabled: true },
    { suffix: '-reduce', reducedMotion: 'reduce' as const, javaScriptEnabled: true },
    { suffix: '-nojs', reducedMotion: 'no-preference' as const, javaScriptEnabled: false },
  ];
  for (const vp of WIDTHS) {
    for (const v of variants) {
      test(`captura ${vp.width}${v.suffix}`, async ({ browser, baseURL }) => {
        const context = await browser.newContext({
          baseURL,
          viewport: { width: vp.width, height: vp.height },
          reducedMotion: v.reducedMotion,
          javaScriptEnabled: v.javaScriptEnabled,
        });
        await context.route('**/*', (route) => {
          const host = new URL(route.request().url()).hostname;
          return host === 'localhost' || host === '127.0.0.1' ? route.continue() : route.abort();
        });
        const page = await context.newPage();
        await page.goto('/');
        await page.screenshot({
          path: `test-results/phase2/${process.env.PHASE2_BATCH}-${vp.width}${v.suffix}.png`,
          fullPage: true,
        });
        await context.close();
      });
    }
  }
});
