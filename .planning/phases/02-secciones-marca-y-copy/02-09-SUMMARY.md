---
phase: 02-secciones-marca-y-copy
plan: 09
subsystem: ui
tags: [brand, tokens, contrast, purple, cream, guards, playwright, logo, svg, artboards]
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
  - "17 SVG oficiales en src/assets/brand (una mesa del .ai por variante y fondo), catálogo de las 32 mesas en logo-variants.mjs con resolveLogo, availableTones, MIN_HEIGHT_PX, y Logo.astro por variante y tono sin recolor"
  - "scripts/brand/extract-artboards.mjs y scripts/lib/brand-svg.mjs (cleanArtboard) para regenerar las mesas desde un .ai nuevo"
  - "Hoja /marca/hoja/ con identidad por tono (6, 4, 3 y 4 mesas) y paleta leída de tokens.css; .gitignore de *.ai, BrandBook*.pdf y brand-inventory"
affects: [02-03, 02-04, 02-05, 02-06, 02-07, 02-08, 02-10, 02-11]

requirements-completed: []

commits: 3
actuals:
  tokens: 60000
  tasks: 2
  commits: 3

key-files:
  created:
    - tests/e2e/lib/brand.ts
    - tests/guards/brand-palette.test.mjs
    - src/components/brand/logo-variants.mjs
    - scripts/lib/brand-svg.mjs
    - scripts/brand/extract-artboards.mjs
    - "src/assets/brand/*.svg (17 mesas: apilado 01, 03, 05, 08; horizontal 06; imagotipo 07; emblema 10, 12, 24; isotipo 13, 14, 16, 17; ojo 18, 19, 21, 22)"
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
    - tests/guards/brand-assets.test.mjs
    - src/components/brand/Logo.astro
    - src/components/SiteHeader.astro
    - "src/pages/marca/[sheet].astro"
    - .gitignore
  deleted:
    - src/assets/brand/logo-horizontal.svg
    - src/assets/brand/isotipo.svg

key-decisions:
  - "El morado de la página es #4228D1 (decisión de Juan, 2026-09-19). El morado anterior (etiqueta errónea de la página 8 del BrandBook) queda fuera del código y una guarda lo impide."
  - "El crema #F4F3E0 es token primitivo, no un quinto tono: REQUIRED_TONES sigue en cuatro."
  - "Las 17 mesas se extraen con pdftocairo, cleanArtboard, SVGO y el viewBox medido con getBBox en Chromium; un archivo por mesa aunque varias traigan el mismo arte (13, 16 y 17; 18, 21 y 22; 1 y 5; 3 y 8; 10 y 24), para auditar cada una contra el .ai."
  - "Naranja sobre morado (2.95) pasa a par prohibido; solo sobrevive como relleno decorativo del collage (ALLOWED_FILLS.purple), con una guarda que exige ambos lugares a la vez."

duration: n/a
completed: 2026-09-19
---

# Phase 2 Plan 09: Marca oficial (PARCIAL, tareas 1 y 2 de 4) Summary

**Morado oficial #4228D1 y crema #F4F3E0 como tokens únicos con 14 pares aprobados y 11 prohibidos medidos, y las 17 mesas oficiales del .ai como SVG limpios con catálogo de 32 mesas probado por mutación, `Logo` por variante y tono sin recolor y hoja de revisión con identidad y paleta. Faltan las tareas 3 y 4.**

## Estado del plan

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Morado oficial de punta a punta (token, pares, guardas, logo del header) | Hecha | 973eb1b |
| 2. Las 17 mesas oficiales como SVG limpios, catálogo, Logo por tono y hoja | Hecha | b0f139b |
| 3. Favicon de la mesa 18, documentos (DESIGN.md, PRODUCT.md, CLAUDE.md, UI-SPEC, REQUIREMENTS, PROJECT) | PENDIENTE | |
| 4. Ciclo visual con `impeccable` y `design-taste-frontend` a 320, 390, 768, 1024 y 1280 px en 02-VISUAL-LOG.md | PENDIENTE | |

Corte tomado en el punto de corte 2 del plan (identidad completa) por presupuesto de contexto. La tarea 3 (favicon y documentos) y la tarea 4 (ciclo visual) quedan para un ejecutor nuevo.

## Tarea 1: qué se hizo

