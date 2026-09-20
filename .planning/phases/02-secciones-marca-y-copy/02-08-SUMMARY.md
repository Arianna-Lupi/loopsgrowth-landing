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
affects: [02-08 tarea 2, 02-08 tarea 3, fase 3 (compuerta de accesibilidad)]
tech-stack:
  added: ["@axe-core/playwright 4.13.0 (devDependencies, exacta)"]
  patterns: ["contexto aislado con todo lo que no es localhost abortado", "hoja de contacto por rejilla CSS de <img> en base64"]
key-files:
  created: []
  modified:
    - tests/e2e/phase-closing.spec.ts
    - package.json
    - package-lock.json
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
decisions:
  - "La hoja de contacto deriva los ids de las secciones del DOM (main > section) en lugar de importar PAGE_ORDER, porque page-structure.spec.ts es un spec y no exporta la constante; el aserto de 14 objetivos (header, 12 secciones, footer) cubre la deriva."
  - "El bloque 'axe de humo' ya cubre los tres anchos y las dos rutas (el punto 5 de la tarea 2 queda hecho); la tarea 2 no lo repite."
metrics:
  actuals:
    tasks: 1
    commits: 1
  completed: 2026-09-19
commits: 1
plan_head_before: d0ac3f720a871fd47e645ac1f133f9b5ea99632e
---

# Phase 2 Plan 08: Cierre de fase (PARCIAL: tarea 1 de 3) Summary

Tracer de cierre hecho de punta a punta (axe 4.13.0 instalado, axe de humo en verde con 0 violaciones, hoja de contacto de 14 recortes por ancho y su primera entrada en el log). Quedan la tarea 2 (matriz, ciclo de critique y polish, log consolidado) y la tarea 3 (auditoría de copy, hallazgos para Ari, suite completa). **No se corrieron** `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete`: se ejecutan una sola vez cuando el plan esté completo y la suite en verde.

## Estado de las tareas

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Tracer (axe, hoja de contacto, log CIERRE0) | Hecha | b1f3905 |
| 2. Matriz completa, ciclo critique y polish, log consolidado | PENDIENTE | |
| 3. Auditoría de copy, `02-ARI-FINDINGS.md`, suite completa | PENDIENTE | |

## Tarea 1: resultado

- **Legitimidad del paquete:** `gsd-tools query package-legitimacy check --ecosystem npm @axe-core/playwright` devolvió `OK` el 2026-09-19 (existe, 7 267 599 descargas semanales, repo dequelabs/axe-core-npm, sin postinstall, no obsoleto). Instalado `@axe-core/playwright@4.13.0` con `--save-exact` en `devDependencies`; `git diff` de `package.json` muestra solo esa línea. `npm install` reportó 0 vulnerabilidades.
- **RED antes de instalar:** el spec falló con `Cannot find package '@axe-core/playwright'`.
- **GREEN:** `npx playwright test --project=chromium tests/e2e/phase-closing.spec.ts` -> 12 pasan (6 de 'conexiones de fase' y 6 de 'axe de humo') y 2 en skip (la hoja de contacto sin `PHASE2_BATCH`, como debe ser).
- **axe:** `/` y `/privacidad/` a 320, 390 y 1280 px con 0 violaciones en total (0 critical o serious, 0 moderate o minor), sin iframe y con ClickUp bloqueado.
- **Hoja de contacto:** `PHASE2_BATCH=CIERRE0 ... -g "hoja de contacto"` -> 2 pasan; 30 archivos (14 recortes x 2 anchos + 2 hojas), hojas de 705 KB (1280) y 1.4 MB (390), legibles.
- **Alcance:** el tracer no tocó `src/`; `landing.es.yaml` sin cambios.

## Trabajo restante (exacto, para un ejecutor nuevo)

Base de referencia para el ledger de commits: `plan_head_before` de arriba (el ledger `.git/gsd-plan-head-before-02-08` ya existe). Playwright vacía `test-results/` al empezar cada corrida: genera y mira las capturas en el mismo comando. Ejecutar siempre `npx astro build && npx astro preview --port 4322` en segundo plano (el `webServer` de la config falla dentro de un agente, `Process from config.webServer exited early`), y `npx astro preview stop` al final; `astro dev` (pid 86100) es del usuario.

