---
phase: 02-secciones-marca-y-copy
plan: 07
subsystem: ui
tags: [astro, css, motion, prefers-reduced-motion, playwright, collage, tracer]
status: partial
plan_head_before: 17a0005ef4608b05080cbe7403b5fe059188f83a
commits: 3
completed_tasks: [1, 2]
remaining_tasks: [3]
requirements-completed: []

provides:
  - "src/styles/motion.css: @keyframes hc-enter (solo transform) y la regla `#inicio :is([data-piece], [data-piece-of])`, todo dentro de un unico @media (prefers-reduced-motion: no-preference); propiedades --hc-dur, --hc-step y --hc-end (1000ms)"
  - "tests/e2e/lib/motion.ts: MOTION_ALLOWLIST (ya incluye hc-look, la transicion de .faq-icon-v, las transiciones de .cta y de .agenda-link), motionSnapshot, expectNoMotion y expectMotionWithinBudget"
  - "tests/e2e/motion.spec.ts: bloques 'entrada del collage del hero', 'pupilas del hero' e 'icono del FAQ' (reduce y no-preference, mas sin JavaScript)"
  - "src/styles/motion.css: @keyframes hc-look, --look (8px), --look-dx/--look-dy (0/-1 bajo 64em, -1/0 desde 64em) y .faq-icon-v con transicion de transform de --dur-1"
  - "tests/guards/motion-budget.test.mjs: scanCss(files), readSources(dir) y las cuatro reglas del presupuesto de movimiento, 14 pruebas (12 de mutacion o limpieza, 1 sobre el repositorio real)"
  - "Siete specs migrados de cero animaciones a expectNoMotion (reduce) y expectMotionWithinBudget (no-preference)"

key-files:
  created:
    - src/styles/motion.css
    - tests/e2e/lib/motion.ts
    - tests/e2e/motion.spec.ts
    - tests/guards/motion-budget.test.mjs
  modified:
    - src/components/sections/Faq.astro
    - tests/e2e/closing-sections.spec.ts
    - src/styles/global.css
    - tests/e2e/page-structure.spec.ts
    - tests/e2e/sections-problem-solution.spec.ts
    - tests/e2e/results-cases.spec.ts
    - tests/e2e/team-includes-how.spec.ts
    - tests/e2e/closing-sections.spec.ts
    - tests/e2e/collage-language.spec.ts
    - tests/e2e/collage-photos.spec.ts
---

# Phase 2 Plan 07: Motion Summary (PARCIAL: tareas 1 y 2 hechas, falta la tarea 3)

**Entrada del collage del hero con `hc-enter` (600 ms, retraso `--i` por 80 ms, fin a 1000 ms, solo `transform`, solo `no-preference`), medida de punta a punta con ambas preferencias, y una politica de movimiento unica para toda la suite.**

## Estado

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1 Tracer del movimiento (entrada del collage + politica compartida + siete specs) | hecha | 298fab5 |
| 2 Pupilas, giro del icono del FAQ y guarda `motion-budget` | hecha | 39530e8 |
| 3 Regla VERIFICAR (TDD), limpieza de `.wordmark`, estructura y conexiones, guarda `phase2-static` | pendiente | |

No se ejecutaron `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete`: se corren una sola vez cuando el plan este completo.

## Resultados de la tarea 1

- Ganchos confirmados en el archivo y en el HTML construido: seis `[data-piece]` (stage i0 rFrom -8, panel i1 r2 rFrom 8, loopy i2 rFrom -10, pills i3 r-2 rFrom 6, doodles i4 rFrom 12, dots i5 rFrom -6), marco `[data-photo-frame]` con `data-piece-of="panel"` y los mismos `--i`, `--r`, `--r-from`, y dos `path.hc-pupil[data-pupil]` dentro de `[data-piece="loopy"]`. Los valores `--r` y `--r-from` vienen SIN unidad, asi que el CSS usa `calc(var(--r-from, 0) * 1deg)`.
- Pruebas: `motion.spec.ts` 11 pasan (5 fallaron antes del CSS: retraso/duracion/relleno, keyframes, muestreo del reloj x2 reintentos, primer cuadro, 320 px). Los ocho specs de la tarea: 363 pasan, 55 skipped (los ya existentes de captura e informe, opt-in). Guardas `node --test tests/guards/*.test.mjs`: 176 pasan, 0 fallan. `check-contrast`: OK.
- Peso medido: `dist/index.html` 71790 bytes (sin cambio; tope 81920 crudo y 25600 gzip), `outerHTML` del `div[data-collage="hero"]` 5480 bytes (tope 8832), 0 archivos `.js` en `dist`. El CSS construido contiene `hc-enter`.
- `getAnimations()`: 0 con `reduce` en `/`, `/privacidad/` y `/marca/hoja/`; con `no-preference` solo `CSSAnimation` `hc-enter` sobre las siete piezas mientras corre y 0 a los 2,5 s. h1, subtitulo y CTA: `animation-name: none`, opacidad 1. Marco de foto igual a la ranura a 2,5 s (1 px). Sin scroll horizontal a 320 px en los cuadros 0, 200, 400 y 700 ms. Con JavaScript desactivado el hero se ve.
- Tracer gate (interactivo, `end-of-phase`, `<verify>` automatizado): se re-ejecuto de punta a punta, paso; se sigue.