- Skills invocadas al empezar (design-taste-frontend e impeccable, `impeccable context` sin entrevista). Lectura de diseño: landing B2B de captación, lenguaje collage pop de marca, accesibilidad primero, diales 7/3/4. Conflicto con la regla anti-lila de la taste skill resuelto a favor de la marca (el azul violeta es el color del BrandBook).
- Rojo primero: `node --test` sobre contrast y brand-palette falló con 13 pruebas por aserción. Nombres: "el morado anterior (hex y forma rgb) no aparece en src, public, tests ni scripts", "tokens.css declara exactamente los seis hex de marca y no declara el iris", "excepción decorativa: naranja sobre morado vive a la vez en ALLOWED_FILLS y en FORBIDDEN_PAIRS", "las listas exportadas traen 14 pares aprobados y 11 prohibidos", "parseTokens lee @theme static...", "un selector descendiente [data-tone] .card...", "ejecución por defecto: código 0 y 14 pares aprobados", "apuntar --focus-ring del tono morado a oscuro... 1.88", y las cinco mutaciones nuevas (purple con --bar naranja 2.95, purple con --on-surface oscuro 1.88, cambiar el morado, cambiar el crema, light con --link crema 1.12). En navegador, la prueba `(e2) el logo del header y el h1 comparten el morado de marca` falló en `expect(fill).toBe(h1)` (logo `rgb(66, 40, 209)`, h1 con el morado anterior).
- Mediciones confirmadas con `contrastRaw` (todas coinciden con el plan dentro de 0.01): morado sobre blanco 8.551, blanco sobre morado 8.551, amarillo sobre morado 5.428, morado sobre amarillo 5.428, crema sobre morado 7.632, morado sobre crema 7.632, oscuro sobre crema 14.372, crema sobre oscuro 14.372, oscuro sobre morado 1.883, morado sobre oscuro 1.883, naranja sobre morado 2.954, amarillo sobre crema 1.406, naranja sobre crema 2.584, blanco sobre crema 1.120.
- Verde: `check-contrast` imprime `14/14 pares aprobados, 11 prohibidos verificados`; `node --test tests/guards/*.test.mjs` pasa 99 de 99; build limpio; Playwright (brand-assets, page-structure, sections-problem-solution, a11y-base, cta-focus) 155 pasadas y 15 omitidas, 0 fallos, con `E2E_BLOCK_CLICKUP=1`.
- Criterios de aceptación: cero hex en `src/components`, `src/pages` y `src/layouts`; cero apariciones del morado anterior en `src`, `public`, `tests` y `scripts`; el diff contra `plan_head_before` no toca `src/content`, `PENDING-COPY.md`, `src/components/sections`, `src/components/ui` ni `src/layouts`.
- Comentarios actualizados: cabecera de `tokens.css` (paleta, crema, etiqueta errónea sin repetir su valor, regla de cambiar morado en dos lugares), `SkipLinks.astro` (5.43) y `collage-rules.mjs` (excepción del naranja sobre morado).

## Tarea 2: qué se hizo

- Skills: `impeccable` invocada con la herramienta Skill (verbos `shape` y `adapt`, sin entrevista); `design-taste-frontend` ya se había invocado en la tarea 1 y no se repitió por presupuesto. El ciclo visual completo con capturas a cinco anchos es la tarea 4.
- Fuente: `.ai` de Ari (PDF de 32 mesas de 800 x 800), id de Drive `1fBrYK6dJJwBRERVetXYePqSSUIMrcZ0C`, copia local fuera del repo (`.../scratchpad/brand/logo.ai`), `shasum -a 256` = `d55c86b54ff2cfd8cb1a0de24f46bf9a858b884687015b475a6047ae1014df03`. No se versiona: `.gitignore` cubre `*.ai`, `BrandBook*.pdf` y `.planning/phases/*/brand-inventory/`, y una guarda `git ls-files` lo comprueba.
- Rojo primero (9 pruebas en `tests/guards/brand-assets.test.mjs`, todas por importación o archivo ausente): `(vi-i) catálogo: las mesas 1 a 32 una sola vez, cada una usada o con motivo`, `(vi-ii) archivos: src/assets/brand trae exactamente los 17 del catálogo`, `(vi-iii) higiene: cada SVG oficial es solo svg y path, acotado y con rellenos de marca`, `(vi-iv) contraste por mesa: fg contra la superficie del tono coincide con el catálogo`, `(vi-viii) mutación: un catálogo sin la excepción de la mesa 17 o con una razón cambiada se detecta`, `(vi-v) resolveLogo devuelve la mesa de cada variante y tono, y falla en español si no existe`, `(vi-vi) Logo.astro importa exactamente los archivos del catálogo, sin recolor ni atributo de tono`, `(vi-vii) cleanArtboard: quita los rect, ajusta el crema, rechaza colores ajenos y limpia la raíz`, `(vi-ix) los originales (.ai, .pdf, brand-inventory/) no están versionados y .gitignore los cubre`. Las guardas pasaron de 99 a 108 y todas en verde.
- Extracción (`node scripts/brand/extract-artboards.mjs --source <ai>`), bytes, rutas tras SVGO y viewBox medido:

