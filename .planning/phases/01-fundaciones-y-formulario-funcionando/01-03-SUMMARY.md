---
phase: 01-fundaciones-y-formulario-funcionando
plan: 03
subsystem: ui
tags: [astro, playwright, a11y, focus, skip-links, cta, tokens, partial]

requires:
  - phase: 01-fundaciones-y-formulario-funcionando
    provides: "Plan 01: proyecto Astro 7, landing.es.yaml, AgendaSection con el iframe. Plan 02: tokens.css, guardas de contraste y copy"
provides:
  - "CtaLink (ancla a #agenda) y HeroSkeleton con el h1, el subtitulo y el CTA, con el texto de Ari del YAML"
  - "src/scripts/cta-focus.ts: mueve el foco al h2 de #agenda tras clic, hashchange y carga con hash (524 bytes, inlinado en dist/index.html)"
  - "SkipLinks, SiteHeader, BaseLayout con <main id=main tabindex=-1> y global.css con foco de 3 px, pesos 400/600/700 y scroll suave solo con no-preference"
  - "playwright.config.ts (Chromium contra astro preview, puerto 4322), tests/e2e/cta-focus.spec.ts y tests/e2e/a11y-base.spec.ts (Tasks 1 y 2)"
affects: [01-03-task-3, 01-04, phase-02, phase-03]

status: partial
plan_head_before: b30f16c686ee38eeeb8e85217bcbde32c52930d4

actuals:
  tokens: 0
  tasks: 2
  commits: 2

requirements-completed: []

duration: 18min
completed: 2026-09-19
---

# Phase 1 Plan 03: Superficie del formulario Summary (PARCIAL: Tasks 1 y 2 hechos, falta el Task 3)

**CTA ancla a #agenda con foco programatico al h2, skip links, header estatico y base global de foco y tipografia, verificados en Chromium con 17 pruebas Playwright en verde; queda la seccion #agenda completa (Task 3).**

Este SUMMARY es parcial a proposito. El plan pide cortar entre tareas si el contexto pasa del 50 % (seccion "Presupuesto de contexto"): el Task 3 (AgendaSection completa, 11 casos nuevos de prueba, prueba de mutacion de glifos, build con guardas) corre en un ejecutor nuevo. El frontmatter lleva `status: partial` a proposito: no ejecutar `roadmap update-plan-progress` ni marcar requisitos hasta que el Task 3 cierre y este archivo se reescriba como completo.

## Estado por tarea

| Task | Estado | Commit |
|------|--------|--------|
| 1 Tracer del foco (CtaLink, HeroSkeleton, cta-focus.ts, Playwright) | Hecho, verificado (9 de 9) | `ace95d4` |
| 2 Skip links, header, global.css, BaseLayout, a11y-base.spec.ts | Hecho, verificado (17 de 17 con el Task 1) | `ed2dd00` |
| 3 AgendaSection completa y pruebas de desbordes, sin JS, movimiento, glifos y textos de Ari | PENDIENTE | n/a |

Tracer verificado de punta a punta antes de expandir: los 4 casos de foco (clic, segundo clic con hash igual, Enter, carga directa) a 1280 y 390 px mas el caso del JS propio. Expansion autorizada.

## Resultados de las pruebas

- `npx playwright test tests/e2e/a11y-base.spec.ts tests/e2e/cta-focus.spec.ts`: 17 passed.
- Como emitio Astro el script de foco: **inlinado en `dist/index.html`**, 524 bytes (sin archivo `.js` bajo `dist`). Una sola etiqueta `<script` propia, su codigo contiene `agenda-title`; la suma de JS propio es 524 bytes, menor a 3072.
- Criterios de aceptacion de los Tasks 1 y 2 verificados con grep: sin `set:html`, sin `outline: none`/`outline-none`/`line-height !important`, sin hex en `src/components`, `src/layouts`, `src/pages`, `src/scripts` ni `global.css`, sin `sticky`/`position: fixed` en `SiteHeader.astro` ni `global.css`, `scroll-behavior: smooth` solo dentro del bloque `no-preference`, un solo `<h1`, CTA del hero sin `aria-label`, `<main id="main" tabindex="-1">` y los dos skip links como primeros enfocables de `dist/index.html`, `package.json` con `test:e2e`.
- Captura del backstop: `test-results/skip-link-focused.png` (anillo purpura de 3 px y fondo oscuro con texto amarillo visibles contra el header blanco; `elementFromPoint` sobre su centro devuelve el propio enlace). `test-results/` esta en `.gitignore` y Playwright lo vacia en cada corrida.
- Red (ClickUp): `curl` del formulario y de `forms-embed/v1.js` devolvieron 200 el 2026-09-19 a las 02:3x UTC. Ningun caso fallo por red. Una corrida se fue a 7.7 min con timeouts de 30 s en `keyboard.press`/`click` por carga alta de la maquina (load average 9, sin relacion con el codigo); repetida en calma paso completa en 36 s.