## Resultados de la tarea 2

- Skills re-invocadas en este ejecutor: `impeccable` (animate) y `design-taste-frontend` (MOTION_INTENSITY 3). Lectura: landing de captacion, movimiento minimo y motivado (la mirada dirige al CTA; el giro confirma el estado del acordeon), todo bajo `no-preference`, solo `transform`, sin `opacity`.
- Rojo primero (salida anotada): con el CSS de la tarea 1, `motion.spec.ts -g "pupilas|icono del FAQ|sin JavaScript el clic"` dio 6 fallas y 5 pasaron: fallaron 'cada pupila: hc-look...' (animationName `none`), '@keyframes hc-look declara solo transform' (no existe), los dos productos punto (a 390 y 1280 px, `--look-dx` vacio, `Number('')` = 0 daba producto punto 0, no mayor que 0), 'cerrado alta / abierto ancha' (la barra `display:none` mide 0 de ancho) y 'CSSTransition de transform ... 150 ms' (0 transiciones). Pasaron por ser comportamiento nativo ya existente: pupilas con `reduce`, muestreo del reloj, Enter/Espacio, icono con `reduce` y sin JavaScript. La prueba 'icono con reduce' pasaba en vacio (0 >= 2*0), asi que se le agrego `expect(open.w).toBeGreaterThan(0)` antes de dar por bueno el rojo. `node --test tests/guards/motion-budget.test.mjs` en rojo: 13 pasan (las mutaciones muerden desde el primer dia) y 1 falla 'no se vio @keyframes hc-look' (la corrida real no es vacia).
- Pupilas medidas con el navegador (`getBoundingClientRect`): a 390 px el CTA queda arriba de las pupilas (vector aprox (+30, -526) y (-25, -526)) y a 1280 px a la izquierda (aprox (-608, +4) y (-702, +4)); por eso `--look-dx: 0; --look-dy: -1` como base y `-1 / 0` desde `min-width: 64em`. Comprobado tambien a 768, 1023 (arriba) y 1024 (izquierda): el cambio ocurre en 64 em. `--look` quedo en `8px` (no 4): con 4 unidades del arte el desplazamiento seria de 1 a 1,5 px, imperceptible; con 8 se miden 1,9 px a 390 px (pupila de 24 px) y 3,1 px a 1280 px (pupila de 40 px), y el primer cuadro sigue con holgura dentro del ojo (captura revisada). Es un solo valor en `motion.css`.
- Icono del FAQ: la barra vertical (`M12 7v10`) y la horizontal (`M7 12h10`) miden igual (10 de largo, mismo trazo), asi que la rotada cubre a la horizontal sin tocar el marcado. `Faq.astro` deja `transform-box: fill-box` y `transform-origin: center` en la regla base y `transform: rotate(90deg)` en `.faq-item[open]`; la transicion vive solo en `motion.css` (`transition: transform var(--dur-1) var(--ease-out)`, 150 ms). Con `reduce`, `--dur-1` y la transicion no existen: `transition-duration` computado `0s` y `getAnimations()` 0 tras el clic.
- Guarda `tests/guards/motion-budget.test.mjs`: lector de CSS con pila de preambulos (quita comentarios, extrae `<style>` de los `.astro`, ignora `;` dentro de parentesis como `url(data:...)`). Cuatro reglas; 14 pruebas: 1 hoja limpia sin falsos positivos, 4 de regla 1 (animation fuera, transition fuera, bajo `reduce`, `transition-duration` suelta en un `.astro`), 2 de regla 2 (opacity, mezcla con filter), 2 de regla 3 (infinite, `animation-timeline`), 4 de regla 4 (h1, selector sin `#inicio`, lista con el CTA, y la transicion del CTA no se bloquea), y la corrida real con cero violaciones que ademas exige ver `@keyframes hc-enter` y `hc-look` y al menos 4 declaraciones de movimiento. `animation: none` y `transition: none` (que solo apagan) no cuentan como violacion de la regla 1. Las transiciones de `CtaLink.astro` y `AgendaSection.astro` ya estaban bajo `no-preference` y pasan como transiciones permitidas.
- Verificacion final: `node --test tests/guards/*.test.mjs` 190 pasan, 0 fallan. Suite completa de Playwright `--project=chromium` con `E2E_BLOCK_CLICKUP=1`: 474 pasan, 0 fallan, 95 skipped (los specs opt-in de captura e informe, ya existentes; ninguno de `motion.spec.ts`). Los tres specs del `<verify>` (`motion`, `closing-sections`, `page-structure`): 135 pasan, 25 skipped opt-in. `dist/index.html` 71790 bytes (14328 gzip), 0 `.js` en `dist`. Servidor de preview detenido con `npx astro preview stop`.
- Sin cambio en el marcado de `<details>`, sin JavaScript, sin `opacity`.

