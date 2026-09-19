---
phase: 02-secciones-marca-y-copy
plan: 01
subsystem: ui
tags: [astro, tailwind, hero, copy, playwright, design-tokens]
status: partial
plan_head_before: 5658481fb6f0e287d4e02cd5ea302bf520047e64

requires:
  - phase: 01-fundacion-y-formulario
    provides: tokens.css con tonos light y purple, CtaLink, #agenda, guardas de copy y de contraste, pruebas e2e de la fase 1
provides:
  - "Hero real (CONT-01) que reemplaza al esqueleto de la fase 1, con hero.description de Ari"
  - "hero.description en el YAML y el esquema, y PENDING-COPY.md con siete pendientes"
  - "--space-4xl, --section-y responsivo (64 px y 96 px desde 1024 px) y --heading por tono (light y purple)"
  - "page-structure.spec.ts con las pruebas del tracer (hero y ritmo de padding a 390 y 1280 px)"
  - "PRODUCT.md y 02-VISUAL-LOG.md (lote 0, ronda 0)"
affects: [02-02, 02-03, 02-04, 02-05, 02-06, 02-07, 02-08]

actuals:
  tokens: 5260
  tasks: 1
  commits: 1

tech-stack:
  added: []
  patterns:
    - "El hero imprime el texto de cada afirmación como nodo de texto y no lee su estado"
    - "--heading por tono: h1 y h2 leen var(--heading) desde global.css"

key-files:
  created:
    - src/components/sections/Hero.astro
    - tests/e2e/page-structure.spec.ts
    - PRODUCT.md
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
  modified:
    - src/content/landing.es.yaml
    - src/content.config.ts
    - src/pages/index.astro
    - src/styles/tokens.css
    - src/styles/global.css
    - PENDING-COPY.md
  deleted:
    - src/components/HeroSkeleton.astro

key-decisions:
  - "Orden del hero h1, subtítulo, CTA, descripción, collage (desviación 1 del plan): el CTA sube sobre la descripción por presupuesto de altura."
  - "hero.description[0] y [2] nacen pending (afirmación de mercado sobre asistentes de IA y credencial de 8 años); la [1] verified."

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
---

# Phase 2 Plan 01: Cimientos visuales y Hero (PARCIAL: solo Tarea 1 de 3) Summary

**Tracer del hero de punta a punta: hero.description del doc de Ari en YAML, esquema y PENDING-COPY.md, Hero.astro real en lugar del esqueleto, ritmo de padding responsivo (64 px y 96 px) y las pruebas de estructura que lo fijan.**

## Estado del plan

Este SUMMARY es `status: partial` a propósito. El plan fija un punto de corte tras la Tarea 1: si el contexto pasa de 50 %, se hace commit, se escribe este SUMMARY parcial y las tareas siguientes corren en un ejecutor nuevo. La Tarea 3 (iteración visual) no se parte a mitad de un ciclo, así que se cortó aquí. No es un plan terminado: no se avanzó el contador de planes, ni el progreso de ROADMAP.md, ni se marcaron requisitos como completos.

Duración de esta parte: unos 12 min (17:24 a 17:36 UTC del 2026-09-19).

## Hecho

### Tarea 1 (tracer): commit `eff9aee`

- `src/content/landing.es.yaml`: `hero.description` con tres afirmaciones copiadas carácter por carácter de `02-ARI-COPY-V2.md` (Hero, Description). La primera y la tercera `pending` con `reason`; la segunda `verified`.
- `src/content.config.ts`: `hero.description` como `z.array(claim).min(1)`.
- `PENDING-COPY.md` regenerado con `npm run pending` (siete pendientes; `--check` sale 0).
- `src/styles/tokens.css`: `--space-4xl` (6rem), `--section-y` que pasa a `var(--space-4xl)` desde 64em, y `--heading` en los tonos `light` (morado) y `purple` (blanco).
- `src/styles/global.css`: `h1` y `h2` con `color: var(--heading)`.
- `src/components/sections/Hero.astro`: `<section id="inicio" data-tone="light">` con el único h1, `.hero-sub`, el CTA `location="hero"` y `.hero-desc` (un `<p>` por afirmación, sin leer el estado). Padding arriba 48 y 64 px, abajo `--section-y`. `HeroSkeleton.astro` se eliminó con `git rm`.
- `src/pages/index.astro`: usa `Hero` y documenta el orden canónico de las 12 secciones con sus tonos.
- `tests/e2e/page-structure.spec.ts`: h1 morado y único, textos derivados del YAML, CTA completo en el primer pantallazo (390x844 y 1280x800), orden h1, subtítulo, CTA, descripción, padding de `#inicio` y `#agenda` (48/64 y 64/96 px) y h2 de `#agenda` en blanco.
- `PRODUCT.md` (raíz) y `02-VISUAL-LOG.md` con la entrada "Lote 0, ronda 0".

