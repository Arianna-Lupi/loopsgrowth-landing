---
phase: 02-secciones-marca-y-copy
plan: 01
subsystem: ui
tags: [astro, tailwind, hero, copy, playwright, design-tokens, contrast]
status: partial
plan_head_before: 5658481fb6f0e287d4e02cd5ea302bf520047e64

requires:
  - phase: 01-fundacion-y-formulario
    provides: tokens.css con tonos light y purple, CtaLink, #agenda, guardas de copy y de contraste, pruebas e2e de la fase 1
provides:
  - "Hero real (CONT-01) que reemplaza al esqueleto de la fase 1, con hero.description de Ari"
  - "hero.description en el YAML y el esquema, y PENDING-COPY.md con siete pendientes"
  - "Cuatro tonos (light, yellow, dark, purple) con --heading, --bar, --mark, --pop-shadow-color y --collage-stroke; escala Title, --card-pad, --card-gap, --radius-card, --space-4xl y --section-y responsivo"
  - "check-contrast con cuatro tonos obligatorios, 11 pares aprobados y pares por tono, probado por mutación"
  - "SectionShell.astro y CtaLink con cuatro ubicaciones, prop href y sombra por tono"
  - "page-structure.spec.ts con las pruebas del tracer (hero y ritmo de padding a 390 y 1280 px)"
  - "PRODUCT.md, DESIGN.md y 02-VISUAL-LOG.md (lote 0, rondas 0 y 1)"
affects: [02-02, 02-03, 02-04, 02-05, 02-06, 02-07, 02-08]

actuals:
  tokens: 21000
  tasks: 2
  commits: 3

tech-stack:
  added: []
  patterns:
    - "El hero imprime el texto de cada afirmación como nodo de texto y no lee su estado"
    - "Los componentes leen solo tokens semánticos del tono (--surface, --heading, --bar, --pop-shadow-color); nunca un primitivo"
    - "Un bloque plano por tono con selector exacto [data-tone=x]; la guarda de contraste rechaza selectores compuestos y CSS anidado"

key-files:
  created:
    - src/components/sections/Hero.astro
    - src/components/ui/SectionShell.astro
    - tests/e2e/page-structure.spec.ts
    - PRODUCT.md
    - DESIGN.md
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
  modified:
    - src/content/landing.es.yaml
    - src/content.config.ts
    - src/pages/index.astro
    - src/styles/tokens.css
    - src/styles/global.css
    - src/components/CtaLink.astro
    - scripts/lib/contrast.mjs
    - tests/guards/contrast.test.mjs
    - PENDING-COPY.md
  deleted:
    - src/components/HeroSkeleton.astro

key-decisions:
  - "Orden del hero h1, subtítulo, CTA, descripción, collage (desviación 1 del plan): el CTA sube sobre la descripción por presupuesto de altura."
  - "hero.description[0] y [2] nacen pending (afirmación de mercado sobre asistentes de IA y credencial de 8 años); la [1] verified."
  - "Sobre el tono dark la tarjeta blanca se distingue por relleno y no lleva borde; la sombra naranja del CTA es decorativa (contrato del UI-SPEC)."

requirements-completed: []

coverage:
  - id: D1
    description: "Tracer: hero con h1, subtítulo, CTA y los tres párrafos de hero.description del doc de Ari, con h1 morado y padding de 64 y 96 px"
    requirement: "CONT-01"
    verification:
      - kind: e2e
        ref: "tests/e2e/page-structure.spec.ts (npm run test:e2e:isolated)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Copy nuevo pasa por esquema, guarda de producción (siete pendientes, todos PENDING) y lista de pendientes determinista"
    requirement: "COPY-01"
    verification:
      - kind: unit
        ref: "node --test tests/guards/*.test.mjs; node scripts/list-pending.mjs --check; PUBLIC_ENV=production node scripts/check-copy.mjs --json"
        status: pass
    human_judgment: false
  - id: D3
    description: "Cuatro tonos con pares de contraste medidos; una mutación de yellow o dark (morado sobre oscuro, naranja o blanco como texto sobre amarillo) rompe la guarda"
    requirement: "DSGN-03"
    verification:
      - kind: unit
        ref: "node --test tests/guards/contrast.test.mjs (25 pruebas); node scripts/check-contrast.mjs (11/11 aprobados, 6 prohibidos)"
        status: pass
    human_judgment: false
  - id: D4
    description: "h2, barra 48x8 px y anillo de foco de 3 px con el color esperado en los cuatro tonos, medido en la página temporal tone-smoke (borrada)"
    requirement: "DSGN-04"
    verification:
      - kind: e2e
        ref: "Script ad hoc de Playwright fuera del repo; valores en 02-VISUAL-LOG.md (Lote 0, ronda 1)"
        status: pass
    human_judgment: false