| Mesa | Archivo | Bytes | Rutas | viewBox |
|------|---------|------:|------:|---------|
| 01 | apilado-01-blanco.svg | 3675 | 4 | 162.61 269.04 482.39 267.49 |
| 03 | apilado-03-morado.svg | 3675 | 4 | 162.61 269.04 482.39 267.49 |
| 05 | apilado-05-amarillo.svg | 3675 | 4 | 162.61 269.04 482.39 267.49 |
| 08 | apilado-08-oscuro.svg | 3675 | 4 | 162.61 269.04 482.39 267.49 |
| 06 | horizontal-06-blanco.svg | 3627 | 4 | 43.4 344.17 712.6 125.22 |
| 07 | imagotipo-07-blanco.svg | 5344 | 12 | 43.4 344.17 712.6 125.22 |
| 10 | emblema-10-blanco.svg | 5590 | 9 | 83.92 247 631.18 309.16 |
| 12 | emblema-12-morado.svg | 5619 | 10 | 83.92 247 631.18 309.16 |
| 24 | emblema-24-amarillo.svg | 5590 | 9 | 83.92 247 631.18 309.16 |
| 13 | isotipo-13-blanco.svg | 2422 | 10 | 138.95 250.67 543.04 332 |
| 14 | isotipo-14-morado.svg | 2422 | 10 | 138.95 250.67 543.04 332 |
| 16 | isotipo-16-amarillo.svg | 2422 | 10 | 138.95 250.67 543.04 332 |
| 17 | isotipo-17-oscuro.svg | 2422 | 10 | 138.95 250.67 543.04 332 |
| 18 | ojo-18-blanco.svg | 1525 | 6 | 176.65 188.12 437.35 449.1 |
| 19 | ojo-19-morado.svg | 1498 | 5 | 176.65 188.12 437.35 449.1 |
| 21 | ojo-21-amarillo.svg | 1525 | 6 | 176.65 188.12 437.35 449.1 |
| 22 | ojo-22-oscuro.svg | 1525 | 6 | 176.65 188.12 437.35 449.1 |

- Fidelidad: cada SVG (con su viewBox devuelto a 0 0 800 800) se pintó sobre la superficie de su tono en Chromium y se comparó pixel a pixel con `pdftocairo -png -r 72` de la misma mesa: 0 a 293 píxeles de 640000 difieren en más de 60 niveles (bordes con antialiasing), sin diferencias de forma ni de color. SVGO fusionó trazos adyacentes del mismo relleno (por eso el apilado pasa de 11 a 4 rutas); no cambia el dibujo.
- Higiene medida: 17 archivos, el mayor pesa 5619 bytes (límite 8192), cero `<rect>`, solo `svg` y `path`, cuatro rellenos (`#4228d1`, `#6c61db`, `#f4f3e0`, `#1e1e1e`) y cada `path` con su `fill`.
- `logo-variants.mjs` (sin hex; `fg` es nombre de token): 32 mesas (17 usadas, 15 con motivo), `LOGO_TONES`, `LOGO_VARIANTS`, `MIN_HEIGHT_PX`, `availableTones`, `resolveLogo` con el error en español pedido. Excepción de marca en 17 y 22, lista independiente en la guarda.
- `Logo.astro`: importaciones explícitas de los 17 SVG, emite `data-variant`, `data-logo-tone` y `data-artboard`, nunca el atributo de tono de la página, sin regla de relleno; `--logo-min`, `--logo-h` y `--logo-clear` por variante (apilado con la mitad del alto). `SiteHeader.astro`: una constante `tone` alimenta el header y el logo.
- Hoja `/marca/hoja/`: una sección de identidad por tono (light 6, yellow 4, dark 3, purple 4) con zona de borde punteado y padding `--logo-clear` (limitado a 1.5 rem bajo 64em), rótulo `<variante> / mesa NN`, y franja de paleta con seis muestras cuyo hex se lee de `tokens.css`. Se revisó una captura a 1280 px por inspección visual (`test-results/phase2/M-hoja-*.png`, ignorada por git): las 17 mesas se ven con sus colores de marca sobre cada superficie.
- Verde: `npm run build` limpio; `node --test tests/guards/*.test.mjs` 108 de 108; `check-contrast` 14/14 aprobados y 11 prohibidos; Playwright (`brand-assets`, `a11y-base`, `page-structure`, con `E2E_BLOCK_CLICKUP=1`) 117 pasadas y 20 omitidas, 0 fallos; el build con `PUBLIC_ENV=production` no genera `dist/marca` y el normal sí genera `dist/marca/hoja/index.html`; `dist/index.html` pesa 30362 bytes (límite 61440); `package.json` y `package-lock.json` sin cambios; sin hex en `src/components`, `src/pages` ni `src/layouts`; ningún `.ai`, `.pdf` ni ruta `brand-inventory/` versionados.

