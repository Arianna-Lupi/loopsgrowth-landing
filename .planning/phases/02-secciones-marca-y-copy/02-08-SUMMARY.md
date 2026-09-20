---
phase: 02-secciones-marca-y-copy
plan: 08
subsystem: cierre de fase (matriz de medición, cierre visual, hallazgos para Ari)
tags: [axe, playwright, contact-sheet, closing]
status: partial
requires:
  - phase: 02-07
    provides: phase-closing.spec.ts con 'conexiones de fase', motion.css, guardas motion-budget y phase2-static
provides:
  - "@axe-core/playwright 4.13.0 como dependencia de desarrollo"
  - "bloque 'axe de humo' (/ y /privacidad/ a 320, 390 y 1280 px) y bloque 'hoja de contacto' (PHASE2_BATCH) en phase-closing.spec.ts"
  - "entrada 'Cierre, tracer (CIERRE0)' en 02-VISUAL-LOG.md"
  - "matriz de medición completa en phase-closing.spec.ts (desborde, espaciado SC 1.4.12, sin JavaScript, ClickUp bloqueado, objetivos, sombras, área de salvado, peso y peticiones, CTA en una línea)"
  - "02-VISUAL-LOG.md consolidado: lote 0 de 02-02, CIERRE1 y CIERRE2, 8 rasgos, 15 filas, conteos de axe y pendientes para Juan"
affects: [02-08 tarea 3, fase 3 (compuerta de accesibilidad)]
tech-stack:
  added: ["@axe-core/playwright 4.13.0 (devDependencies, exacta)"]
  patterns: ["contexto aislado con todo lo que no es localhost abortado", "hoja de contacto por rejilla CSS de <img> en base64"]
key-files:
  created: []
  modified:
    - tests/e2e/phase-closing.spec.ts
    - src/components/CtaLink.astro
    - package.json
    - package-lock.json
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
decisions:
  - "La hoja de contacto deriva los ids de las secciones del DOM (main > section) en lugar de importar PAGE_ORDER, porque page-structure.spec.ts es un spec y no exporta la constante; el aserto de 14 objetivos (header, 12 secciones, footer) cubre la deriva."
  - "Tarea 2: la prueba de degradados cuenta como degradado solo el gradient con más de un color o no lineal, porque MetricCard pinta su marcador amarillo con linear-gradient(c, c), un relleno plano."
  - "Tarea 2: el hero (subtítulo en Body) y la rejilla de La solución (alto parejo por fila) cumplen el UI-SPEC y sus pruebas; la crítica los deja como propuestas para Juan, no como correcciones."
  - "El bloque 'axe de humo' ya cubre los tres anchos y las dos rutas (el punto 5 de la tarea 2 queda hecho); la tarea 2 no lo repite."
metrics:
  actuals:
    tasks: 2
    commits: 5
  completed: 2026-09-19
commits: 5
plan_head_before: d0ac3f720a871fd47e645ac1f133f9b5ea99632e
---

# Phase 2 Plan 08: Cierre de fase (PARCIAL: tareas 1 y 2 de 3) Summary

Tracer de cierre (axe 4.13.0, hoja de contacto) y matriz completa de medición en verde: desborde a 6 anchos con ambas preferencias de movimiento, espaciado de texto, sin JavaScript, ClickUp bloqueado, objetivos de 44 px, cero sombras difusas y degradados, área de salvado del logo, peso (HTML de `/` en 71 843 bytes crudos y 14 274 con gzip -9) y hosts. El ciclo visual `CIERRE1` y `CIERRE2` con `impeccable` y `design-taste-frontend` encontró un solo defecto de CSS (el CTA caía a dos líneas a 320 px), corregido en `CtaLink.astro`; el log quedó consolidado. Queda la tarea 3 (auditoría de copy, hallazgos para Ari, suite completa). Nota: `commits: 5` es el conteo medido antes del commit de este resumen. **No se corrieron** `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete`: se ejecutan una sola vez cuando el plan esté completo y la suite en verde.