## Decisiones y observaciones de la tarea 1 (utiles para la tarea 3 y el cierre)

1. **Lightning CSS reescribe el CSS al construir**: `from` sale como `0%`, `rotate(0deg)` como `rotate(0)` y `transform-origin: center` como `50%`. La prueba de keyframes acepta `/rotate\(0(deg)?\)/` y `['100%','to']` para el ultimo cuadro; conservarlo al agregar `hc-look`.
2. **Los helpers `open()` de `collage-language.spec.ts` y `collage-photos.spec.ts` esperan a que `getAnimations()` valga 0** tras `goto`: sus pruebas de geometria (cajas, ranuras, marco contra ranura) fallaban porque median las piezas durante la entrada de 1 s. No se toco ninguna otra asercion. `collage-language` ademas fija `reducedMotion: 'reduce'` en la prueba de ganchos con `transform: none` (la desviacion 7 del plan).
3. **Prueba fragil ajena**: `collage-photos.spec.ts` 'sin JavaScript la foto se pinta' agoto 30 s una vez bajo carga de la corrida completa y paso sola y en las dos corridas siguientes; no depende de esta tarea.
4. **`closing-sections.spec.ts`**: la prueba 'cero animaciones en Para quien es y FAQ' se paso a `expectNoMotion` con `reduce` y a `expectMotionWithinBudget` con `no-preference` antes y despues de abrir el resumen (con la tarea 2 aparecera la transicion de 150 ms del icono, ya en la lista blanca).
5. **Lista blanca ya completa para la tarea 2**: `hc-look` sobre `#inicio .hc-pupil, #inicio [data-pupil]` y `CSSTransition` de `transform` sobre `.faq-icon-v`; no hay que tocar `lib/motion.ts`.
6. El `motion.css` de la tarea 1 define `--hc-end` en `#inicio` (1000 ms) para el retraso de `hc-look`. Las transiciones existentes de `CtaLink.astro` y `AgendaSection.astro` ya estan dentro de `no-preference` (la guarda de la tarea 2 las tratara como transiciones permitidas, no como animaciones de cuadros clave).

## Lo que falta (continuacion desde un ejecutor nuevo)

- **Tarea 3** (`tdd`): pruebas 3b a 3e y fixture `tests/guards/fixtures/verificar-nota.yaml`, nueva `VERIFICAR_RE` en `scripts/lib/copy-rules.mjs`, `.wordmark` fuera de `a11y-base.spec.ts` y `SiteHeader.astro` (conservar la constante `tone`), enlaces de favicon en `BaseLayout.astro`, `tests/e2e/phase-closing.spec.ts`, `H2_SOURCE` en `page-structure.spec.ts`, `tests/guards/phase2-static.test.mjs`; `npm run pending` solo si convierte una marca. No requiere re-invocar skills salvo que retirar `.wordmark` altere el header.
- Cierre del plan: `SUMMARY` completo (`status: complete`, `commits` medido con `git rev-list --count 17a0005ef4608b05080cbe7403b5fe059188f83a..HEAD`, `actuals`), suite completa verde, luego `state.advance-plan`, `state.update-progress`, `state.record-session`, `roadmap.update-plan-progress 02` y `requirements.mark-complete DSGN-05 DSGN-03 COPY-01`, y revisar a mano `ROADMAP.md` (02-07 `[x]`, tabla 10/11) y `STATE.md` (`Plan:` apuntando a 02-08, `stopped_at` y `Resume file` en `02-08-PLAN.md`).

## Deviations from Plan

**Tarea 2, [Rule 1 - Bug de prueba heredada] `closing-sections.spec.ts`:** la prueba de 02-06 'icono de 24 px: la barra vertical se ve cerrado y se oculta abierto' afirmaba `display: none` al abrir, justo el comportamiento que esta tarea reemplaza por diseno (giro de 90 grados). Se reescribio para afirmar lo nuevo (cerrado: mas alta que ancha; abierto: la barra sigue en el DOM, con `display` distinto de `none` y ancho de 2 o mas veces el alto) conservando la comprobacion del icono de 24 x 24. Commit 39530e8. `--look` se subio de 4px a 8px (la propia tarea lo preve si resulta imperceptible).

Ninguna en la tarea 1 salvo la observacion 1 (`rotate(0)` minificado, equivalente a `rotate(0deg)`) y la 2 (el helper `open()` de dos specs espera el reposo; no es una asercion nueva ni cambia una existente).

## Known Stubs

Ninguno.

## Self-Check: PASSED (parcial, tareas 1 y 2)

- FOUND: src/styles/motion.css, tests/e2e/lib/motion.ts, tests/e2e/motion.spec.ts, tests/guards/motion-budget.test.mjs
- FOUND commits: 298fab5, 39530e8
