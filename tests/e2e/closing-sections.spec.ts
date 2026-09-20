import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { findInversion } from '../../scripts/lib/copy-rules.mjs';

// Secciones de cierre y footer (plan 02-06). Los textos y las cantidades esperadas salen del YAML y
// no se copian a mano (COPY-01): si Ari entrega un texto, la prueba sigue midiendo lo que la página
// debe mostrar. Los espacios se normalizan porque el HTML colapsa los repetidos.
type Claim = { text: string; status: string };
const es = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    for_whom: {
      title: Claim;
      is_for: { title: Claim; items: Claim[] };
      is_not_for: { title: Claim; items: Claim[] };
    };
    faq: { title: Claim; items: { question: Claim; answer: Claim }[] };
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

// ---------------------------------------------------------------------------------------------
// Para quién es (CONT-10) y FAQ (CONT-11), plan 02-06 tarea 2. Todo se deriva del YAML.
const YELLOW_RGB = 'rgb(255, 198, 2)';
const WHITE_RGB = 'rgb(255, 255, 255)';
const FAQ_ITEMS = es.faq.items;

type Box = { x: number; y: number; width: number; height: number };
const boxOf = async (page: Page, selector: string, index = 0): Promise<Box> => {
  const box = await page.locator(selector).nth(index).boundingBox();
  expect(box, `caja de ${selector}[${index}]`).not.toBeNull();
  return box as Box;
};

test.describe('Para quién es a 1280 px', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('h2, h3 e ítems salen del YAML y en su orden', async ({ page }) => {
    await page.goto('/');
    expect(norm((await page.locator('#para-quien h2').textContent()) ?? '')).toBe(norm(es.for_whom.title.text));
    const h3 = (await page.locator('#para-quien h3').allTextContents()).map(norm);
    expect(h3).toEqual([norm(es.for_whom.is_for.title.text), norm(es.for_whom.is_not_for.title.text)]);
    const columns = [es.for_whom.is_for.items, es.for_whom.is_not_for.items];
    for (const [i, items] of columns.entries()) {
      const texts = (await page.locator('#para-quien ul').nth(i).locator('li').allTextContents()).map(norm);
      expect(texts).toEqual(items.map((c) => norm(c.text)));
    }
  });

  test('listas con role list, aria-labelledby al h3 y un icono SVG decorativo por ítem', async ({ page }) => {
    await page.goto('/');
    const lists = page.locator('#para-quien ul');
    await expect(lists).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      await expect(lists.nth(i)).toHaveAttribute('role', 'list');
      const labelledby = await lists.nth(i).getAttribute('aria-labelledby');
      expect(labelledby).toBeTruthy();
      await expect(page.locator(`#${labelledby}`)).toHaveCount(1);
      const items = await lists.nth(i).locator('li').count();
      const icons = lists.nth(i).locator('li > svg[aria-hidden="true"][focusable="false"]');
      await expect(icons).toHaveCount(items);
      const size = await icons.first().evaluate((el) => {
        const box = el.getBoundingClientRect();
        return { w: box.width, h: box.height };
      });
      expect(size).toEqual({ w: 24, h: 24 });
    }
  });

  test('estilos calculados: tarjeta "es" amarilla con borde sólido y sombra; "no es" blanca con borde discontinuo y sin sombra', async ({ page }) => {
    await page.goto('/');
    const style = (selector: string) =>
      page.locator(selector).evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          bg: cs.backgroundColor,
          borderStyle: cs.borderTopStyle,
          borderWidth: cs.borderTopWidth,
          shadow: cs.boxShadow,
          radius: cs.borderTopLeftRadius,
          cursor: cs.cursor,
          transition: cs.transitionDuration,
        };
      });
    const isFor = await style('#para-quien .fw-is-for');
    expect(isFor).toMatchObject({ bg: YELLOW_RGB, borderStyle: 'solid', borderWidth: '3px', radius: '16px' });
    expect(isFor.shadow).not.toBe('none');
    const isNot = await style('#para-quien .fw-is-not-for');
    expect(isNot).toMatchObject({ bg: WHITE_RGB, borderStyle: 'dashed', borderWidth: '3px', shadow: 'none', radius: '16px' });
    for (const s of [isFor, isNot]) {
      expect(s.cursor).not.toBe('pointer');
      expect(s.transition).toBe('0s');
    }
  });

  test('sin enlaces, botones ni CTA dentro de la sección', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#para-quien a, #para-quien button, #para-quien [data-cta]')).toHaveCount(0);
  });

  test('ningún texto de la sección publica una cifra de inversión mensual', async ({ page }) => {
    await page.goto('/');
    const text = (await page.locator('#para-quien').innerText()).replace(/\s+/g, ' ');
    expect(findInversion(text)).toEqual([]);
  });
});