## Estado de las tareas

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Tracer (axe, hoja de contacto, log CIERRE0) | Hecha | b1f3905 |
| 2. Matriz completa, ciclo critique y polish, log consolidado | Hecha | 05919aa (matriz), 3d97955 (CTA a 320 px), 2e37e32 (log) |
| 3. Auditoría de copy, `02-ARI-FINDINGS.md`, suite completa | PENDIENTE | |

## Tarea 1: resultado

- **Legitimidad del paquete:** `gsd-tools query package-legitimacy check --ecosystem npm @axe-core/playwright` devolvió `OK` el 2026-09-19 (existe, 7 267 599 descargas semanales, repo dequelabs/axe-core-npm, sin postinstall, no obsoleto). Instalado `@axe-core/playwright@4.13.0` con `--save-exact` en `devDependencies`; `git diff` de `package.json` muestra solo esa línea. `npm install` reportó 0 vulnerabilidades.
- **RED antes de instalar:** el spec falló con `Cannot find package '@axe-core/playwright'`.
- **GREEN:** `npx playwright test --project=chromium tests/e2e/phase-closing.spec.ts` -> 12 pasan (6 de 'conexiones de fase' y 6 de 'axe de humo') y 2 en skip (la hoja de contacto sin `PHASE2_BATCH`, como debe ser).
- **axe:** `/` y `/privacidad/` a 320, 390 y 1280 px con 0 violaciones en total (0 critical o serious, 0 moderate o minor), sin iframe y con ClickUp bloqueado.
- **Hoja de contacto:** `PHASE2_BATCH=CIERRE0 ... -g "hoja de contacto"` -> 2 pasan; 30 archivos (14 recortes x 2 anchos + 2 hojas), hojas de 705 KB (1280) y 1.4 MB (390), legibles.
- **Alcance:** el tracer no tocó `src/`; `landing.es.yaml` sin cambios.

## Tarea 2: resultado

- **Matriz** (`tests/e2e/phase-closing.spec.ts`, commit 05919aa, 54 pruebas en total con las del tracer): 24 de desborde (`/` y `/privacidad/`, 6 anchos, `reduce` y `no-preference`), 2 de espaciado SC 1.4.12, 1 sin JavaScript, 2 con ClickUp bloqueado, 4 de objetivos y área de salvado (44 px de alto y `--logo-clear` de cada `.brand-logo`, a 390 y 1280 px), 2 de sombras y degradados, 5 de peso y peticiones. Todo en verde a la primera. Topes: HTML 81 920 crudos y 25 600 gzip (medido: 71 843 y 14 274), collage y sprite 42 240 (medido: 24 392, 15 raíces sin anidar, sprite de 6 135), sin `.js` en `dist`, script en línea por debajo de 3 072 bytes, hosts solo localhost, forms.clickup.com y app-cdn.clickup.com.
- **Ciclo visual:** `CIERRE1` y `CIERRE2` con `impeccable` (`context`, `critique`; `audit`, `polish`, `harden` y `adapt` aplicados sobre la matriz medida) y `design-taste-frontend`, ambas con la herramienta Skill. Se miraron el moodboard, `ai_a.png`, las dos hojas de contacto, `390-nojs`, `320-reduce` y dos recortes. La crítica corrió en un solo contexto (sin herramienta de subagentes). Único defecto corregido: el CTA caía a dos líneas a 320 px (73 px de alto); `padding-inline: 1rem` bajo 360 px (`CtaLink.astro`, commit 3d97955) lo deja en una línea (48 px), con prueba nueva a 320, 390 y 1280 px que distingue el estado viejo del nuevo. Propuestas para Juan sin cambiar: subtítulo del hero en Title, tarjeta de equipo de La solución en dos columnas, tres radios fuera de la escala de DESIGN.md.
- **Log:** `02-VISUAL-LOG.md` con el lote 0 de 02-02 consolidado, `CIERRE1`, `CIERRE2`, tabla de los 8 rasgos (todos cumplen, con medidas), tabla de las 15 filas, conteos de axe (0 violaciones en las seis combinaciones) y 10 pendientes para Juan (commit 2e37e32).
- **Verificación:** `npm run build` sale 0; Playwright chromium con `phase-closing`, `motion`, `page-structure` y `a11y-base`: 144 pasan y 17 en skip (herramientas de captura sin `PHASE2_BATCH`); `node --test tests/guards/*.test.mjs`: 207 pasan, 0 fallan; `node scripts/check-contrast.mjs` sale 0; `git diff d0ac3f7 -- src/content/landing.es.yaml` vacío. El servidor preview se detuvo con `npx astro preview stop`.