---

# Phase 2 Plan 01: Cimientos visuales y Hero (PARCIAL: Tareas 1 y 2 de 3) Summary

**Tracer del hero con el texto de Ari, más los cuatro tonos de superficie con contraste medido y probado por mutación, `SectionShell` y `CtaLink` de cuatro ubicaciones listos para los planes 03 a 06.**

## Estado del plan

Este SUMMARY es `status: partial` a propósito. El plan fija un punto de corte tras la Tarea 2 cuando el contexto pasa de 50 %, y la Tarea 3 (collage e iteración visual del lote A) no se parte a mitad de un ciclo. Quedan hechas las Tareas 1 y 2; falta la Tarea 3. No se avanzó el contador de planes, ni el progreso de ROADMAP.md, ni se marcaron requisitos como completos.

## Hecho

### Tarea 1 (tracer): commit `eff9aee`

- `hero.description` con tres afirmaciones copiadas carácter por carácter de `02-ARI-COPY-V2.md`; la primera y la tercera `pending` con `reason`, la segunda `verified`. Esquema `z.array(claim).min(1)`; `PENDING-COPY.md` regenerado (siete pendientes).
- `--space-4xl`, `--section-y` responsivo (64 px, 96 px desde 1024 px) y `--heading` en `light` y `purple`; `h1` y `h2` con `var(--heading)`.
- `Hero.astro` real (h1, subtítulo, CTA, descripción) en lugar de `HeroSkeleton.astro`; `index.astro` con el orden canónico de las 12 secciones.
- `page-structure.spec.ts` (tracer), `PRODUCT.md` y `02-VISUAL-LOG.md` con el lote 0, ronda 0.

### Tarea 2 (TDD): commit `169d9df`

- **Rojo primero:** `tests/guards/contrast.test.mjs` pasó de 17 a 25 pruebas (contadores a 11 pares, cuatro tonos obligatorios, pares nuevos, tres mutaciones de `dark`, tres de `yellow` y una de `--color-brand-yellow`). Antes de implementar fallaban por aserciones, no por sintaxis.
- `scripts/lib/contrast.mjs`: `REQUIRED_TONES` de cuatro tonos; morado sobre blanco sube a umbral 4.5; se suman morado sobre amarillo (6.15) y blanco sobre oscuro (16.10); `TONE_PAIRS` mide `--heading`, `--bar` y `--collage-stroke` contra `--surface`. `check-contrast.mjs` no se tocó.
- `src/styles/tokens.css`: tonos `yellow` y `dark` en bloques planos, tokens nuevos por tono, `--text-title` (Title, quinto y último tamaño), `--card-pad`, `--card-gap` y `--radius-card` (con salto a 40em).
- `src/styles/global.css`: `h3` en Title, `.section-title::before` (barra de 48x8 px, `aspect-ratio` 6 a 1) y `section[id]` con `scroll-margin-top`.
- `CtaLink.astro`: `location` de cuatro valores, prop `href` (`'#agenda' | '/#agenda'`) y sombra dura con `--pop-shadow-color` (4, 6 y 2 px).
- `SectionShell.astro`: `<section id aria-labelledby data-tone>` con h2 y barra, lead de 60ch, slot por defecto y slot `cta` a 48 px.
- `DESIGN.md` (con `impeccable document`, sin entrevista) y entrada "Lote 0, ronda 1" en `02-VISUAL-LOG.md` con las mediciones.
- Página temporal `tone-smoke.astro` creada, medida y **borrada** antes del commit; `dist/tone-smoke/index.html` ya no existe.

### Verificación (todo verde)

- `node --test tests/guards/*.test.mjs`: 74 pruebas, 0 fallos. `node scripts/check-contrast.mjs`: 11/11 aprobados, 6 prohibidos verificados.
- `npm run build` sale 0 (con `prebuild` y `postbuild`); `npm run pending` es idempotente y `--check` sale 0.
- `test:e2e:isolated` con `page-structure.spec.ts`, `a11y-base.spec.ts` y `cta-focus.spec.ts`: 54 pruebas pasan, sin editar las de la fase 1.
- Medición de tonos (1280 px, ClickUp bloqueado): h2 morado en `light` y `yellow`, blanco en `dark` y `purple`; barra 48x8 px con `rgb(115, 24, 127)`, `rgb(33, 33, 33)`, `rgb(253, 105, 56)` y `rgb(255, 198, 2)` respectivamente; anillo de foco de 3 px morado, oscuro, amarillo y amarillo. Padding vertical 96 px; alto del CTA 50.7 px.
- Sin `set:html`, sin hex en `src/components` y `src/pages`, sin `outline: none`; `grep -c "aria-label" CtaLink.astro` da 0; ningún archivo protegido (`AgendaSection`, `SiteHeader`, `BaseLayout`, `SkipLinks`, `src/scripts`, `public`) cambió. Preview detenido.

