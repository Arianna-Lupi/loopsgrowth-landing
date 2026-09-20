import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Secciones de cierre y footer (plan 02-06). Los textos y las cantidades esperadas salen del YAML y
// no se copian a mano (COPY-01): si Ari entrega un texto, la prueba sigue midiendo lo que la página
// debe mostrar. Los espacios se normalizan porque el HTML colapsa los repetidos.
type Claim = { text: string; status: string };
const es = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    footer: { nav_label: Claim; privacy_link: Claim };
    privacy: { title: Claim; body: Claim[] };
  };
}).es;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const PRIVACY_PATH = '/privacidad/';

const WIDTHS = [320, 390, 768, 1024, 1280];

/** Ningún elemento hace crecer la página en horizontal. */
async function noHorizontalScroll(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test.describe('/privacidad a 1280 px', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('responde 200 con un solo h1 del YAML, sin h2 y un párrafo por elemento del cuerpo', async ({ page }) => {
    const response = await page.goto(PRIVACY_PATH);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(norm((await page.locator('h1').textContent()) ?? '')).toBe(norm(es.privacy.title.text));
    await expect(page.locator('h2')).toHaveCount(0);
    const paragraphs = (await page.locator('main p').allTextContents()).map(norm);
    expect(paragraphs).toEqual(es.privacy.body.map((c) => norm(c.text)));
  });

  test('lleva noindex y ningún canonical', async ({ page }) => {
    await page.goto(PRIVACY_PATH);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test('el CTA del header apunta a /#agenda aquí y a #agenda en /', async ({ page }) => {
    await page.goto(PRIVACY_PATH);
    await expect(page.locator('a[data-cta="header"]')).toHaveAttribute('href', '/#agenda');
    await page.goto('/');
    await expect(page.locator('a[data-cta="header"]')).toHaveAttribute('href', '#agenda');
  });

  test('un solo skip link (#main) aquí y dos en /', async ({ page }) => {
    await page.goto(PRIVACY_PATH);
    const here = await page.locator('.skip a').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(here).toEqual(['#main']);
    await page.goto('/');
    const home = await page.locator('.skip a').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(home).toEqual(['#main', '#agenda']);
  });

  test('todo enlace interno de ancla resuelve a un id que existe', async ({ page }) => {
    for (const path of [PRIVACY_PATH, '/']) {
      await page.goto(path);
      const missing = await page.evaluate(() =>
        [...document.querySelectorAll('a[href^="#"]')]
          .map((a) => a.getAttribute('href') as string)
          .filter((href) => href.length > 1 && !document.getElementById(href.slice(1))),
      );
      expect(missing, `anclas sin destino en ${path}`).toEqual([]);
    }
  });

  test('el enlace de privacidad del pie de / abre la página y en ella lleva aria-current', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('footer a[href="/privacidad/"]');
    await expect(link).toHaveCount(1);
    expect(norm((await link.textContent()) ?? '')).toBe(norm(es.footer.privacy_link.text));
    await expect(link).not.toHaveAttribute('aria-current', /.*/);
    await link.click();
    await expect(page).toHaveURL(/\/privacidad\/$/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('footer a[href="/privacidad/"]')).toHaveAttribute('aria-current', 'page');
  });

  test('el pie es un landmark con su nav etiquetado y sin encabezados', async ({ page }) => {
    await page.goto(PRIVACY_PATH);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveAttribute('data-tone', 'light');
    const nav = page.locator('footer nav');
    await expect(nav).toHaveCount(1);
    await expect(nav).toHaveAttribute('aria-label', es.footer.nav_label.text);
    await expect(page.locator('footer h1, footer h2, footer h3, footer h4')).toHaveCount(0);
  });

  test('el CTA del header lleva a /#agenda y deja el foco en el h2 de #agenda', async ({ page }) => {
    await page.goto(PRIVACY_PATH);
    await page.locator('a[data-cta="header"]').click();
    await expect(page).toHaveURL(/\/#agenda$/);
    await expect(page.locator('#agenda-title')).toBeFocused();
  });

  test('orden de tabulación: skip, CTA del header y enlace de privacidad, sin tabindex positivo', async ({ page }) => {
    await page.goto(PRIVACY_PATH);
    const stops: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      stops.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return el.getAttribute('data-cta') ? `cta:${el.getAttribute('data-cta')}` : `a:${el.getAttribute('href')}`;
        }),
      );
    }
    expect(stops[0]).toBe('a:#main');
    const header = stops.indexOf('cta:header');
    const privacy = stops.indexOf('a:/privacidad/');
    expect(header).toBeGreaterThan(0);
    expect(privacy).toBeGreaterThan(header);
    const positive = await page.evaluate(
      () => [...document.querySelectorAll('[tabindex]')].filter((el) => Number(el.getAttribute('tabindex')) > 0).length,
    );
    expect(positive).toBe(0);
  });

  test('sin JavaScript propio: la página no carga ningún script', async ({ page }) => {
    await page.goto(PRIVACY_PATH);
    await expect(page.locator('script')).toHaveCount(0);
  });

  test('las únicas peticiones fuera de localhost son de ClickUp (ninguna en /privacidad)', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') external.push(url.hostname);
    });
    await page.goto(PRIVACY_PATH);
    await page.waitForLoadState('networkidle');
    expect(external).toEqual([]);
  });
});

for (const width of WIDTHS) {
  test.describe(`/privacidad y / a ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('sin scroll horizontal en /privacidad', async ({ page }) => {
      await page.goto(PRIVACY_PATH);
      expect(await noHorizontalScroll(page)).toBeLessThanOrEqual(0);
    });
  });
}

for (const motion of ['reduce', 'no-preference'] as const) {
  test(`cero animaciones en /privacidad con movimiento ${motion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: motion });
    await page.goto(PRIVACY_PATH);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
}