## Ajustes de las skills `impeccable` y `design-taste-frontend` dentro del contrato

Ninguno rompe UI-SPEC (manda el contrato aprobado y A11Y.md cuando chocan con las skills). Cosas que las skills sugirieron y no se aplicaron por el contrato: sombra de bloque duro (UI-SPEC la manda: mundo pop), blanco y `#212121` puros (son los tokens de marca), sin modo oscuro (el brandbook define una sola paleta) y CTA que se parte en dos lineas a 320 px (UI-SPEC lo exige). Se aplico: seleccion de texto con la paleta (`::selection` amarillo y tinta oscura, 10.22:1), foco de 3 px consistente, formas con una sola escala (pill para CTA, 8 px skip link, 16 px tarjeta) y ninguna decoracion extra.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Carga directa con `/#agenda` no dejaba el foco en el h2**
- **Found during:** Task 1 (caso d)
- **Issue:** enfocar con `setTimeout(0)` desde el script diferido ocurre antes de que Chromium termine el salto de ancla, que luego vacia el foco.
- **Fix:** en carga directa se enfoca ya y se reintenta en `load` solo si el foco quedo vacio (`document.activeElement` es `body`). Sigue sin leer nada de la URL salvo la comparacion con `#agenda`.
- **Files modified:** `src/scripts/cta-focus.ts`
- **Commit:** `ace95d4`

**2. [Rule 3 - Blocking] `astro preview` en segundo plano rompe el `webServer` de Playwright dentro de un agente**
- **Found during:** Task 1
- **Issue:** Astro 7 detecta que lo ejecuta un agente de IA y deja `astro preview` en segundo plano; Playwright ve el proceso terminar ("Process from config.webServer exited early"). `ASTRO_PREVIEW_BACKGROUND` no sirve para desactivarlo (cualquier valor no vacio lo activa).
- **Fix:** el config queda como pide el plan (funciona en una terminal normal) con un comentario. En un agente: `npx astro build && npx astro preview --port 4322` antes de las pruebas (`reuseExistingServer` lo reutiliza) y `npx astro preview stop` al terminar. Ojo: con el servidor reutilizado Playwright no reconstruye; hay que correr `npx astro build` a mano tras cada cambio.
- **Files modified:** `playwright.config.ts` (comentario)
- **Commit:** `ace95d4`

**3. [Rule 1 - Bug en el plan] Caso (c) de a11y-base no puede medir el contorno del IFRAME**
- **Found during:** Task 2
- **Issue:** al entrar al iframe con Tab, Chromium deja `document.activeElement` en el IFRAME pero el elemento no coincide con `:focus`, `:focus-visible` ni `:focus-within` del padre (el foco vive en el documento de ClickUp). Su `outline-style` calculado es `none` y no hay regla propia que lo cambie.
- **Fix:** el caso (c) mide el contorno en todas las paradas propias y excluye el IFRAME, con comentario. El foco interior es de ClickUp (se registra en `EXCEPTIONS.md` de la Fase 3, ya previsto). Anotado en `.planning/WINDOWS.md`.
- **Files modified:** `tests/e2e/a11y-base.spec.ts`
- **Commit:** `ed2dd00`