for (const width of [320, 390, 640, 768, 1024, 1280]) {
  test.describe(`Para quién es a ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('columnas, orden, gap de 24 px y alturas iguales', async ({ page }) => {
      await page.goto('/');
      const a = await boxOf(page, '#para-quien .fw-card', 0);
      const b = await boxOf(page, '#para-quien .fw-card', 1);
      if (width < 640) {
        expect(Math.abs(a.x - b.x)).toBeLessThanOrEqual(1);
        expect(b.y).toBeGreaterThanOrEqual(a.y + a.height);
        expect(Math.round(b.y - (a.y + a.height))).toBe(24);
      } else {
        expect(a.x).toBeLessThan(b.x);
        expect(Math.round(b.x - (a.x + a.width))).toBe(24);
        expect(Math.abs(a.height - b.height)).toBeLessThanOrEqual(1);
        expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1);
      }
      expect(await noHorizontalScroll(page)).toBeLessThanOrEqual(0);
    });
  });
}

test.describe('FAQ a 1280 px', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('un details por elemento del YAML, con pregunta y respuesta tal cual y en orden', async ({ page }) => {
    await page.goto('/');
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(5);
    expect(FAQ_ITEMS.length).toBeLessThanOrEqual(6);
    expect(norm((await page.locator('#faq h2').textContent()) ?? '')).toBe(norm(es.faq.title.text));
    await expect(page.locator('#faq details')).toHaveCount(FAQ_ITEMS.length);
    const questions = (await page.locator('#faq summary').allTextContents()).map(norm);
    expect(questions).toEqual(FAQ_ITEMS.map((i) => norm(i.question.text)));
    const answers = (await page.locator('#faq details .faq-answer').evaluateAll((els) => els.map((e) => e.textContent ?? ''))).map(norm);
    expect(answers).toEqual(FAQ_ITEMS.map((i) => norm(i.answer.text)));
  });

  test('todos cerrados al cargar y ninguno con name', async ({ page }) => {
    await page.goto('/');
    const state = await page.locator('#faq details').evaluateAll((els) =>
      els.map((e) => ({ open: (e as HTMLDetailsElement).open, name: e.getAttribute('name') })),
    );
    expect(state.every((d) => d.open === false && d.name === null)).toBe(true);
  });

  test('Enter abre el primero y Espacio lo cierra', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('#faq details').first();
    await page.locator('#faq summary').first().focus();
    await page.keyboard.press('Enter');
    expect(await first.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
    await page.keyboard.press('Space');
    expect(await first.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);
  });

  test('abrir uno no cierra los demás (no exclusivos)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq summary').nth(0).click();
    await page.locator('#faq summary').nth(1).click();
    const open = await page.locator('#faq details').evaluateAll((els) => els.map((e) => (e as HTMLDetailsElement).open));
    expect(open.slice(0, 2)).toEqual([true, true]);
  });

  test('estilos del summary y del details, y separación de 16 px entre tarjetas cerradas', async ({ page }) => {
    await page.goto('/');
    const summary = await page.locator('#faq summary').first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        display: cs.display,
        justify: cs.justifyContent,
        align: cs.alignItems,
        height: el.getBoundingClientRect().height,
        padding: cs.paddingTop,
        cursor: cs.cursor,
        listStyle: cs.listStyleType,
        weight: getComputedStyle(el.querySelector('.faq-question') as Element).fontWeight,
        transition: cs.transitionDuration,
      };
    });
    expect(summary).toMatchObject({ display: 'flex', justify: 'space-between', align: 'center', padding: '24px', cursor: 'pointer', listStyle: 'none', weight: '700', transition: '0s' });
    expect(summary.height).toBeGreaterThanOrEqual(44);
    const card = await page.locator('#faq details').first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { borderWidth: cs.borderTopWidth, borderStyle: cs.borderTopStyle, radius: cs.borderTopLeftRadius, bg: cs.backgroundColor };
    });
    expect(card).toEqual({ borderWidth: '3px', borderStyle: 'solid', radius: '16px', bg: WHITE_RGB });
    const a = await boxOf(page, '#faq details', 0);
    const b = await boxOf(page, '#faq details', 1);
    expect(Math.round(b.y - (a.y + a.height))).toBe(16);
  });

  test('icono de 24 px: la barra vertical se ve cerrado y se oculta abierto', async ({ page }) => {
    await page.goto('/');
    const icon = await boxOf(page, '#faq .faq-icon', 0);
    expect({ w: icon.width, h: icon.height }).toEqual({ w: 24, h: 24 });
    const display = () => page.locator('#faq .faq-icon-v').first().evaluate((el) => getComputedStyle(el).display);
    expect(await display()).not.toBe('none');
    await page.locator('#faq summary').first().click();
    expect(await display()).toBe('none');
  });

  test('el anillo de foco con Tab es sólido, de 3 px, con offset negativo y queda dentro de la tarjeta', async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq summary').first().focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const ring = await page.locator('#faq summary').first().evaluate((el) => {
      const cs = getComputedStyle(el);
      const s = el.getBoundingClientRect();
      const c = (el.parentElement as HTMLElement).getBoundingClientRect();
      return {
        focused: document.activeElement === el,
        style: cs.outlineStyle,
        width: cs.outlineWidth,
        offset: parseFloat(cs.outlineOffset),
        inside: s.left >= c.left && s.right <= c.right && s.top >= c.top && s.bottom <= c.bottom,
      };
    });
    expect(ring).toMatchObject({ focused: true, style: 'solid', width: '3px', inside: true });
    expect(ring.offset).toBeLessThan(0);
  });

  test('dos columnas 5 a 7 con gap de 48 px y el h2 a la izquierda de la lista', async ({ page }) => {
    await page.goto('/');
    const h2 = await boxOf(page, '#faq h2');
    const list = await boxOf(page, '#faq .faq-list');
    expect(h2.x).toBeLessThan(list.x);
    expect(Math.round(list.x - (h2.x + h2.width))).toBe(48);
    expect(Math.abs(h2.width / (h2.width + list.width) - 5 / 12)).toBeLessThanOrEqual(0.02);
  });
});

for (const width of [320, 390, 768, 1023]) {
  test.describe(`FAQ a ${width} px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('una columna, padding responsivo y sin desborde', async ({ page }) => {
      await page.goto('/');
      const h2 = await boxOf(page, '#faq h2');
      const list = await boxOf(page, '#faq .faq-list');
      expect(Math.abs(h2.x - list.x)).toBeLessThanOrEqual(1);
      expect(list.y).toBeGreaterThanOrEqual(h2.y + h2.height);
      const padding = await page.locator('#faq summary').first().evaluate((el) => getComputedStyle(el).paddingLeft);
      expect(padding).toBe(width < 640 ? '16px' : '24px');
      expect(await noHorizontalScroll(page)).toBeLessThanOrEqual(0);
    });
  });
}

