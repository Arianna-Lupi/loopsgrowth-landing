import { test, expect, type Page } from '@playwright/test';

type Stop = {
  tag: string;
  href: string | null;
  cta: string | null;
  outlineStyle: string;
  outlineWidth: number;
  width: number;
  height: number;
};

/** Describe el elemento que tiene el foco ahora mismo. */
async function activeStop(page: Page): Promise<Stop> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const cs = getComputedStyle(el);
    const box = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      href: el.getAttribute('href'),
      cta: el.getAttribute('data-cta'),
      outlineStyle: cs.outlineStyle,
      outlineWidth: parseFloat(cs.outlineWidth),
      width: box.width,
      height: box.height,
    };
  });
}

/** Tab repetido hasta llegar al iframe (o a un máximo de paradas). */
async function tabUntilIframe(page: Page, max = 12): Promise<Stop[]> {
  const stops: Stop[] = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    const stop = await activeStop(page);
    stops.push(stop);
    if (stop.tag === 'IFRAME') break;
  }
  return stops;
}

test.describe('orden de tabulación y foco a 1280 px', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('(a) el orden es skip 1, skip 2, CTA del header, CTA del hero y el iframe', async ({ page }) => {
    await page.goto('/');
    const stops = await tabUntilIframe(page);
    const order = stops.map((s) => (s.cta ? `cta:${s.cta}` : s.tag === 'IFRAME' ? 'iframe' : `a:${s.href}`));
    // La Fase 1 termina con el enlace de respaldo entre el CTA del hero y el iframe;
    // el Task 3 lo agrega a esta lista junto con su componente.
    expect(order).toEqual(['a:#main', 'a:#agenda', 'cta:header', 'cta:hero', 'iframe']);
  });

  test('(c) cada parada muestra un contorno sólido de 2 px o más', async ({ page }) => {
    await page.goto('/');
    const stops = await tabUntilIframe(page);
    expect(stops.length).toBeGreaterThanOrEqual(5);
    // Al entrar al iframe, Chromium deja `document.activeElement` en el IFRAME pero el
    // elemento no coincide con `:focus` ni `:focus-visible` (el foco vive en el documento
    // de ClickUp), así que el contorno del interior es de ClickUp y no medible desde aquí.
    for (const stop of stops.filter((s) => s.tag !== 'IFRAME')) {
      expect(stop.outlineStyle, `${stop.tag} ${stop.href ?? stop.cta ?? ''}`).not.toBe('none');
      expect(stop.outlineWidth, `${stop.tag} ${stop.href ?? stop.cta ?? ''}`).toBeGreaterThanOrEqual(2);
    }
  });

  test('(d) los skip links y los CTA miden 44 px o más (48 px de alto el CTA del hero)', async ({ page }) => {
    await page.goto('/');
    const stops = (await tabUntilIframe(page)).filter((s) => s.tag !== 'IFRAME');
    for (const stop of stops) {
      expect(stop.width, `ancho de ${stop.href ?? stop.cta}`).toBeGreaterThanOrEqual(44);
      expect(stop.height, `alto de ${stop.href ?? stop.cta}`).toBeGreaterThanOrEqual(44);
    }
    const hero = stops.find((s) => s.cta === 'hero');
    expect(hero?.height).toBeGreaterThanOrEqual(48);
  });

  test('(f) un skip link enfocado queda a la vista, sin nada encima, con captura', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const link = page.locator('.skip a[href="#main"]');
    await expect(link).toBeFocused();
    const onTop = await link.evaluate((el) => {
      const box = el.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return { inside: hit === el || el.contains(hit), top: box.top, left: box.left };
    });
    expect(onTop.inside).toBe(true);
    expect(onTop.top).toBeGreaterThanOrEqual(0);
    expect(onTop.left).toBeGreaterThanOrEqual(0);
    await page.screenshot({ path: 'test-results/skip-link-focused.png', clip: { x: 0, y: 0, width: 640, height: 160 } });
  });

  test('(g) Enter sobre el skip link 1 deja el foco en #main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('(h) pesos del brandbook: skip 600; CTA, h1, h2 y wordmark 700; subtítulo y body 400', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const weight = (selector: string) =>
      page.locator(selector).first().evaluate((el) => getComputedStyle(el).fontWeight);
    expect(await weight('.skip a[href="#main"]')).toBe('600');
    expect(await weight('a[data-cta="hero"]')).toBe('700');
    expect(await weight('h1')).toBe('700');
    expect(await weight('#agenda-title')).toBe('700');
    expect(await weight('.wordmark')).toBe('700');
    expect(await weight('.hero-sub')).toBe('400');
    expect(await weight('body')).toBe('400');
  });
});

test.describe('marco de página', () => {
  test('(e) lang es, un solo h1, header estático y sin tabindex positivo', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('h1')).toHaveCount(1);
    const headerPosition = await page.locator('header').evaluate((el) => getComputedStyle(el).position);
    expect(headerPosition).toBe('static');
    // (b) ningún elemento con tabindex mayor a 0
    const positive = await page.evaluate(() =>
      [...document.querySelectorAll('[tabindex]')].filter((el) => Number(el.getAttribute('tabindex')) > 0).length,
    );
    expect(positive).toBe(0);
  });
});

test.describe('orden de tabulación a 390 px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('(a) el CTA del header queda fuera del orden', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[data-cta="header"]')).toBeHidden();
    const stops = await tabUntilIframe(page);
    expect(stops.some((s) => s.cta === 'header')).toBe(false);
    expect(stops.map((s) => (s.cta ? `cta:${s.cta}` : s.tag === 'IFRAME' ? 'iframe' : `a:${s.href}`))).toEqual([
      'a:#main',
      'a:#agenda',
      'cta:hero',
      'iframe',
    ]);
  });
});