## Pendiente (para el ejecutor nuevo)

**Tarea 3**: `HeroCollage.astro` (SVG en línea, seis piezas nombradas `loops|lupa|ojos|clic-a|clic-b|destellos`, 8 KB máximo, sin hex, con `--collage-stroke`), `Hero.astro` en rejilla `minmax(0, 7fr) minmax(0, 5fr)` con collage a la derecha desde 64em, extender `page-structure.spec.ts` con los incisos (a) a (j) (orden y tono de las 12 secciones, jerarquía de encabezados, sin desborde a cinco anchos, primer pantallazo, `.hero-art` sin cruce con `.hero-copy`, SVG accesible y liviano, HTML menor a 60 KB, cero animaciones, sin JavaScript, herramienta de capturas `PHASE2_BATCH`), ciclo del lote A (`PHASE2_BATCH=A`, 15 capturas, `impeccable critique`, una ronda de confirmación como máximo) y entrada "Lote A" en `02-VISUAL-LOG.md`. Skills con la herramienta Skill (`impeccable` con `shape`, `layout`, `typeset`, `colorize` y `adapt`; `design-taste-frontend` con diales 7, 3 y 4).

Al cerrar: reescribir este SUMMARY como `status: complete` con requisitos `CONT-01, COPY-01, DSGN-03, DSGN-04`, y correr `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02` y `requirements.mark-complete`, que aquí no se ejecutaron por ser parcial.

## Erratas del doc de Ari detectadas (no se corrigieron)

- `hero.description[1]`: "en el momento que te **estan** buscando" (falta la tilde: "están"). Se muestra tal cual y se reporta a Ari. El texto además encadena "con contenido y optimizaciones y estrategias", que Ari puede querer pulir.

## Afirmaciones nuevas en PENDING-COPY.md

- `hero.description[0]`: "Tu cliente te busca en Google y, cada vez más, le pregunta a un asistente de IA." (afirmación de mercado; misma familia que COPY-VERIFICATION 3b, datos de EE.UU.).
- `hero.description[2]`: "Contrata un equipo de especialistas con 8 años de experiencia..." (credencial del equipo; Ari la confirma).

## Deviations from Plan

Ninguna en el código: se aplicaron las desviaciones 1 (CTA sobre la descripción) y 2 (estados `pending` de las líneas 1 y 3) del propio plan.

Observaciones de proceso, no de alcance:

- `impeccable init` y `impeccable document` piden una entrevista con una persona y este ejecutor corre sin nadie que responda. `PRODUCT.md` y `DESIGN.md` se generaron solo con hechos ya aprobados y lo declaran en su cabecera. Si Juan quiere afinar el lenguaje cualitativo, se corre `/impeccable init` o `/impeccable document` de nuevo.
- Conflicto de skills resuelto a favor del contrato: `design-taste-frontend` pide un tema único de página y `impeccable` desaconseja la sombra dura fuera de un mundo neobrutalista; el brandbook y el UI-SPEC (aprobados por Juan) fijan cuatro tonos alternados y la sombra dura de 4 px. Quedó anotado en el registro visual.

**Total deviations:** 0 auto-fixed. **Impact:** ninguno sobre el resultado.

## Known Stubs

Ninguno. El hero no tiene datos vacíos ni marcadores; todo texto sale del YAML.

## Threat Flags

Ninguno: no hay superficie nueva de red, autenticación ni archivos. Aplicadas T-02-01-01 (texto como nodo, sin `set:html`), T-02-01-02 (`href` de `CtaLink` es una unión literal), T-02-01-04 (`tone-smoke.astro` borrada y `dist` sin su salida), T-02-01-07 (guarda de contraste con cuatro tonos y mutaciones) y T-02-01-08 (`PENDING-COPY.md` regenerado y verificado con `--check`).

## Self-Check: PASSED

- FOUND: src/components/sections/Hero.astro, src/components/ui/SectionShell.astro, tests/e2e/page-structure.spec.ts, PRODUCT.md, DESIGN.md, 02-VISUAL-LOG.md; HeroSkeleton.astro y tone-smoke.astro no existen.
- FOUND: commits eff9aee y 169d9df; `git rev-list --count 5658481..HEAD` = 3 (incluye el commit de documentación 3388bfe) antes de este commit del SUMMARY.
