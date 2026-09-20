---
phase: 02-secciones-marca-y-copy
plan: 04
subsystem: ui
tags: [astro, copy, yaml, playwright, results, cases, cards, collage]
status: partial
plan_head_before: 235ffbd1353c71a17e575be24ad8fc9ad53589c6
# commits es el conteo medido del libro (git rev-list --count plan_head_before..HEAD) al escribir este resumen parcial,
# antes del commit del propio resumen. El ejecutor que cierre el plan lo vuelve a medir y lo reemplaza.
commits: 3
tasks_done: [1, 2]
tasks_pending: [3]

requires:
  - phase: 02-secciones-marca-y-copy
    provides: "Planes 01 a 03, 09, 10 y 11 (tonos, SectionShell, CtaLink, CollagePiece oficial, brand.ts con PURPLE_RGB)"
provides:
  - "Clave results en el YAML y su esquema estricto de cuatro ítems; ResultItem y Results (#resultados, tono dark, 2x2 desde 640 px)"
  - "Clave cases en el YAML (titular, tres etiquetas y cinco casos) y su esquema con .length(5) y detail opcional"
  - "MetricCard (artículo con h3 de cifra y métrica, chip de canal, detalle opcional y dl de Sector, Plazo y Canal) y Cases (#casos, tono light, rejilla 1, 2 y 3 columnas con la quinta ancha)"
  - "Lupa oficial (CollagePiece, esquema A) solo en la quinta tarjeta y CTA casos, montada tras Results; cta:casos en el orden de tabulación"
  - "results-cases.spec.ts con el bloque de resultados (12 pruebas) y el de casos (g a o, 19 pruebas más)"
affects: [02-05, 02-06, 02-07, 02-08]

actuals:
  tokens: 16000   # provisional: chars/4 sobre lo cambiado en las tareas 1 y 2 (src, tests y YAML); el cierre del plan lo reemplaza
  tasks: 2
  commits: 3

key-files:
  created:
    - src/components/ui/ResultItem.astro
    - src/components/sections/Results.astro
    - src/components/ui/MetricCard.astro
    - src/components/sections/Cases.astro
    - tests/e2e/results-cases.spec.ts
  modified:
    - src/content.config.ts
    - src/content/landing.es.yaml
    - src/pages/index.astro
    - PENDING-COPY.md
    - tests/e2e/a11y-base.spec.ts
    - tests/e2e/collage-language.spec.ts
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
---

# Phase 2 Plan 04: Lo que logramos juntos y Casos de éxito Summary (PARCIAL)

**Tareas 1 y 2 hechas y en verde: `#resultados` con los cuatro resultados del doc de Ari y `#casos` con las cinco tarjetas de métrica (cifra morada con marcador amarillo, chip, dl de Sector, Plazo y Canal), la tarjeta ancha de Meta Ads con la única lupa oficial y el CTA `casos` en el orden de tabulación. Falta la tarea 3 (ciclo visual del lote C1: pruebas p a v, 25 capturas, `critique` y una ronda de corrección).**

## Estado del plan

Se corta tras la tarea 2 por presupuesto de contexto (regla de corte del orquestador: la tarea 3 solo se empieza con menos de la mitad del contexto usado, y ya no era el caso). No se ejecutaron `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete`: se ejecutan una sola vez, al cerrar el plan.

### Hecho: tarea 1, commit `d4def27` (tracer, Lo que logramos juntos)

- **YAML `results`** con las 9 afirmaciones del doc, sección 4. `verified` para el titular y los resultados 3 y 4; `pending` con `reason` para el cuerpo del resultado 1 (inferencia "el orgánico se abarata"), el lead del 2 y el cuerpo del 2, que muestra FALTA CONFIRMAR (el rango de presupuesto de ads no se publica; la frase del doc con su marca de verificación vive solo en `reason`). La nota de Ari sobre la fusión de outcomes no se guarda ni se muestra.
- **`ResultItem` y `Results`**: `li.result-item` con borde de 3 px amarillo, disco de check de 32 px en línea, lead 600 y cuerpo 400 en blanco sobre `dark`; rejilla de una columna y 2x2 desde 40 em con alturas parejas.
- **Lote C1, ronda 0** registrado en `02-VISUAL-LOG.md`.

### Hecho: tarea 2, commit `48fc303` (Casos de éxito)