test.describe('FAQ sin JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });

  test('Enter sobre el primer resumen agrega open', async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq summary').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(page.locator('#faq details').first()).not.toHaveAttribute('open', '');
  });
});

for (const motion of ['reduce', 'no-preference'] as const) {
  test(`cero animaciones en Para quién es y FAQ con movimiento ${motion}, antes y después de abrir`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: motion });
    await page.goto('/');
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await page.locator('#faq summary').first().click();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
}

// Recortes del lote (herramienta de capturas, Supuesto 10). Solo con PHASE2_BATCH definida.
test.describe('recorte de Para quién es y FAQ', () => {
  test.skip(!process.env.PHASE2_BATCH, 'define PHASE2_BATCH (por ejemplo D06) para generar los recortes');
  for (const width of [390, 1280]) {
    for (const id of ['para-quien', 'faq']) {
      test(`recorte de #${id} a ${width}`, async ({ browser, baseURL }) => {
        const batch = process.env.PHASE2_BATCH!;
        const context = await browser.newContext({ baseURL, viewport: { width, height: 900 } });
        await context.route('**/*', (route) => {
          const host = new URL(route.request().url()).hostname;
          return host === 'localhost' || host === '127.0.0.1' ? route.continue() : route.abort();
        });
        const page = await context.newPage();
        await page.goto('/');
        await page.locator(`#${id}`).screenshot({ path: `test-results/phase2/${batch}-${id}-${width}.png` });
        await context.close();
      });
    }
  }
});