**4. [Rule 3 - Secuencia] El orden de tabulacion del Task 2 aun no incluye el enlace de respaldo**
- **Found during:** Task 2
- **Issue:** el caso (a) del plan lista el enlace de respaldo, pero ese enlace lo crea el Task 3 (`AgendaSection`).
- **Fix:** en el commit del Task 2 el caso (a) espera `skip 1, skip 2, CTA header, CTA hero, iframe` (a 390 px: `skip 1, skip 2, CTA hero, iframe`). **El Task 3 debe agregar `a:https://forms.clickup.com/...` (el enlace de respaldo) entre el CTA del hero y el iframe en ambos casos (a) y sumar el respaldo a los casos de 44 px.** Hay un comentario en el spec que lo recuerda.

**Total deviations:** 4 (2 Rule 1, 2 Rule 3). Sin cambio de alcance.

## Instrucciones para el ejecutor del Task 3

1. Leer los `read_first` del Task 3 del plan y este archivo. Invocar `impeccable` y `design-taste-frontend` con Skill antes de tocar la UI (la regla del proyecto), dentro de UI-SPEC.
2. Estado actual de `src/components/AgendaSection.astro`: solo tiene `data-tone="purple"`, `tabindex="-1"` en el h2, `scroll-margin-top: 1.5rem`, el `<script>` que importa `cta-focus` y el iframe original. Falta todo lo del Task 3: envoltura `.wrap`, columnas 5fr/7fr desde `lg` con `min-w-0`, enlace de respaldo, `noscript`, tarjeta `.form-embed` (fondo blanco, `var(--border-pop)`, `var(--radius-m)`, `var(--shadow-pop)`, `overflow: visible !important`) y `min-height` del iframe con `--form-min-h-sm`/`--form-min-h-lg` (los valores provisionales estan en `tokens.css`). Sin `height` fijo en px.
3. Clases y selectores ya en uso por las pruebas: `.wrap` (contenedor global), `.hero-sub` (subtitulo), `.wordmark`, `.skip a`, `a[data-cta="header"|"hero"]`, `#agenda-title`, `#main`. El Tailwind `container` no se usa (choca con el nombre); el contenedor es `.wrap`.
4. Los tokens semanticos del tono morado ya dan `--link` blanco y `--focus-ring` amarillo; el enlace de respaldo hereda `a { color: var(--link); text-decoration: underline }` de `global.css`.
5. Al terminar: reescribir este SUMMARY como completo (quitar `status: partial`, sumar el Task 3, acciones de `roadmap update-plan-progress`, `requirements.mark-complete FORM-01 FORM-02 FORM-03 FND-04 A11Y-03` con `requirements.ready-ids`, STATE.md), correr `npx playwright test` completo y el build con guardas, y la prueba de mutacion de glifos sobre una copia de `astro.config.mjs` (restaurar el original).
6. Recordar: iniciar el servidor con `npx astro build && npx astro preview --port 4322` antes de Playwright y detenerlo con `npx astro preview stop` al final.

## Known Stubs

- `--form-min-h-sm` y `--form-min-h-lg` siguen provisionales (Plan 04 los mide). Ya registrado por el Plan 02.
- Wordmark de texto en el header (la Fase 2 lo reemplaza por el logo SVG, DSGN-02) y `HeroSkeleton` provisional (CONT-01).

## Threat Flags

Ninguna superficie nueva fuera del modelo del plan. T-03-01 (sin `set:html`) y T-03-04 (el script solo compara con el literal `#agenda` y usa un id fijo) verificados; T-03-02, T-03-03 y T-03-05 pertenecen al Task 3 (enlace de respaldo y `noscript`).

## Self-Check: PASSED (parcial, Tasks 1 y 2)

- Archivos existentes: `playwright.config.ts`, `src/components/CtaLink.astro`, `HeroSkeleton.astro`, `SkipLinks.astro`, `SiteHeader.astro`, `src/scripts/cta-focus.ts`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/styles/global.css`, `tests/e2e/cta-focus.spec.ts`, `tests/e2e/a11y-base.spec.ts`.
- Commits: `ace95d4` y `ed2dd00` existen; `git rev-list --count b30f16c..HEAD` da 2.