- **Pruebas primero (rojo):** el bloque (g) a (o) de `results-cases.spec.ts` fallaba antes de existir el YAML y los componentes (`es.cases` indefinido); ahora las 31 pruebas del archivo pasan con ClickUp bloqueado. Cubren: sección, tono, fondo blanco y h2 morado; cinco `article` con h3 que es la frase completa del doc y da nombre a la tarjeta; chip, `dl` con las tres etiquetas del YAML, ningún `dd` vacío y `.metric-detail` solo si el YAML trae `detail`; cifra morada con marcador amarillo; rejilla por rectángulos a 390, 640, 768, 1024 y 1280 px (una, dos con la quinta ancha, tres con la quinta en las columnas 2 y 3); una sola lupa de 96 px dentro de la quinta tarjeta, sin cruzar chip, nombre, detalle ni `dl`, con la cifra por encima en el apilado; CTA `casos` (`href="#agenda"`, etiqueta del YAML resuelta, sin `aria-label`, 48 px o más de alto, 48 px bajo la rejilla, foco en `#agenda-title` tras el clic); tarjetas sin enfocables, sin cursor de puntero y sin cambio de `transform` ni `box-shadow` con hover; HTML menor a 61440 bytes.
- **YAML `cases`:** `title` ("Casos de exito", `pending`), `labels` (Sector, Plazo y Canal, `verified`) y cinco casos con el texto del doc carácter por carácter. Estados según la tabla del plan: cifra, métrica, detalle y sector de los casos 1 a 4 `verified`; plazos `pending` ("6 meses" y "12 meses" salen del detalle del doc); canal de los casos 1 a 4 con FALTA CONFIRMAR (`pending`); caso 5 con `figure` `verified` y `metric`, `sector`, `channel` ("Meta Ads") `pending`, plazo FALTA CONFIRMAR, y sin `detail` (el doc no trae línea de detalle).
- **Recuento con producción:** `results.` 3 PENDING y 1 MISSING; `cases.` 13 PENDING y 5 MISSING (16 y 6 en total), 0 estructurales y ninguna regla distinta de PENDING o MISSING. `PENDING-COPY.md` pasa de 14 a 27 pendientes: 3 filas `results.` y 13 `cases.`; `node scripts/list-pending.mjs --check` sale 0.
- **Esquema:** `cases` con `title`, `labels` estricto e `items` de exactamente cinco objetos estrictos con `detail` opcional.
- **`MetricCard`:** `article.metric-card` con `aria-labelledby`; chip (Label 600, borde de 3 px, fondo crema, pastilla), `h3` con `.metric-figure` (Display 700, morado, `.metric-mark` con relleno plano `var(--mark)` en el tercio inferior) y `.metric-name` (Title 700) separados por un espacio explícito; `dl` con tres filas; sin hover, transición ni enfocables. La variante `wide` monta `<CollagePiece class="metric-lupa" name="lupa" tone="light" size="6rem" rotate={6} />`.
- **`Cases`:** `SectionShell` (`id="casos"`, `tone="light"`), `ul[role="list"]` con cinco `li`, el índice 4 con `data-wide`, y `CtaLink location="casos"` en el slot `cta`. Rejilla: 1 columna, 2 desde 40 em con la ancha en `1 / -1`, 3 desde 64 em con la ancha en `span 2`.
- **Página y tabulación:** `index.astro` monta `<Cases />` tras `<Results />`; `a11y-base.spec.ts` suma `'cta:casos'` tras `'cta:solucion'` en los dos arreglos (1280 y 390 px).

### Verificación de la tarea 2

- `npm run build` pasa (con `prebuild` y `postbuild`); `node --test tests/guards/*.test.mjs` pasa; `node scripts/check-contrast.mjs`: 14 de 14 pares aprobados.
- Script de subcadenas contra el doc de Ari: sale 0 (toda cadena de `results`, `cases.title` y `cases.items`, salvo el relleno, es literal del doc).
- E2E completo con ClickUp bloqueado (`npm run test:e2e:isolated`): 306 pasan, 65 omitidas (capturas sin `PHASE2_BATCH` y variantes), 0 fallos tras las dos correcciones de "Desviaciones".
- Barridos: cero `set:html`, cero hex en `src/components` y `src/pages`, cero `outline: none`, cero `height:` fijo en los archivos nuevos; `grep -c "trafico organico"` y `grep -c "Casos de exito"` del YAML: 1 y 1 (erratas conservadas); `cta:casos` 2 veces en `a11y-base.spec.ts`; `location="casos"` 1 vez en `Cases.astro`; `CollagePiece` 2 veces en `MetricCard.astro`. Hosts de `dist/index.html`: `app-cdn.clickup.com`, `forms.clickup.com` y el espacio de nombres de SVG.
- **Peso de `dist/index.html`: 48310 bytes** (antes 42404; `Cases` con `MetricCard` y una lupa por `<use>` suma 5906, dentro de la estimación de 4 a 6 KB). Tope global de 61440: faltan 13130 bytes para las tareas de los planes 05 a 08. Ningún tope se subió ni se bajó.
- Servidores: el `astro preview` del puerto 4322 se detuvo con `npx astro preview stop`; el `astro dev` del usuario no se tocó.

