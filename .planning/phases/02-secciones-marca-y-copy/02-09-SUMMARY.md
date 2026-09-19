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
  - "public/favicon.svg y public/favicon.ico salen de la mesa 18 (ojo con lupa) con `extract-artboards.mjs --favicon`; `--favicon-evidence` mide las mesas 13 y 18 a 16 y 32 px; buildFaviconSvg y packIco en scripts/lib/brand-svg.mjs; bloque [data-sheet=favicon] en la hoja"
  - "DESIGN.md, PRODUCT.md, .claude/CLAUDE.md (tabla de contraste), REQUIREMENTS.md, PROJECT.md y la fe de erratas de color de 02-UI-SPEC.md al morado oficial #4228D1"
affects: [02-03, 02-04, 02-05, 02-06, 02-07, 02-08, 02-10, 02-11]

requirements-completed: []

commits: 5
actuals:
  tokens: 75000
  tasks: 3
  commits: 5

key-files:
  created:
    - tests/e2e/lib/brand.ts
    - tests/guards/brand-palette.test.mjs
    - src/components/brand/logo-variants.mjs
    - scripts/lib/brand-svg.mjs
    - scripts/brand/extract-artboards.mjs
    - "src/assets/brand/*.svg (17 mesas: apilado 01, 03, 05, 08; horizontal 06; imagotipo 07; emblema 10, 12, 24; isotipo 13, 14, 16, 17; ojo 18, 19, 21, 22)"
  modified:
    - public/favicon.svg
    - public/favicon.ico
    - DESIGN.md
    - PRODUCT.md
    - .claude/CLAUDE.md
    - .planning/REQUIREMENTS.md
    - .planning/PROJECT.md
    - .planning/phases/02-secciones-marca-y-copy/02-UI-SPEC.md
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

# Phase 2 Plan 09: Marca oficial (PARCIAL, tareas 1 a 3 de 4) Summary

**Morado oficial #4228D1 y crema #F4F3E0 como tokens únicos con 14 pares aprobados y 11 prohibidos medidos, y las 17 mesas oficiales del .ai como SVG limpios con catálogo de 32 mesas probado por mutación, `Logo` por variante y tono sin recolor, hoja de revisión con identidad y paleta, favicon de la mesa 18 con evidencia medida y documentos vivos al día con el morado oficial. Falta la tarea 4 (ciclo visual y cierre).**

## Estado del plan

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Morado oficial de punta a punta (token, pares, guardas, logo del header) | Hecha | 973eb1b |
| 2. Las 17 mesas oficiales como SVG limpios, catálogo, Logo por tono y hoja | Hecha | b0f139b |
| 3. Favicon de la mesa 18, documentos (DESIGN.md, PRODUCT.md, CLAUDE.md, UI-SPEC, REQUIREMENTS, PROJECT) | Hecha | 3888a4b |
| 4. Ciclo visual con `impeccable` y `design-taste-frontend` a 320, 390, 768, 1024 y 1280 px en 02-VISUAL-LOG.md | PENDIENTE | |

Corte tomado tras la tarea 3 por presupuesto de contexto: la tarea 4 (ciclo visual con `impeccable` y `design-taste-frontend`, registro, suite completa y barridos) queda para un ejecutor nuevo.

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

## Tarea 3: qué se hizo

- `scripts/brand/extract-artboards.mjs` gana `--favicon-evidence` y `--favicon [archivo]` (por defecto `ojo-18-blanco`); ambas parten de los SVG ya extraídos y no piden `--source`. Los ayudantes puros viven en `scripts/lib/brand-svg.mjs` (`readViewBox`, `buildFaviconSvg`, `packIco`, `FAVICON_MARGIN`), sin dependencias nuevas.
- Evidencia medida en Chromium (lienzo transparente, 4 % de margen por lado, caja de píxeles con alfa >= 128, pupila = mayor componente conexa de píxeles con canal máximo <= 60, diámetro equivalente). `pupila_vector_px` repite la medida a 16 veces la resolución y divide entre 16, sin antialiasing:

