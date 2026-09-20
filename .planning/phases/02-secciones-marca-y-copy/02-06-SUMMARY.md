---
phase: 02-secciones-marca-y-copy
plan: 06
subsystem: ui
tags: [astro, privacidad, footer, noindex, yaml, playwright, tracer]
status: partial
plan_head_before: 44cf69fe091d5313d68c72288b6d64aedf4ce050
# commits es el conteo medido del libro (git rev-list --count plan_head_before..HEAD) al escribir este resumen parcial: un commit de tarea (Tarea 1). El ejecutor que cierre el plan lo recalcula.
commits: 1
completed: null
actuals:
  tokens: 3100
  tasks: 1
  commits: 1
requirements-completed: []

provides:
  - "Tarea 1 (tracer) completa: /privacidad/ de punta a punta (h1 del YAML, cuerpo FALTA CONFIRMAR pending, noindex en todo entorno, sin canonical, sin JavaScript, sin h2)"
  - "SiteFooter.astro primer corte (nav aria-label con el enlace de privacidad, aria-current en /privacidad), montado por BaseLayout tras main"
  - "BaseLayout con props noindex y path; SiteHeader con CTA a #agenda en / y a /#agenda en otras rutas; SkipLinks con el salto a #agenda solo en /"
  - "Claves footer (nav_label, privacy_link) y privacy (title, body) en el YAML y el esquema estricto; PENDING-COPY.md regenerado (37 pendientes)"
  - "closing-sections.spec.ts con el bloque de /privacidad (PRIVACY_PATH) y las pruebas de cinco anchos y cero animaciones"

key-files:
  created:
    - src/components/SiteFooter.astro
    - src/pages/privacidad.astro
    - tests/e2e/closing-sections.spec.ts
  modified:
    - src/content/landing.es.yaml
    - src/content.config.ts
    - src/layouts/BaseLayout.astro
    - src/components/SiteHeader.astro
    - src/components/SkipLinks.astro
    - PENDING-COPY.md

key-decisions:
  - "El título de /privacidad se compone como 'Política de privacidad: Loops Growth' (mismo criterio de dos puntos y espacio que meta.title_template)."
  - "SiteFooter pasa aria-current solo cuando la ruta empieza con /privacidad; en / el atributo no se emite."
  - "El sitemap de un build de producción incluye /privacidad/ (aun con noindex): la exclusión es nota de la fase 3, tal como fija el plan."

requirements: [CONT-10, CONT-11, CONT-12, CONT-13, COPY-01, DSGN-04]
---

# Phase 2 Plan 06: Para quién es, FAQ, CTA final, footer y privacidad (PARCIAL: tarea 1 de 3)

Estado: **PARCIAL**. La Tarea 1 (tracer) esta hecha y commiteada. Faltan las Tareas 2 y 3, que corren en un ejecutor nuevo. Este resumen lo reescribe el ejecutor que cierre el plan.

## Hecho

### Tarea 1: tracer de /privacidad y primer corte del footer (commit fbdb19d)

- YAML y esquema: `footer.nav_label` y `footer.privacy_link` (verified), `privacy.title` (verified) y `privacy.body` (una afirmación pending 'FALTA CONFIRMAR', `confirm_by: Ari`, `reason` que dice que Ari entrega el texto legal). Van antes de `config`. Los nombres de bloque `contact_label` y `social_label` y las ranuras `email` y `social` los suma la Tarea 3.
- `SiteFooter.astro`: `<footer class="site-footer" data-tone="light">` con borde superior 3 px y `--section-y`; `<nav class="footer-nav" aria-label>` con un `a.footer-link` a `/privacidad/`, 44 px de alto, subrayado permanente que engrosa a 3 px en hover. Sin encabezados ni JS.
- `BaseLayout.astro`: props `noindex?` y `path?`; robots `noindex` con `!isProduction || noindex`; canonical solo con `isProduction && !noindex`; `<SiteFooter />` tras `</main>`.
- `privacidad.astro`: `section#privacidad` con un h1 (`--text-heading`) y un `<p>` por elemento de `privacy.body`; nota de fase 3 sobre sitemap y `noindex` en el frontmatter.
- `SiteHeader.astro` (`ctaHref`) y `SkipLinks.astro` (`hasAgenda`) deciden por ruta.
- Skills invocadas con la herramienta Skill: `impeccable` (contexto y PRODUCT.md cargados) y `design-taste-frontend` (diales 7, 3 y 4, lectura declarada). El pie y la página son del lote E (verbos layout, colorize y harden) y esa iteracion visual se hace en la Tarea 3.

### Resultados (Tarea 1)