**Tarea 2** (en `phase-closing.spec.ts`; ya existen los helpers `isolatedContext` y `AXE_TAGS`):
1. Bloques de medición nuevos: 'matriz de desborde' (320, 390, 640, 768, 1024, 1280 con `reduce` y `no-preference`, `/` y `/privacidad/`), 'espaciado de texto' (SC 1.4.12 a 320 y 1280), 'sin JavaScript' (12 secciones, `<details>` abre, 4 CTA), 'ClickUp bloqueado' (12 secciones, footer, enlace de respaldo, cero `pageerror`), 'objetivos, sombras y área de salvado' (44 px, sin desenfoque, sin degradados, `--logo-clear` alrededor de cada `.brand-logo` a 390 y 1280), 'peso y peticiones'. El punto 5 (axe en tres anchos y dos rutas) ya está hecho en la tarea 1.
2. Tope de peso: HTML de `/` por debajo de **81920 bytes crudos y 25600 con gzip -9** (los valores vigentes de las guardas desde 02-06, autorizados por el orquestador; el 61440 del texto original del plan quedó superado); suma de `outerHTML` de todos los `[data-collage]` de `/` más `outerHTML` de `.collage-sprite` de **42240 bytes o menos** (medir primero: no se midió aquí); `dist` sin `.js`; script en línea de `/` por debajo de 3072 bytes; hosts pedidos solo localhost, forms.clickup.com y app-cdn.clickup.com.
3. Ciclo visual: invocar `impeccable` y `design-taste-frontend` con la herramienta Skill (critique, audit, polish, harden, adapt; diales 7, 3 y 4) contra las 15 filas de 'Reference Synthesis', los 8 rasgos y la brecha de marca de `02-BRAND-INVENTORY.md` sección 5; rondas `CIERRE1` (y `CIERRE2` de confirmación; `CIERRE3` solo si hace falta) con `PHASE2_BATCH=<lote> npx playwright test --project=chromium tests/e2e/page-structure.spec.ts -g "captura"` y la hoja de contacto; abrir como máximo 4 recortes por ronda. Solo estilo y disposición de archivos existentes de `src/components`, `src/styles`, `src/layouts`; ningún texto, tokens, movimiento ni iframe.
4. `02-VISUAL-LOG.md`: entrada 'Lote 0' copiada de `02-02-SUMMARY.md` con la nota 'consolidada desde 02-02-SUMMARY.md'; rondas `CIERRE1` y `CIERRE2`; tabla de los 8 rasgos con evidencia numérica; tabla de las 15 filas; conteos de axe; pendientes para Juan (movimiento con `reduce` y `no-preference`, VoiceOver sobre `<details>`, avatares Loopy, favicon mesa 18, variantes de logo, morado, palabras de las píldoras, fotos en `/marca/hoja/`).
5. Verificar: `npm run build && npx playwright test --project=chromium tests/e2e/phase-closing.spec.ts tests/e2e/motion.spec.ts tests/e2e/page-structure.spec.ts tests/e2e/a11y-base.spec.ts && node --test tests/guards/*.test.mjs && node scripts/check-contrast.mjs`; `git diff BASE -- src/content/landing.es.yaml` vacío. Commit con lista explícita de archivos.

Primeras impresiones del tracer (a mirar en CIERRE1): descripción del hero en cuerpo pequeño frente al titular a 1280 px; tarjeta de equipo de La solución mucho más alta que su vecina de crema; tarjeta de `#agenda` vacía con ClickUp bloqueado (esperado).

**Tarea 3:** puede correr sola en un ejecutor nuevo. `npm run pending` dos veces con hash idéntico y `node scripts/list-pending.mjs --check`; producción (`PUBLIC_ENV=production node scripts/check-copy.mjs --json` solo PENDING y MISSING, `--dist dist` sale 1, `PUBLIC_ENV=production npm run build` falla en `prebuild` sin tocar `dist/index.html`, `PUBLIC_ENV=production node scripts/check-photos.mjs`); `02-ARI-FINDINGS.md` con seis secciones numeradas y todos los ítems listados en el plan, incluidos los añadidos del 2026-09-19 (palabras de las píldoras `seo`, `geo`, `ads` del copy de Ari y `spy`, `team work` del moodboard; avatares Loopy; fotos de stock de hero y whynow pendientes con la puerta `check-photos.mjs` y la nota de que muestran manos u ojo de personas reales sin autorización de imagen registrada por la fuente; crema como superficie; excepción del naranja sobre morado sin uso; discrepancia #73187F frente a #4228D1; logo horizontal e imagotipo solo sobre blanco; favicon mesa 18; emblema sobre oscuro ausente; isotipos 17 y 22 sobre oscuro como excepción de marca); prosa propia sin voseo ni guiones largos, citas del doc literales; suite completa (guardas, contraste, build, chromium, `test:e2e:isolated`, `live` si `curl https://forms.clickup.com` da 200); recién entonces `state.advance-plan`, `state.update-progress`, `state.record-session`, `roadmap.update-plan-progress 02` y `requirements.mark-complete DSGN-03 DSGN-04 COPY-01`, y revisar a mano ROADMAP.md (02-08 `[x]`, tabla 11/11) y STATE.md.

## Deviations from Plan

None - la tarea 1 se ejecutó como estaba escrita. Una nota de criterio: el bloque de axe se dejó desde el tracer en sus tres anchos y dos rutas (el plan lo pedía solo a 1280 px en `/` para el tracer y lo ampliaba en la tarea 2); es más medición, no menos.

## Known Stubs

None en los archivos de esta tarea.

## Self-Check: PASSED

- `tests/e2e/phase-closing.spec.ts`, `package.json`, `package-lock.json` y `02-VISUAL-LOG.md` existen y están commiteados (b1f3905).
- Ningún servidor preview quedó corriendo (`npx astro preview stop` confirmó el cierre).