| Mesa | Lado | Ancho px | Alto px | Pupila px (ráster) | Pupila px (vector) |
|------|-----:|---------:|--------:|-------------------:|-------------------:|
| 13 (isotipo, dos ojos) | 16 | 14 | 8 | 1.1 | 2.2 |
| 13 | 32 | 28 | 18 | 3.9 | 4.5 |
| 18 (ojo con lupa) | 16 | 14 | 14 | 3.0 | 3.7 |
| 18 | 32 | 28 | 29 | 6.4 | 7.4 |

- Decisión con la regla del plan (a 16 px: alto de la marca >= 12 y pupila >= 3): la mesa 13 no cumple (alto 8, pupila 1.1 ráster y 2.2 vector) y la mesa 18 sí (alto 14, pupila 3.0 ráster y 3.7 vector). Gana la mesa 18, como esperaba la planificación; el vector coincide con sus cifras (2.2 y 3.7). La pupila ráster de la 18 queda justo en el umbral, y por eso se registró también la medida del vector.
- `--favicon` escribió `public/favicon.svg` (1526 bytes, `viewBox="151.25 168.59 488.15 488.15"`, cuadrado, con `xmlns`, mismos 6 `path` y rellenos que `ojo-18-blanco.svg`) y `public/favicon.ico` (4542 bytes, cabecera 00 00 01 00, tres PNG de 16, 32 y 48 px de 695, 1493 y 2300 bytes).
- Rojo primero: la evidencia se corrió antes de escribir las pruebas; las guardas nuevas (vii-i a vii-v) validan el archivo generado, su reproducibilidad (`buildFaviconSvg(mesa 18)` es exactamente el archivo publicado, centrado y con el lado igual al mayor lado del arte entre 0.92), las mutaciones (un trazo cambiado, un `script`, un viewBox no cuadrado y una referencia externa se detectan), el `.ico` (tres entradas de 16, 32 y 48, cada una un PNG completo cuyo ancho y alto coinciden con su entrada) y `packIco`.
- En la hoja, bloque `[data-sheet="favicon"]` con `favicon.svg` a 16, 32 y 48 px sobre muestra `light` y `dark`, imágenes con `alt` que dice el tamaño; una prueba por ancho (320, 390, 768, 1024, 1280) comprueba las seis imágenes con `naturalWidth` mayor que 0, el tamaño renderizado y que no hay scroll horizontal.
- Documentos vivos, todos con `Edit`: `DESIGN.md` (`purple: "#4228d1"` y `cream: "#f4f3e0"`, los 14 pares con ratios nuevos, morado sobre oscuro 1.88, crema como superficie y no tono, naranja sobre morado 2.95 solo decorativo, logos por tono sin recolorear); `PRODUCT.md` (Purblue #4228D1, la etiqueta errónea de la página 8 y el crema); `.claude/CLAUDE.md` (solo las cinco filas del morado anterior más seis filas del crema); `REQUIREMENTS.md` (FND-03) y `PROJECT.md` (línea 28); `02-UI-SPEC.md` (bloque "Fe de erratas de color (2026-09-19)" bajo el párrafo "Sin neutrales inventados", sin tocar la tabla). Ningún documento vivo cita ya el morado anterior como vigente (solo se nombra como la etiqueta errónea).
- Verde: `npx astro build` limpio; `node --test tests/guards/*.test.mjs` 113 de 113; `check-contrast` 14/14 aprobados y 11 prohibidos; Playwright `brand-assets.spec.ts` con `E2E_BLOCK_CLICKUP=1` 56 pasadas y 5 omitidas, 0 fallos (incluye las cinco pruebas nuevas del favicon en la hoja y las de `/favicon.ico` y `/favicon.svg`); `package.json` y `package-lock.json` sin cambios desde `plan_head_before`; cero apariciones del morado anterior en `src`, `public`, `tests` y `scripts` (la constante hexadecimal `[0x73, 0x18, 0x7f]` de la guarda no coincide con el literal); cero hex en `src/components`, `src/pages` y `src/layouts`. Servidor de vista previa detenido; `astro dev` (pid 86100) del usuario intacto.
- Nota de alcance: `BaseLayout.astro` no declara `<link rel="icon">` (ningún archivo de `src` referencia el favicon). No se tocó porque el plan prohíbe cambios en `src/layouts`; los navegadores piden `/favicon.ico` por defecto y `/favicon.svg` queda servido. Si Ari quiere el enlace explícito, es un cambio de una línea fuera de este plan.

## Para retomar (solo tarea 4)

- `plan_head_before` = 34585692b8f281880085ee4356b5756162e841b6 (ledger local `.git/gsd-plan-head-before-02-09`). Al terminar, `commits:` se mide con `git rev-list --count 34585692b8f281880085ee4356b5756162e841b6..HEAD` (al escribir esto: 5, sin contar el commit de este resumen) y se pasa `status: complete`.
- Tarea 3: hecha (commit 3888a4b). El favicon ya sale de la mesa 18; la hoja trae el bloque `[data-sheet="favicon"]` para el punto (f) del ciclo visual.
- Tarea 4 (plan, líneas 346 a 381): ciclo visual con `impeccable` y `design-taste-frontend` a 320, 390, 768, 1024 y 1280 px, registro en `02-VISUAL-LOG.md`, exclusión de producción de la hoja. `PHASE2_BATCH=<lote> E2E_BLOCK_CLICKUP=1 npx playwright test --project=chromium tests/e2e/brand-assets.spec.ts -g "captura de la hoja"` ya guarda `test-results/phase2/<lote>-hoja-<ancho>.png`.
- Protocolo de navegador: `npm run build`, `npx astro preview --port 4322` (si un agente lo lanza queda en segundo plano), correr el spec con `E2E_BLOCK_CLICKUP=1` y `npx astro preview stop` al final. `astro dev` (pid 86100) es del usuario: no matarlo.
- Al cerrar todo: `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02` y `requirements.mark-complete DSGN-01 DSGN-02 DSGN-03 DSGN-04 FND-03`. Con la ejecución parcial NO se corrieron. Con la tarea 4 hecha, `REQUIREMENTS.md` ya dice `#4228D1` en FND-03; `requirements.mark-complete` solo marca casillas.
- Para el `EXCEPTIONS.md` de la fase 3: isotipo y ojo sobre oscuro (mesas 17 y 22), aro morado 1.88 contra #212121, figura legible por el anillo crema. Para Ari: no hay emblema sobre oscuro (mesa 25 con texto morado); horizontal e imagotipo solo existen sobre claro.

## Deviations from Plan

None - las tareas 1, 2 y 3 se ejecutaron como el plan las escribió. Notas menores: (tarea 2) los dos archivos viejos `logo-horizontal.svg` e `isotipo.svg` se eliminaron a propósito (son las mesas 06 y 13 con nombre anterior); (tarea 1) la constante del morado anterior en `brand-palette.test.mjs` se arma en hexadecimal (`[0x73, 0x18, 0x7f]`) para que el archivo no contenga el literal decimal que la propia guarda busca.

## Known Stubs

None.

## Threat Flags

None.

## Self-Check: PASSED

- FOUND: tests/e2e/lib/brand.ts, tests/guards/brand-palette.test.mjs
- FOUND: commit 973eb1b
- FOUND: commit b0f139b, src/components/brand/logo-variants.mjs, scripts/lib/brand-svg.mjs, scripts/brand/extract-artboards.mjs y los 17 SVG de src/assets/brand
- FOUND: commit 3888a4b, public/favicon.svg (1526 bytes), public/favicon.ico (4542 bytes)
