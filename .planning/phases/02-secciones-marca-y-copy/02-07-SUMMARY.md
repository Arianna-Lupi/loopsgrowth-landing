---
phase: 02-secciones-marca-y-copy
plan: 07
subsystem: ui
tags: [astro, css, motion, prefers-reduced-motion, playwright, collage, tracer]
status: partial
plan_head_before: 17a0005ef4608b05080cbe7403b5fe059188f83a
commits: 1
completed_tasks: [1]
remaining_tasks: [2, 3]
requirements-completed: []

provides:
  - "src/styles/motion.css: @keyframes hc-enter (solo transform) y la regla `#inicio :is([data-piece], [data-piece-of])`, todo dentro de un unico @media (prefers-reduced-motion: no-preference); propiedades --hc-dur, --hc-step y --hc-end (1000ms)"
  - "tests/e2e/lib/motion.ts: MOTION_ALLOWLIST (ya incluye hc-look, la transicion de .faq-icon-v, las transiciones de .cta y de .agenda-link), motionSnapshot, expectNoMotion y expectMotionWithinBudget"
  - "tests/e2e/motion.spec.ts: bloques 'entrada del collage del hero' (reduce y no-preference); faltan 'pupilas del hero' e 'icono del FAQ' (tarea 2)"
  - "Siete specs migrados de cero animaciones a expectNoMotion (reduce) y expectMotionWithinBudget (no-preference)"

key-files:
  created:
    - src/styles/motion.css
    - tests/e2e/lib/motion.ts
    - tests/e2e/motion.spec.ts
  modified:
    - src/styles/global.css
    - tests/e2e/page-structure.spec.ts
    - tests/e2e/sections-problem-solution.spec.ts
    - tests/e2e/results-cases.spec.ts
    - tests/e2e/team-includes-how.spec.ts
    - tests/e2e/closing-sections.spec.ts
    - tests/e2e/collage-language.spec.ts
    - tests/e2e/collage-photos.spec.ts
---

# Phase 2 Plan 07: Motion Summary (PARCIAL: tarea 1 hecha, faltan las tareas 2 y 3)

**Entrada del collage del hero con `hc-enter` (600 ms, retraso `--i` por 80 ms, fin a 1000 ms, solo `transform`, solo `no-preference`), medida de punta a punta con ambas preferencias, y una politica de movimiento unica para toda la suite.**

## Estado

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1 Tracer del movimiento (entrada del collage + politica compartida + siete specs) | hecha | 298fab5 |
| 2 Pupilas, giro del icono del FAQ y guarda `motion-budget` | pendiente | |
| 3 Regla VERIFICAR (TDD), limpieza de `.wordmark`, estructura y conexiones, guarda `phase2-static` | pendiente | |

No se ejecutaron `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete`: se corren una sola vez cuando el plan este completo.

## Resultados de la tarea 1

- Ganchos confirmados en el archivo y en el HTML construido: seis `[data-piece]` (stage i0 rFrom -8, panel i1 r2 rFrom 8, loopy i2 rFrom -10, pills i3 r-2 rFrom 6, doodles i4 rFrom 12, dots i5 rFrom -6), marco `[data-photo-frame]` con `data-piece-of="panel"` y los mismos `--i`, `--r`, `--r-from`, y dos `path.hc-pupil[data-pupil]` dentro de `[data-piece="loopy"]`. Los valores `--r` y `--r-from` vienen SIN unidad, asi que el CSS usa `calc(var(--r-from, 0) * 1deg)`.
- Pruebas: `motion.spec.ts` 11 pasan (5 fallaron antes del CSS: retraso/duracion/relleno, keyframes, muestreo del reloj x2 reintentos, primer cuadro, 320 px). Los ocho specs de la tarea: 363 pasan, 55 skipped (los ya existentes de captura e informe, opt-in). Guardas `node --test tests/guards/*.test.mjs`: 176 pasan, 0 fallan. `check-contrast`: OK.
- Peso medido: `dist/index.html` 71790 bytes (sin cambio; tope 81920 crudo y 25600 gzip), `outerHTML` del `div[data-collage="hero"]` 5480 bytes (tope 8832), 0 archivos `.js` en `dist`. El CSS construido contiene `hc-enter`.
- `getAnimations()`: 0 con `reduce` en `/`, `/privacidad/` y `/marca/hoja/`; con `no-preference` solo `CSSAnimation` `hc-enter` sobre las siete piezas mientras corre y 0 a los 2,5 s. h1, subtitulo y CTA: `animation-name: none`, opacidad 1. Marco de foto igual a la ranura a 2,5 s (1 px). Sin scroll horizontal a 320 px en los cuadros 0, 200, 400 y 700 ms. Con JavaScript desactivado el hero se ve.
- Tracer gate (interactivo, `end-of-phase`, `<verify>` automatizado): se re-ejecuto de punta a punta, paso; se sigue.