### Verificación de la Tarea 1 (todo verde)

- `npm run build` sale 0 (con `prebuild` y `postbuild`); `node --test tests/guards/*.test.mjs`: 66 pruebas, 0 fallos.
- `PUBLIC_ENV=production node scripts/check-copy.mjs --json`: cero violaciones estructurales, solo reglas PENDING, siete en total, con `hero.description[0]` y `hero.description[2]`.
- `grep -c "hero.description\[" PENDING-COPY.md` = 2; `grep -c "te estan buscando" dist/index.html` = 1; un solo `<h1` en `dist/index.html`.
- `test:e2e:isolated` con `page-structure.spec.ts`, `a11y-base.spec.ts` y `cta-focus.spec.ts`: 54 pruebas pasan, sin editar las de la fase 1.
- Sin `set:html`, sin hex en `src/components` y `src/pages`, sin `outline: none`; ningún archivo protegido (`AgendaSection`, `SiteHeader`, `BaseLayout`, `SkipLinks`, `src/scripts`, `public`) cambió. Preview detenido al terminar.
- Puerta del tracer: la verificación automática completa pasó, así que la expansión era legítima ("Tracer verified end-to-end").

## Pendiente (para el ejecutor nuevo)

**Tarea 2** (TDD): tonos `yellow` y `dark`, `--text-title`, `--card-pad`, `--card-gap`, `--radius-card`, `--bar`, `--mark`, `--pop-shadow-color`, `--collage-stroke`; `contrast.mjs` con cuatro tonos, 11 pares aprobados y pares por tono; mutaciones en `contrast.test.mjs`; `h3`, `.section-title` y `section[id]` en `global.css`; `CtaLink` con cuatro ubicaciones, prop `href` y `--pop-shadow-color`; `SectionShell.astro`; medición de los cuatro tonos con la página temporal `tone-smoke.astro` (no se versiona); `DESIGN.md` con `impeccable document`; entrada "Lote 0, ronda 1" en el log.

**Tarea 3**: `HeroCollage.astro` (SVG en línea, seis piezas nombradas, 8 KB máximo), `Hero.astro` en rejilla 7fr/5fr con collage a la derecha, extender `page-structure.spec.ts` con los incisos (a) a (j), ciclo del lote A con capturas (`PHASE2_BATCH=A`, 15 imágenes) y `impeccable critique`, entrada "Lote A" en el log, y este SUMMARY reescrito como completo (`status: complete`) con los requisitos `CONT-01, COPY-01, DSGN-03, DSGN-04`.

Tras cerrar el plan: `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02` y `requirements.mark-complete`, que aquí no se ejecutaron por ser parcial.

## Erratas del doc de Ari detectadas (no se corrigieron)

- `hero.description[1]`: "en el momento que te **estan** buscando" (falta la tilde: "están"). Se muestra tal cual en la página y se reporta a Ari. Además el texto encadena "con contenido y optimizaciones y estrategias", que Ari puede querer pulir.

## Afirmaciones nuevas en PENDING-COPY.md

- `hero.description[0]`: "Tu cliente te busca en Google y, cada vez más, le pregunta a un asistente de IA." (afirmación de mercado; misma familia que COPY-VERIFICATION 3b, datos de EE.UU.).
- `hero.description[2]`: "Contrata un equipo de especialistas con 8 años de experiencia..." (credencial del equipo; Ari la confirma).

## Deviations from Plan

Ninguna en el código: se aplicó la desviación 1 del propio plan (CTA sobre la descripción) y la 2 (estados `pending` de las líneas 1 y 3), ambas ya documentadas allí.

Una observación de proceso, no de alcance: `impeccable init` pide una entrevista con una persona (AskUserQuestion) y este ejecutor corre sin nadie que responda. Se generó `PRODUCT.md` solo con hechos ya aprobados por Juan y el archivo lo declara en su cabecera; quedó anotado en `02-VISUAL-LOG.md`. Si Juan quiere revisar el producto en vivo, se corre `/impeccable init` de nuevo.

**Total deviations:** 0 auto-fixed. **Impact:** ninguno sobre el resultado.

## Known Stubs

Ninguno. El hero no tiene datos vacíos ni marcadores; todo texto sale del YAML.

## Threat Flags

Ninguno: no hay superficie nueva de red, autenticación ni archivos. Las mitigaciones T-02-01-01 (texto como nodo, sin `set:html`) y T-02-01-08 (`PENDING-COPY.md` regenerado y verificado con `--check`) quedaron aplicadas en esta parte.

## Self-Check: PASSED

- FOUND: src/components/sections/Hero.astro, tests/e2e/page-structure.spec.ts, PRODUCT.md, 02-VISUAL-LOG.md; HeroSkeleton.astro eliminado.
- FOUND: commit eff9aee (`feat(02-01)`), `git rev-list --count 5658481..HEAD` = 1 antes de este commit de documentación.