- RED confirmado antes de crear la página: 8 pruebas de `closing-sections.spec.ts` fallaban.
- `node --test tests/guards/*.test.mjs`: 168 pass, 0 fail. `npm run pending` y `--check`: OK (37 pendientes, `privacy.body[0]` presente una vez). `npm run build`: verde (14 avisos de contenido, ninguno estructural).
- Build de producción con `PUBLIC_SITE_URL`: `/privacidad` con `noindex` y sin canonical; `/` con canonical y sin `noindex`. Build final no productivo.
- Playwright con ClickUp bloqueado (`closing-sections`, `a11y-base`, `cta-focus`): 60 passed. `a11y-base` y `cta-focus` sin editar; JS propio 666 bytes.
- Compuerta de higiene: 0 coincidencias de `set:html`, `outline: none`, `.status` y hex en los 5 archivos. Ninguna eliminación en el commit.
- Servidores: preview de 4322 detenido; el `astro dev` del usuario no se toco.

## Pendiente exacto (para el ejecutor siguiente)

### Tarea 2: Para quién es, FAQ y guarda INVERSION (tdd, 42k estimados)

Leer solo su `read_first` del plan. Archivos: `landing.es.yaml` (`for_whom`, `faq` antes de `agenda`), `content.config.ts`, `scripts/lib/copy-rules.mjs` (INVERSION_MONTHLY_RE, INVERSION_CURRENCY_RE, INVERSION_PATH_PREFIXES, `findInversion`, regla en `checkCopy`), `tests/guards/copy.test.mjs` (solo agregar al final; 9b es de 02-03), `ForWhom.astro`, `Faq.astro`, `index.astro` (ForWhom y Faq antes de `AgendaSection`), `closing-sections.spec.ts` (bloques de Para quién es y FAQ y el bloque `recorte`), `a11y-base.spec.ts` (orden de tabulación con los resúmenes: casos (a) de 1280 y 390 px, tipo del YAML y mapeo de paradas; `tabUntilIframe` usa `max = 12` y con 6 resúmenes hay 14 paradas hasta el iframe: subir el máximo), `02-VISUAL-LOG.md` (lote D06). Invocar `impeccable` (lote D: shape, layout, clarify, adapt) y `design-taste-frontend` con la herramienta Skill.

### Tarea 3: `#agenda`, footer completo y `/privacidad` endurecida (28k estimados)

Titular `agenda.title` = '¿Listo para que te encuentren cuando te estan buscando?' (errata 'estan' tal cual), clase `.section-title`, `AgendaCollage` (raíz `div[data-collage="agenda"]`) en `.agenda-copy` tras `.agenda-fallback` con contenedor `aria-hidden` visible solo desde 64em, sin `CtaLink` en `#agenda`; footer con `<Logo name href tone="light" variant="horizontal">` (sin `href` en `/`), bloques de contacto y redes (`footer.contact_label`, `social_label`, `email`, `social`, pending), correo con `mailto:` solo si pasa una expresión estricta (prueba con valor inyectado en una copia temporal del YAML), rejilla de 1, 2 y 3 columnas; cierre del orden de tabulacion (enlace de privacidad tras el iframe), lote E06 en `02-VISUAL-LOG.md` (`impeccable` layout, colorize, harden) y nota manual del `<summary>` con VoiceOver pendiente para Juan. Después: estado final (advance-plan, update-progress, roadmap 02, requirements.mark-complete con CONT-10 a CONT-13, COPY-01, DSGN-04), verificacion manual de ROADMAP.md y STATE.md.

### Presupuesto de HTML (aviso para el ejecutor siguiente)

`dist/index.html` mide **58565 bytes** crudos tras la Tarea 1 (56810 antes: +1755 por el footer). Quedan 2875 bytes bajo el tope de 61440. Las Tareas 2 y 3 (Para quién es, FAQ de 6 details, collage y footer completo) lo superarán. Autorización del orquestador para este plan: no recortar contenido de Ari; si el crudo pasa de 61440, subir las guardas que lo afirman a 81920 bytes crudos y exigir además como máximo 25600 bytes con `gzip -9 -c dist/index.html | wc -c`; registrar en este SUMMARY como desviacion con las cifras medidas y la lista de guardas tocadas, y avisar a Juan. No tocar ningun otro tope.

## Deviations from Plan

None - la Tarea 1 se ejecuto como estaba escrita.

## Notas para Ari (acumuladas)

- Erratas del doc (se reportan, no se corrigen): 'estan' en el titular del CTA final (Tarea 3).
- Afirmaciones nuevas pending hasta ahora: `privacy.body[0]` (texto legal de la política de privacidad).

## Notas para la fase 3

- Excluir `/privacidad/` del sitemap mientras siga `noindex` (`sitemap({ filter })` en `astro.config.mjs`): el build de producción de la Tarea 1 lo incluye en `sitemap-0.xml`.
- Quitar `noindex` de `privacidad.astro` cuando exista el texto legal.
