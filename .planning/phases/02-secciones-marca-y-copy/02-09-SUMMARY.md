---
phase: 02-secciones-marca-y-copy
plan: 09
subsystem: ui
tags: [brand, tokens, contrast, purple, cream, guards, playwright]
status: partial
plan_head_before: 34585692b8f281880085ee4356b5756162e841b6

requires:
  - phase: 02-01
    provides: tokens.css con cuatro tonos, guarda de contraste y SectionShell
  - phase: 02-02
    provides: Logo.astro, collage-rules.mjs, brand-assets.spec.ts y la hoja de revisión
provides:
  - "--color-brand-purple = #4228d1 (morado oficial) y --color-brand-cream = #f4f3e0 como primitivos de tokens.css, sin quinto tono"
  - "14 pares aprobados y 11 prohibidos medidos con contrastRaw en scripts/lib/contrast.mjs; check-contrast sale 0"
  - "tests/guards/brand-palette.test.mjs: cero morado anterior en src, public, tests y scripts; seis hex de marca exactos en tokens.css; cero hex fuera de tokens en src; excepción del naranja sobre morado en ambos lugares"
  - "tests/e2e/lib/brand.ts: PURPLE_RGB y rgbOfToken leídos de tokens.css; los specs ya no repiten el valor"
affects: [02-03, 02-04, 02-05, 02-06, 02-07, 02-08, 02-10, 02-11]

requirements-completed: []

commits: 1
actuals:
  tokens: 21000
  tasks: 1
  commits: 1

key-files:
  created:
    - tests/e2e/lib/brand.ts
    - tests/guards/brand-palette.test.mjs
  modified:
    - src/styles/tokens.css
    - scripts/lib/contrast.mjs
    - src/components/collage/collage-rules.mjs
    - src/components/SkipLinks.astro
    - tests/guards/contrast.test.mjs
    - tests/e2e/page-structure.spec.ts
    - tests/e2e/sections-problem-solution.spec.ts
    - tests/e2e/a11y-base.spec.ts
    - tests/e2e/brand-assets.spec.ts

key-decisions:
  - "El morado de la página es #4228D1 (decisión de Juan, 2026-09-19). El morado anterior (etiqueta errónea de la página 8 del BrandBook) queda fuera del código y una guarda lo impide."
  - "El crema #F4F3E0 es token primitivo, no un quinto tono: REQUIRED_TONES sigue en cuatro."
  - "Naranja sobre morado (2.95) pasa a par prohibido; solo sobrevive como relleno decorativo del collage (ALLOWED_FILLS.purple), con una guarda que exige ambos lugares a la vez."

duration: n/a
completed: 2026-09-19
---

# Phase 2 Plan 09: Marca oficial (PARCIAL, tarea 1 de 4) Summary

**Morado oficial #4228D1 y crema #F4F3E0 como tokens únicos, con 14 pares aprobados y 11 prohibidos medidos y probados por mutación, y el h1 y el logo del header ya en el mismo color. Faltan las tareas 2, 3 y 4.**

## Estado del plan

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Morado oficial de punta a punta (token, pares, guardas, logo del header) | Hecha | 973eb1b |
| 2. Las 17 mesas oficiales como SVG limpios, catálogo, Logo por tono y hoja | PENDIENTE | |
| 3. Favicon de la mesa 18, documentos (DESIGN.md, PRODUCT.md, CLAUDE.md, UI-SPEC, REQUIREMENTS, PROJECT) | PENDIENTE | |
| 4. Ciclo visual con `impeccable` y `design-taste-frontend` a 320, 390, 768, 1024 y 1280 px en 02-VISUAL-LOG.md | PENDIENTE | |

Corte tomado en el punto de corte 1 del plan por presupuesto de contexto: la tarea 2 necesita leer el catálogo del final del plan, tres componentes, dos archivos de prueba y descargar y procesar el `.ai`, y no cabía completa en lo que quedaba. No se inició para no dejar trabajo a medias.

## Tarea 1: qué se hizo