## Lo que queda (para un ejecutor nuevo)

Leer este resumen, `02-04-PLAN.md` (solo la tarea 3, líneas 415 a 454), `02-VISUAL-LOG.md` (entrada "Lote C1, ronda 0") y las tablas de "Ranuras de copy" solo si hace falta. Bases: BASE es `235ffbd` (`plan_head_before`); **BASE2 es `48fc303`** (commit de la tarea 2), para el criterio de que ninguna corrección de la tarea 3 toca el copy ni el esquema.

**Tarea 3 (auto): ciclo visual del lote C1.**
- Pruebas (p) a (v) en `tests/e2e/results-cases.spec.ts`: sin scroll horizontal y rectángulos dentro de `[0, innerWidth]` a 320, 390, 768, 1024 y 1280 px; a 320 px '+3.808%' y cada `dd` con el relleno dentro de su tarjeta; padding vertical de 64 px a 390 px y 96 px a 1024 y 1280 px; sin JavaScript (todos los textos y el CTA con `href="#agenda"`); espaciado de texto forzado de SC 1.4.12 a 320 y 1280 px; la cifra es lo más grande de cada tarjeta (fuente mayor que `.metric-name`, `.metric-detail`, `dt`, `dd` y el chip); bloque de capturas por sección (solo con `PHASE2_BATCH`, título con "captura"). Registrar en `02-VISUAL-LOG.md` cuáles fallaron antes de iterar.
- Capturas con `PHASE2_BATCH=C1` (25 en total: 15 de página completa y 10 por sección), `impeccable` (`critique`, `layout`, `colorize`, `typeset`, `adapt`; sin `animate`) y `design-taste-frontend` con la herramienta Skill, una ronda de corrección y una de confirmación como máximo, revisión de la lupa frente a la cifra a 320 y 1280 px, entrada "Lote C1, ronda N" y rasgos 2, 3, 4 y 7.
- Puntos a mirar por criterio propio, ya detectados al construir: (1) la fila del chip y la lupa mide unos 99 px en la tarjeta ancha, así que queda espacio vacío bajo el chip a la izquierda; evaluar si merece un ajuste de posición o rotación (`rotate` vive en `MetricCard`); (2) el chip crema frente a la cifra: peso visual; (3) "FALTA CONFIRMAR" en chip y `dd` a 320 px; (4) un solo par de tokens de sombra y borde ya definidos (`--shadow-pop`, `--border-pop`), no crear otros.
- **Al cerrar el plan:** reescribir este resumen con `status: complete`, medir `commits:` con el libro, luego ejecutar UNA vez `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02` y `requirements.mark-complete CONT-05 CONT-06 COPY-01 DSGN-04`, y revisar a mano que ROADMAP.md marque 02-04 como `[x]` y STATE.md apunte a 02-05 (la herramienta ya se equivocó antes al contar).

## Hallazgos para Ari

1. **Rango de presupuesto de ads** ("entre 30% y 50%", `[VERIFICAR rango]`): sin respaldo propio; la página no lo publica y muestra FALTA CONFIRMAR. Ari aporta el dato con su fuente o decide otro texto.
2. **Resultado 2, lead** ("Dependes menos de los ads."): se muestra tal cual pero queda pending, porque resume el resultado cuyo dato falta.
3. **Inferencia "el orgánico se abarata"** y "una fracción" (resultado 1, COPY-VERIFICATION 3d): se muestran tal cual y quedan pending.
4. **Lenguaje de promesa:** "Apareces donde antes no estabas." promete visibilidad. Solo se reporta; no se reescribe (hallazgo 7 del UI-SPEC).
5. **Canal de los casos 1 a 4:** el doc no lo nombra; el chip y el dato de Canal muestran FALTA CONFIRMAR en las cuatro tarjetas. Ari lo entrega por caso (en el caso 3 el detalle dice "tráfico orgánico", pero eso no dice el canal del caso).
6. **Plazo del caso 5:** el doc no lo da; muestra FALTA CONFIRMAR.
7. **Plazos de los casos 1 a 4** ("6 meses" y "12 meses"): salen del detalle de cada caso; el UI-SPEC pide que Ari confirme los cinco.
8. **Caso 5 (Meta Ads):** el doc trae una sola frase ("marca personal referente en Meta Ads"), sin línea de detalle y sin punto final. La página la muestra completa como sector y toma "Meta Ads" como canal; la métrica "en crecimiento de trafico organico" habla de tráfico orgánico en un caso de Meta Ads, y no encaja con el resto (SEO/GEO). Ari confirma cómo se divide la frase y si el caso va.
9. **Titular de casos:** el doc no trae titular para la sección 5; se usó su rótulo, "Casos de exito", con la errata.
10. **Cifras sin signo de moneda:** "$41K a $76K" se muestra tal cual; no se agregó ninguna moneda.

