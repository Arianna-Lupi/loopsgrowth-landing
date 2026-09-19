import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { walkClaims, MISSING_MARK } from '../../scripts/lib/copy-rules.mjs';

// Los textos esperados salen del YAML (walkClaims y el propio arreglo): nunca cadenas escritas a mano
// (COPY-01). Los espacios se normalizan al comparar porque el HTML colapsa el espacio doble del doc de Ari.
type Claim = { text: string; status: string };
type Pillar = { title: Claim; body: Claim; list?: Claim[] };
const doc = parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    problem: { title: Claim; items: Claim[]; closing: Claim };
    why_now: { title: Claim; items: Claim[] };
    solution: { title: Claim; lead: Claim; items: Pillar[] };
  };
};
const es = doc.es;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const marksUnder = (prefix: string) =>
  walkClaims(doc).filter(
    (n: { kind: string; path: string; claim?: { text: string } }) =>
      n.kind === 'claim' && n.claim?.text === MISSING_MARK && n.path.startsWith(prefix),
  ).length;

const WHITE = 'rgb(255, 255, 255)';
const PURPLE = 'rgb(115, 24, 127)';

const color = (page: Page, sel: string) =>
  page.locator(sel).evaluate((el) => getComputedStyle(el).color);

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
]) {
  test.describe(`tres secciones a ${viewport.width} px`, () => {
    test.use({ viewport });

    test('las tres secciones existen en orden, con su tono y su h2', async ({ page }) => {
      await page.goto('/');
      const ids = await page.evaluate(() => [...document.querySelectorAll('main > section')].map((s) => s.id));
      const idx = (id: string) => ids.indexOf(id);
      expect(idx('problema')).toBeGreaterThan(-1);
      expect(idx('problema')).toBeLessThan(idx('por-que-ahora'));
      expect(idx('por-que-ahora')).toBeLessThan(idx('solucion'));

      await expect(page.locator('#problema')).toHaveAttribute('data-tone', 'dark');
      await expect(page.locator('#por-que-ahora')).toHaveAttribute('data-tone', 'yellow');
      await expect(page.locator('#solucion')).toHaveAttribute('data-tone', 'light');

      const h2 = (id: string) => page.locator(`#${id} h2`);
      expect(norm((await h2('problema').textContent()) ?? '')).toBe(norm(es.problem.title.text));
      expect(norm((await h2('por-que-ahora').textContent()) ?? '')).toBe(norm(es.why_now.title.text));
      // El titular de La solución es la marca de dato faltante (el del doc trae la sigla que la guarda rechaza).
      expect(norm((await h2('solucion').textContent()) ?? '')).toBe(norm(es.solution.title.text));
      expect(await color(page, '#problema h2')).toBe(WHITE);
      expect(await color(page, '#por-que-ahora h2')).toBe(PURPLE);
      expect(await color(page, '#solucion h2')).toBe(PURPLE);
    });

    test('La solución: lead, cuatro h3, cuerpo del Pilar 4 y ninguna palabra rechazada', async ({ page }) => {
      await page.goto('/');
      expect(norm((await page.locator('#solucion .section-lead').textContent()) ?? '')).toBe(
        norm(es.solution.lead.text),
      );
      const h3 = page.locator('#solucion h3');
      await expect(h3).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        expect(norm((await h3.nth(i).textContent()) ?? '')).toBe(norm(es.solution.items[i].title.text));
      }
      const pillars = page.locator('#solucion .pillar-grid > li');
      await expect(pillars).toHaveCount(4);
      // Cuerpo del cuarto pilar: el texto guardado (la marca), no la nota de verificación del doc.
      const fourth = norm((await pillars.nth(3).textContent()) ?? '');
      expect(fourth).toContain(norm(es.solution.items[3].body.text));

      const three = await page.evaluate(() =>
        ['problema', 'por-que-ahora', 'solucion'].map((id) => document.getElementById(id)?.textContent ?? '').join(' '),
      );
      expect(three).not.toMatch(/\bAEO\b/i);
      expect(three).not.toMatch(/\[VERIFICAR/i);
    });

    test('las marcas de dato faltante de las tres secciones vienen del YAML', async ({ page }) => {
      await page.goto('/');
      const expected =
        marksUnder('solution') + marksUnder('problem') + marksUnder('why_now');
      const count = await page.evaluate(
        (mark) =>
          ['problema', 'por-que-ahora', 'solucion']
            .map((id) => (document.getElementById(id)?.innerText ?? '').split(mark).length - 1)
            .reduce((a, b) => a + b, 0),
        MISSING_MARK,
      );
      expect(count).toBe(expected);
    });

    test('#problema y #por-que-ahora no llevan enlaces; #solucion tiene un solo CTA', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#problema a')).toHaveCount(0);
      await expect(page.locator('#por-que-ahora a')).toHaveCount(0);
      await expect(page.locator('#solucion a')).toHaveCount(1);
      const cta = page.locator('#solucion a[data-cta="solucion"]');
      await expect(cta).toHaveCount(1);
      await expect(cta).toHaveAttribute('href', '#agenda');
      expect(await cta.getAttribute('aria-label')).toBeNull();
      const heroName = norm((await page.locator('a[data-cta="hero"]').textContent()) ?? '');
      expect(norm((await cta.textContent()) ?? '')).toBe(heroName);
      const box = (await cta.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(48);
      const lead = (await page.locator('#solucion .section-lead').boundingBox())!;
      expect(box.y).toBeGreaterThanOrEqual(lead.y + lead.height);
    });

    test('un clic en el CTA de La solución deja el foco en #agenda-title', async ({ page }) => {
      await page.goto('/');
      await page.locator('a[data-cta="solucion"]').click();
      await expect(page).toHaveURL(/#agenda$/);
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('agenda-title');
    });
  });
}