## Decisiones y observaciones que la tarea 2 necesita

1. **Lightning CSS reescribe el CSS al construir**: `from` sale como `0%`, `rotate(0deg)` como `rotate(0)` y `transform-origin: center` como `50%`. La prueba de keyframes acepta `/rotate\(0(deg)?\)/` y `['100%','to']` para el ultimo cuadro; conservarlo al agregar `hc-look`.
2. **Los helpers `open()` de `collage-language.spec.ts` y `collage-photos.spec.ts` esperan a que `getAnimations()` valga 0** tras `goto`: sus pruebas de geometria (cajas, ranuras, marco contra ranura) fallaban porque median las piezas durante la entrada de 1 s. No se toco ninguna otra asercion. `collage-language` ademas fija `reducedMotion: 'reduce'` en la prueba de ganchos con `transform: none` (la desviacion 7 del plan).
3. **Prueba fragil ajena**: `collage-photos.spec.ts` 'sin JavaScript la foto se pinta' agoto 30 s una vez bajo carga de la corrida completa y paso sola y en las dos corridas siguientes; no depende de esta tarea.
4. **`closing-sections.spec.ts`**: la prueba 'cero animaciones en Para quien es y FAQ' se paso a `expectNoMotion` con `reduce` y a `expectMotionWithinBudget` con `no-preference` antes y despues de abrir el resumen (con la tarea 2 aparecera la transicion de 150 ms del icono, ya en la lista blanca).
5. **Lista blanca ya completa para la tarea 2**: `hc-look` sobre `#inicio .hc-pupil, #inicio [data-pupil]` y `CSSTransition` de `transform` sobre `.faq-icon-v`; no hay que tocar `lib/motion.ts`.
6. El `motion.css` de la tarea 1 define `--hc-end` en `#inicio` (1000 ms) para el retraso de `hc-look`. Las transiciones existentes de `CtaLink.astro` y `AgendaSection.astro` ya estan dentro de `no-preference` (la guarda de la tarea 2 las tratara como transiciones permitidas, no como animaciones de cuadros clave).

## Lo que falta (continuacion desde un ejecutor nuevo)

- **Tarea 2** (`tdd`): invocar con la herramienta Skill `impeccable` (verbo `animate`) y `design-taste-frontend` (MOTION_INTENSITY 3) porque corre en otro ejecutor; bloques 'pupilas del hero' e 'icono del FAQ' en `motion.spec.ts` (rojo primero); `hc-look` y `--look-dx/--look-dy` (medir a 390 y 1280 px con el producto punto hacia `a[data-cta="hero"]`), transicion de `.faq-icon-v` en `motion.css`, en `Faq.astro` reemplazar la regla `.faq-item[open] .faq-icon-v { display: none }` por `transform: rotate(90deg)` con `transform-box: fill-box` y `transform-origin: center` en la regla base; `tests/guards/motion-budget.test.mjs` con `scanCss` y al menos 5 pruebas por mutacion. Si `--look` de 4px resulta imperceptible, subirlo (un solo valor en `motion.css`).
- **Tarea 3** (`tdd`): pruebas 3b a 3e y fixture `verificar-nota.yaml`, nueva `VERIFICAR_RE`, `.wordmark` fuera de `a11y-base.spec.ts`/`SiteHeader.astro`, enlaces de favicon en `BaseLayout.astro`, `phase-closing.spec.ts`, `H2_SOURCE` en `page-structure.spec.ts`, `phase2-static.test.mjs`; `npm run pending` solo si convierte una marca.
- Cierre del plan: `SUMMARY` completo (`status: complete`, `commits` medido con `git rev-list --count 17a0005ef4608b05080cbe7403b5fe059188f83a..HEAD`, `actuals`), suite completa verde, luego `state.advance-plan`, `state.update-progress`, `state.record-session`, `roadmap.update-plan-progress 02` y `requirements.mark-complete DSGN-05 DSGN-03 COPY-01`, y revisar a mano `ROADMAP.md` (02-07 `[x]`, tabla 10/11) y `STATE.md` (`Plan:` apuntando a 02-08, `stopped_at` y `Resume file` en `02-08-PLAN.md`).

## Deviations from Plan

Ninguna en la tarea 1 salvo la observacion 1 (`rotate(0)` minificado, equivalente a `rotate(0deg)`) y la 2 (el helper `open()` de dos specs espera el reposo; no es una asercion nueva ni cambia una existente).

## Known Stubs

Ninguno.

## Self-Check: PASSED (parcial, tarea 1)

- FOUND: src/styles/motion.css, tests/e2e/lib/motion.ts, tests/e2e/motion.spec.ts
- FOUND commit: 298fab5
