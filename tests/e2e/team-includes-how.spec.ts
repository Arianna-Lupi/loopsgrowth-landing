import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Quiénes somos, Qué incluye y Cómo funciona (plan 02-05). Los textos esperados salen del YAML y no
// se copian a mano (COPY-01): si Ari cambia una cadena, la prueba sigue midiendo lo que la página debe
// mostrar. Los espacios se normalizan porque el HTML colapsa los repetidos.
type Claim = { text: string; status: string };
const es = (parse(readFileSync('src/content/landing.es.yaml', 'utf8')) as {
  es: {
    team: { title: Claim; members: { name: Claim; role: Claim }[] };
  };
}).es;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

// Variantes de avatar que fija 02-10 (la asignación por posición vive en `AVATARS` de Team.astro).
const AVATAR_VARIANTS = ['ojo-morado', 'ojo-amarillo', 'ojos-morado', 'ojos-amarillo'];

type Box = { x: number; y: number; width: number; height: number };
const boxes = async (page: Page, sel: string): Promise<Box[]> =>
  page.locator(sel).evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
    }),
  );

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
]) {
  test.describe(`Quiénes somos a ${viewport.width} px`, () => {
    test.use({ viewport });

    test('la sección tiene su tono, su h2 del YAML y cuatro tarjetas en lista', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('main > section#nosotros');
      await expect(section).toHaveCount(1);
      await expect(section).toHaveAttribute('data-tone', 'yellow');
      const labelledby = await section.getAttribute('aria-labelledby');
      const h2 = section.locator('h2');
      await expect(h2).toHaveCount(1);
      await expect(h2).toHaveAttribute('id', labelledby ?? '');
      expect(norm((await h2.textContent()) ?? '')).toBe(norm(es.team.title.text));
      const list = section.locator('ul');
      await expect(list).toHaveCount(1);
      await expect(list).toHaveAttribute('role', 'list');
      await expect(list.locator('> li')).toHaveCount(4);
    });

    test('cuatro h3 con los nombres y cuatro cargos del YAML, en orden', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#nosotros');
      const names = (await section.locator('h3').allTextContents()).map(norm);
      expect(names).toEqual(es.team.members.map((m) => norm(m.name.text)));
      const roles = (await section.locator('p.team-role').allTextContents()).map(norm);
      expect(roles).toEqual(es.team.members.map((m) => norm(m.role.text)));
      // Sin biografía ni ningún otro párrafo (CONT-07).
      await expect(section.locator('p')).toHaveCount(4);
    });

    test('ningún enlace, botón ni tabindex dentro de la sección', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#nosotros a, #nosotros button, #nosotros [tabindex]')).toHaveCount(0);
    });

    test('cuatro avatares Loopy decorativos, distintos y del mismo tamaño', async ({ page }) => {
      await page.goto('/');
      const cards = page.locator('#nosotros li.team-card');
      await expect(cards).toHaveCount(4);
      const avatars = page.locator('#nosotros svg[data-collage="avatar"]');
      await expect(avatars).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        const svg = cards.nth(i).locator('svg[data-collage="avatar"]');
        await expect(svg).toHaveCount(1);
        await expect(svg).toHaveAttribute('aria-hidden', 'true');
        await expect(svg).toHaveAttribute('focusable', 'false');
        await expect(svg.locator('title')).toHaveCount(0);
        await expect(svg.locator('text')).toHaveCount(0);
        await expect(svg.locator('[data-pill]')).toHaveCount(0);
      }
      const variants = await avatars.evaluateAll((els) => els.map((el) => el.getAttribute('data-variant')));
      expect([...variants].sort()).toEqual([...AVATAR_VARIANTS].sort());
      expect(new Set(variants).size).toBe(4);
      const bytes = await avatars.evaluateAll((els) =>
        els.map((el) => new TextEncoder().encode(el.outerHTML).length),
      );
      for (const n of bytes) expect(n).toBeLessThanOrEqual(2560);
      const widths = (await boxes(page, '#nosotros svg[data-collage="avatar"]')).map((b) => Math.round(b.width));
      expect(new Set(widths).size).toBe(1);
      expect(widths[0]).toBe(viewport.width >= 640 ? 120 : 96);
    });

    test('jerarquía de encabezados y sin scroll horizontal', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toHaveCount(1);
      const order = await page.locator('main h1, main h2, main h3').evaluateAll((els) =>
        els.map((el) => ({ tag: el.tagName, section: el.closest('section')?.id ?? '' })),
      );
      let seenH2 = false;
      let seenSection = '';
      for (const h of order) {
        if (h.tag === 'H2') {
          seenH2 = true;
          seenSection = h.section;
        }
        if (h.tag === 'H3') {
          expect(seenH2, 'h3 sin h2 antes').toBe(true);
          expect(h.section, 'h3 dentro de la sección de su h2').toBe(seenSection);
        }
      }
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  });
}