- Skills invocadas al empezar (design-taste-frontend e impeccable, `impeccable context` sin entrevista). Lectura de diseño: landing B2B de captación, lenguaje collage pop de marca, accesibilidad primero, diales 7/3/4. Conflicto con la regla anti-lila de la taste skill resuelto a favor de la marca (el azul violeta es el color del BrandBook).
- Rojo primero: `node --test` sobre contrast y brand-palette falló con 13 pruebas por aserción. Nombres: "el morado anterior (hex y forma rgb) no aparece en src, public, tests ni scripts", "tokens.css declara exactamente los seis hex de marca y no declara el iris", "excepción decorativa: naranja sobre morado vive a la vez en ALLOWED_FILLS y en FORBIDDEN_PAIRS", "las listas exportadas traen 14 pares aprobados y 11 prohibidos", "parseTokens lee @theme static...", "un selector descendiente [data-tone] .card...", "ejecución por defecto: código 0 y 14 pares aprobados", "apuntar --focus-ring del tono morado a oscuro... 1.88", y las cinco mutaciones nuevas (purple con --bar naranja 2.95, purple con --on-surface oscuro 1.88, cambiar el morado, cambiar el crema, light con --link crema 1.12). En navegador, la prueba `(e2) el logo del header y el h1 comparten el morado de marca` falló en `expect(fill).toBe(h1)` (logo `rgb(66, 40, 209)`, h1 con el morado anterior).
- Mediciones confirmadas con `contrastRaw` (todas coinciden con el plan dentro de 0.01): morado sobre blanco 8.551, blanco sobre morado 8.551, amarillo sobre morado 5.428, morado sobre amarillo 5.428, crema sobre morado 7.632, morado sobre crema 7.632, oscuro sobre crema 14.372, crema sobre oscuro 14.372, oscuro sobre morado 1.883, morado sobre oscuro 1.883, naranja sobre morado 2.954, amarillo sobre crema 1.406, naranja sobre crema 2.584, blanco sobre crema 1.120.
- Verde: `check-contrast` imprime `14/14 pares aprobados, 11 prohibidos verificados`; `node --test tests/guards/*.test.mjs` pasa 99 de 99; build limpio; Playwright (brand-assets, page-structure, sections-problem-solution, a11y-base, cta-focus) 155 pasadas y 15 omitidas, 0 fallos, con `E2E_BLOCK_CLICKUP=1`.
- Criterios de aceptación: cero hex en `src/components`, `src/pages` y `src/layouts`; cero apariciones del morado anterior en `src`, `public`, `tests` y `scripts`; el diff contra `plan_head_before` no toca `src/content`, `PENDING-COPY.md`, `src/components/sections`, `src/components/ui` ni `src/layouts`.
- Comentarios actualizados: cabecera de `tokens.css` (paleta, crema, etiqueta errónea sin repetir su valor, regla de cambiar morado en dos lugares), `SkipLinks.astro` (5.43) y `collage-rules.mjs` (excepción del naranja sobre morado).

## Para retomar (tareas 2, 3 y 4)

- `plan_head_before` ya está anotado arriba (34585692...). El ledger local `.git/gsd-plan-head-before-02-09` existe; al terminar, `commits:` se mide con `git rev-list --count 34585692b8f281880085ee4356b5756162e841b6..HEAD` (hoy 1) y se actualiza `status: complete`.
- Tarea 2: leer del plan las líneas 290 a 556 (resto de la tarea 2, tareas 3 y 4, catálogo de mesas y tablas de contraste). Fuente `.ai`: `/private/tmp/claude-501/-Users-juan-Documents-Codigo-Arianna-loopsgrowth/95b7453c-d146-479b-b61b-39c583fd14fc/scratchpad/brand/logo.ai` o Drive `1fBrYK6dJJwBRERVetXYePqSSUIMrcZ0C` (no versionar; registrar el sha256 en el SUMMARY). Agregar a `.gitignore` `*.ai`, `BrandBook*.pdf` y `.planning/phases/*/brand-inventory/`.
- La prueba `(e)` de `tests/e2e/brand-assets.spec.ts` debe endurecerse a `PURPLE_RGB` en la tarea 2 (hoy solo exige que no sea none ni negro); ya importa `./lib/brand`.
- Al cerrar todo: `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02` y `requirements.mark-complete DSGN-01 DSGN-02 DSGN-03 DSGN-04 FND-03`. Con la ejecución parcial NO se corrieron.

## Deviations from Plan

None - la tarea 1 se ejecutó como el plan la escribió. Notas menores: la constante del morado anterior en `brand-palette.test.mjs` se arma en hexadecimal (`[0x73, 0x18, 0x7f]`) para que el archivo no contenga el literal decimal que la propia guarda busca.

## Known Stubs

None.

## Threat Flags

None.

## Self-Check: PASSED

- FOUND: tests/e2e/lib/brand.ts, tests/guards/brand-palette.test.mjs
- FOUND: commit 973eb1b