## Para retomar (tareas 3 y 4)

- `plan_head_before` = 34585692b8f281880085ee4356b5756162e841b6 (ledger local `.git/gsd-plan-head-before-02-09`). Al terminar, `commits:` se mide con `git rev-list --count 34585692b8f281880085ee4356b5756162e841b6..HEAD` (al escribir esto: 3 commits de código y documento más el de este resumen) y se pasa `status: complete`.
- Tarea 3 (plan, líneas 305 a 344): favicon de la mesa 18 con evidencia medida a 16 px, y documentos (DESIGN.md, PRODUCT.md, `.claude/CLAUDE.md`, UI-SPEC con fe de erratas, REQUIREMENTS, PROJECT) al día con el morado oficial. El script `scripts/brand/extract-artboards.mjs` hoy solo implementa `--source`, `--only` y `--out`; el plan pide agregar `--favicon` y `--favicon-evidence` en esta tarea. Lo que ya existe y sirve: `src/assets/brand/ojo-18-blanco.svg` (mesa 18), `logo-variants.mjs`, `cleanArtboard`. `public/favicon.svg` y `public/favicon.ico` siguen siendo los de la 02-02 y `favicon` tiene su prueba en `brand-assets.spec.ts` (ICO con 16, 32 y 48 px, SVG cuadrado sin script ni http).
- Tarea 4 (plan, líneas 346 a 381): ciclo visual con `impeccable` y `design-taste-frontend` a 320, 390, 768, 1024 y 1280 px, registro en `02-VISUAL-LOG.md`, exclusión de producción de la hoja. `PHASE2_BATCH=<lote> E2E_BLOCK_CLICKUP=1 npx playwright test --project=chromium tests/e2e/brand-assets.spec.ts -g "captura de la hoja"` ya guarda `test-results/phase2/<lote>-hoja-<ancho>.png`.
- Protocolo de navegador: `npm run build`, `npx astro preview --port 4322` (si un agente lo lanza queda en segundo plano), correr el spec con `E2E_BLOCK_CLICKUP=1` y `npx astro preview stop` al final. `astro dev` (pid 86100) es del usuario: no matarlo.
- Al cerrar todo: `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02` y `requirements.mark-complete DSGN-01 DSGN-02 DSGN-03 DSGN-04 FND-03`. Con la ejecución parcial NO se corrieron.
- Para el `EXCEPTIONS.md` de la fase 3: isotipo y ojo sobre oscuro (mesas 17 y 22), aro morado 1.88 contra #212121, figura legible por el anillo crema. Para Ari: no hay emblema sobre oscuro (mesa 25 con texto morado); horizontal e imagotipo solo existen sobre claro.

## Deviations from Plan

None - las tareas 1 y 2 se ejecutaron como el plan las escribió. Notas menores: (tarea 2) los dos archivos viejos `logo-horizontal.svg` e `isotipo.svg` se eliminaron a propósito (son las mesas 06 y 13 con nombre anterior); el script de extracción todavía no trae `--favicon` ni `--favicon-evidence`, que el plan asigna a la tarea 3; (tarea 1) la constante del morado anterior en `brand-palette.test.mjs` se arma en hexadecimal (`[0x73, 0x18, 0x7f]`) para que el archivo no contenga el literal decimal que la propia guarda busca.

## Known Stubs

None.

## Threat Flags

None.

## Self-Check: PASSED

- FOUND: tests/e2e/lib/brand.ts, tests/guards/brand-palette.test.mjs
- FOUND: commit 973eb1b
- FOUND: commit b0f139b, src/components/brand/logo-variants.mjs, scripts/lib/brand-svg.mjs, scripts/brand/extract-artboards.mjs y los 17 SVG de src/assets/brand