## Erratas del doc conservadas (no se corrigieron)

- `results`: ninguna.
- `cases`: "Casos de exito" (sin tilde), "en crecimiento de trafico organico" (sin tilde en trafico y organico) y la falta de punto final del caso 5. Se muestran tal cual y quedan `pending` para que Ari las revise.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prueba (k) de `a11y-base.spec.ts` contaba una marca por afirmación y el canal se imprime dos veces**
- **Found during:** Tarea 2, primera corrida completa de `a11y-base.spec.ts` (12 marcas en el cuerpo frente a 8 esperadas).
- **Issue:** la prueba deriva de `walkClaims` el número de marcas FALTA CONFIRMAR visibles, y cada afirmación se imprime una vez. El plan 04 imprime el canal de cada caso dos veces (el chip y el dato de Canal; supuesto 8 del plan), así que las cuatro marcas de canal aparecen el doble.
- **Fix:** se suma una constante `CHIP_DUPLICATES` (cuenta los canales cuyo texto es la marca) y la prueba espera `VISIBLE_MARKS + CHIP_DUPLICATES`. El plan pedía que en ese archivo solo cambiaran las dos líneas del arreglo; este cambio es adicional y se documenta aquí.
- **Files modified:** `tests/e2e/a11y-base.spec.ts`
- **Commit:** `48fc303`

**2. [Rule 1 - Bug] Prueba "cada escena existe una vez" de `collage-language.spec.ts` contaba la lupa como una escena**
- **Found during:** Tarea 2, corrida completa del E2E (10 elementos `[data-collage]` frente a los 9 esperados).
- **Issue:** la prueba de un plan anterior cuenta todos los `[data-collage]` y espera nueve escenas; la lupa de Casos es una pieza suelta (`data-collage="piece"`), no una escena.
- **Fix:** la cuenta de escenas excluye las piezas y una segunda aserción fija que hay exactamente una pieza suelta. Este archivo no estaba en `files_modified` del plan: el criterio de alcance de la tarea 2 (`git diff --name-only BASE` sin archivos fuera de la lista) lo listará; es el único.
- **Files modified:** `tests/e2e/collage-language.spec.ts`
- **Commit:** `48fc303`

### Ajustes de diseño respecto al texto del plan (mismo resultado medible)

- **Lupa en la fila del chip, no con posición absoluta.** El plan pedía la lupa anclada con `position: absolute` a la esquina de la tarjeta. Se colocó como elemento de la rejilla de la tarjeta ancha, en la fila del chip y a la derecha (en dos columnas de 5fr y 7fr desde 40 em, y en `1fr auto` bajo 40 em). Así nunca cruza la cifra, el nombre ni el `dl` por construcción, sin depender de márgenes, y las pruebas de no cruce y de apilado son reales. Costo: la fila mide unos 99 px, con espacio vacío bajo el chip. Revertir: `position: absolute` en `.metric-lupa` con `top` y `right` de 1 rem y un padding superior en el `dl`.
- **Prueba de la lupa mide el ancho calculado** (`getComputedStyle().width`, 96 px) y no el `boundingBox`, porque con `rotate={6}` el rectángulo de la caja incluye la rotación.

## Known Stubs

- `results.items[1].body` muestra FALTA CONFIRMAR hasta que Ari entregue el dato del presupuesto de ads (tarea 1).
- En `cases`: los canales de los casos 1 a 4 y el plazo del caso 5 muestran FALTA CONFIRMAR (en el chip y en el `dd`). Todos están en `PENDING-COPY.md` (13 filas `cases.`) y no bloquean el objetivo del plan: ningún `dd` queda vacío y ninguna tarjeta se oculta.

## Threat Flags

Ninguno: sin endpoints, rutas de autenticación, acceso a archivos ni peticiones nuevas; el texto sale escapado del YAML y la lupa es un `<use>` interno del sprite.

## Self-Check: PASSED

- Archivos creados existen: `ResultItem.astro`, `Results.astro`, `MetricCard.astro`, `Cases.astro`, `results-cases.spec.ts`.
- Commits `d4def27` y `48fc303` existen en la rama `gsd/phase-02-secciones-marca-y-copy`.