## Trabajo restante (exacto, para un ejecutor nuevo)

Base de referencia para el ledger de commits: `plan_head_before` de arriba (el ledger `.git/gsd-plan-head-before-02-08` ya existe). Playwright vacía `test-results/` al empezar cada corrida: genera y mira las capturas en el mismo comando. Ejecutar siempre `npx astro build && npx astro preview --port 4322` en segundo plano (el `webServer` de la config falla dentro de un agente, `Process from config.webServer exited early`), y `npx astro preview stop` al final; `astro dev` (pid 86100) es del usuario.

**Tarea 2: ya hecha** (ver 'Tarea 2: resultado' arriba). No se repite.

**Tarea 3:** puede correr sola en un ejecutor nuevo. `npm run pending` dos veces con hash idéntico y `node scripts/list-pending.mjs --check`; producción (`PUBLIC_ENV=production node scripts/check-copy.mjs --json` solo PENDING y MISSING, `--dist dist` sale 1, `PUBLIC_ENV=production npm run build` falla en `prebuild` sin tocar `dist/index.html`, `PUBLIC_ENV=production node scripts/check-photos.mjs`); `02-ARI-FINDINGS.md` con seis secciones numeradas y todos los ítems listados en el plan, incluidos los añadidos del 2026-09-19 (palabras de las píldoras `seo`, `geo`, `ads` del copy de Ari y `spy`, `team work` del moodboard; avatares Loopy; fotos de stock de hero y whynow pendientes con la puerta `check-photos.mjs` y la nota de que muestran manos u ojo de personas reales sin autorización de imagen registrada por la fuente; crema como superficie; excepción del naranja sobre morado sin uso; discrepancia #73187F frente a #4228D1; logo horizontal e imagotipo solo sobre blanco; favicon mesa 18; emblema sobre oscuro ausente; isotipos 17 y 22 sobre oscuro como excepción de marca); prosa propia sin voseo ni guiones largos, citas del doc literales; suite completa (guardas, contraste, build, chromium, `test:e2e:isolated`, `live` si `curl https://forms.clickup.com` da 200); recién entonces `state.advance-plan`, `state.update-progress`, `state.record-session`, `roadmap.update-plan-progress 02` y `requirements.mark-complete DSGN-03 DSGN-04 COPY-01`, y revisar a mano ROADMAP.md (02-08 `[x]`, tabla 11/11) y STATE.md.

## Deviations from Plan

**Tarea 2, una precisión de medición (no de CSS):** el plan pide "ningún `background-image` computado contiene un degradado". `MetricCard` dibuja el marcador amarillo de la cifra con `linear-gradient(var(--mark), var(--mark))` (un solo color, relleno plano). La prueba cuenta como degradado solo el `gradient` con más de un color o no lineal, y se documentó en el log. Además, el tope de HTML es el vigente desde 02-06 (81 920 y 25 600 gzip) y no los 61 440 del texto del plan, como indicó el orquestador.

**Tarea 1:** None - se ejecutó como estaba escrita. Una nota de criterio: el bloque de axe se dejó desde el tracer en sus tres anchos y dos rutas (el plan lo pedía solo a 1280 px en `/` para el tracer y lo ampliaba en la tarea 2); es más medición, no menos.

## Known Stubs

None en los archivos de esta tarea.

## Self-Check: PASSED

- `tests/e2e/phase-closing.spec.ts` (05919aa y 3d97955), `src/components/CtaLink.astro` (3d97955), `02-VISUAL-LOG.md` (2e37e32), `package.json` y `package-lock.json` (b1f3905) existen y están commiteados.
- Ningún servidor preview quedó corriendo (`npx astro preview stop` confirmó el cierre; `astro dev` del usuario no se tocó).
