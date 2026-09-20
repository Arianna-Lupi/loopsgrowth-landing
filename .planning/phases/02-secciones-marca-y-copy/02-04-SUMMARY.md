---
phase: 02-secciones-marca-y-copy
plan: 04
subsystem: ui
tags: [astro, copy, yaml, playwright, results, cases, cards]
status: partial
plan_head_before: 235ffbd1353c71a17e575be24ad8fc9ad53589c6
# commits es el conteo medido del libro (git rev-list --count plan_head_before..HEAD) al escribir este resumen parcial,
# antes del commit del propio resumen. El ejecutor que cierre el plan lo vuelve a medir y lo reemplaza.
commits: 1
tasks_done: [1]
tasks_pending: [2, 3]

requires:
  - phase: 02-secciones-marca-y-copy
    provides: "Planes 01 a 03, 09, 10 y 11 (tonos, SectionShell, CtaLink, CollagePiece oficial, brand.ts con PURPLE_RGB)"
provides:
  - "Clave results en el YAML (titular y cuatro resultados con lead y cuerpo) y su esquema estricto de cuatro ítems"
  - "ResultItem y Results: #resultados en tono dark, 2x2 desde 640 px, montada tras La solución y antes de #agenda"
  - "results-cases.spec.ts con el bloque del tracer (estructura, textos del YAML, sin porcentaje de 30 ni de 50, estilos, rejilla y cero animaciones)"
affects: [02-05, 02-06, 02-07, 02-08]

actuals:
  tokens: 9000   # provisional: chars/4 sobre lo cambiado en la tarea 1 (src, tests y YAML); el cierre del plan lo reemplaza
  tasks: 1
  commits: 1

key-files:
  created:
    - src/components/ui/ResultItem.astro
    - src/components/sections/Results.astro
    - tests/e2e/results-cases.spec.ts
  modified:
    - src/content.config.ts
    - src/content/landing.es.yaml
    - src/pages/index.astro
    - PENDING-COPY.md
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
---

# Phase 2 Plan 04: Lo que logramos juntos y Casos de éxito Summary (PARCIAL)

**Tarea 1 (tracer) hecha y en verde: `#resultados` con los cuatro resultados del doc de Ari en tarjetas de borde amarillo con disco de check sobre fondo oscuro, sin publicar el rango de presupuesto de ads (su cuerpo muestra FALTA CONFIRMAR). Faltan la tarea 2 (Casos de éxito, MetricCard, lupa y CTA `casos`) y la tarea 3 (ciclo visual del lote C1).**

## Estado del plan

Se corta tras la tarea 1 por presupuesto de contexto (regla de corte 1 del plan y del orquestador). No se ejecutaron `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete`: se ejecutan una sola vez, al cerrar el plan.

### Hecho: tarea 1, commit `d4def27`

- **YAML:** clave `results` bajo `es` (entre `solution` y `agenda`), 9 afirmaciones con el texto de `02-ARI-COPY-V2.md`, sección 4, carácter por carácter. Estados: `verified` para el titular y los resultados 3 y 4; `pending` con `reason` para `results.items[0].body` (inferencia "el orgánico se abarata", COPY-VERIFICATION 3d), `results.items[1].lead` (se muestra tal cual, sin cifra) y `results.items[1].body` (texto visible "FALTA CONFIRMAR"; la frase del doc con su marca de verificación vive solo en `reason`). La nota de Ari sobre la fusión de outcomes no se guarda ni se muestra.
- **Esquema:** `results` con `title` y `items` de exactamente cuatro objetos `{lead, body}` reutilizando `claim`.
- **Componentes:** `ResultItem.astro` (props `lead` y `body`; `li.result-item` con borde de 3 px `var(--color-brand-yellow)`, sin fondo, sombra ni hover; disco de check de 32 px en línea con `aria-hidden` y `focusable="false"`; `.result-lead` Title 600 y `.result-body` Body 400, ambos `var(--on-surface)`), `Results.astro` (`SectionShell` con `id="resultados"`, `tone="dark"`, `ul[role="list"]` de una columna y de 2x2 desde 40em con `align-items: stretch`). Ninguno lee `status`.
- **Página:** `index.astro` monta `<Results />` justo después de `<Solution />`.
- **Pruebas (rojo primero):** `results-cases.spec.ts` con 12 pruebas (a 1280 y 390 px: sección, tono, fondo `rgb(33, 33, 33)`, h2 blanco y `aria-labelledby`, cero `h3`, `a`, `button` y `[tabindex]`; cuatro `li` con lead y cuerpo del YAML; sin `30 %` ni `50 %` ni `[VERIFICAR`; borde amarillo de 3 px, pesos 600 y 400, disco de 32 px; una columna y 2x2 con alturas parejas; cero animaciones y opacidad 1 con `reduce` y `no-preference`). Las 12 fallaron antes de crear los componentes y pasan ahora.
- **Lote C1, ronda 0** registrado en `02-VISUAL-LOG.md` (skills `impeccable` con `context` y `shape`, y `design-taste-frontend` con diales 7, 3 y 4; patrón de cada referencia; conflictos resueltos a favor de la marca).

### Verificación de la tarea 1

- `npm run build` pasa (incluidos `prebuild` y `postbuild`). `node --test tests/guards/*.test.mjs`: 162 de 162.
- `PUBLIC_ENV=production node scripts/check-copy.mjs --json`: 0 estructurales y, en las rutas `results.`, 3 PENDING y 1 MISSING, ninguna otra regla.
- Script de subcadenas contra el doc de Ari: sale 0 (toda cadena de `results`, salvo el relleno, es literal del doc).
- `npm run pending`: 14 pendientes en total (3 nuevos); `node scripts/list-pending.mjs --check` sale 0; `grep -c "^| results\." PENDING-COPY.md` devuelve 3.
- E2E con ClickUp bloqueado (`results-cases`, `page-structure`, `a11y-base`): 78 pasan, 15 omitidas (capturas sin `PHASE2_BATCH`), 0 fallos. El orden y el tono de `#resultados` coinciden con `PAGE_ORDER`.
- Barridos: cero `set:html`, cero hex en `src/components` y `src/pages`, cero `outline: none`, cero `height:` fijo en los dos archivos nuevos. Hosts de `dist/index.html`: `app-cdn.clickup.com`, `forms.clickup.com` y el espacio de nombres de SVG.
- **Peso de `dist/index.html`: 42404 bytes** (antes 39497; `Results` suma 2907). Supera el tope interino de 42240 de 02-10 y 02-11, como preveía el plan; queda muy por debajo del tope global de 61440 (faltan 19036 bytes). Ningún tope se subió ni se bajó. Las tareas 2, 5 y 6 disponen de ese margen: `Cases` con cinco tarjetas y una lupa por `<use>` debería sumar unos 4 a 6 KB.
- Ningún servidor quedó levantado (`npx astro preview stop` tras el ciclo; el `astro dev` del usuario no se tocó).

## Lo que queda (para un ejecutor nuevo)

Leer este resumen, `02-04-PLAN.md` (tareas 2 y 3, con su `read_first`), `02-VISUAL-LOG.md` (entradas "Lote C1, ronda 0") y las tablas "Ranuras de copy" del plan. Base para los criterios de alcance de la tarea 3: BASE es `235ffbd` (`plan_head_before`); BASE2 será el SHA del commit de la tarea 2.

**Tarea 2 (auto, tdd): Casos de éxito con `MetricCard`, tarjeta ancha con lupa y CTA `casos`.**
- Pruebas (g) a (o) primero, en `tests/e2e/results-cases.spec.ts`, en rojo.
- YAML `cases` (`title`, `labels`, cinco `items`), esquema con `.length(5)` y `detail` opcional, `MetricCard.astro`, `Cases.astro` (CTA `casos` en el slot `cta`), montaje en `index.astro` tras `<Results />`, `npm run pending` y `cta:casos` después de `cta:solucion` en los dos arreglos de tabulación de `a11y-base.spec.ts` (casos a de 1280 y 390 px; hoy `cta:solucion` ya está).
- Recuento esperado con producción para las rutas de `cases.`: 13 PENDING y 5 MISSING; sumado a `results.`, 16 y 6; `PENDING-COPY.md` con 13 filas `cases.`.
- Firma vigente de la lupa: `<CollagePiece name="lupa" tone="light" size="6rem" rotate={n} />`, sin colores (Loopy oficial de un ojo, esquema A); el `svg` raíz lleva `data-collage="piece"` y `data-collage-piece="lupa"`.
- Colores del spec: `PURPLE_RGB` de `tests/e2e/lib/brand.ts` (el morado vigente es `#4228D1`, no el de los literales antiguos); nunca un `rgb(...)` del morado escrito a mano.
- Presupuesto de HTML: medir y anotar; el tope de `dist/index.html` de esta tarea es 61440 (el interino de 42240 ya no aplica). Si peligra, detenerse y reportar.

**Tarea 3 (auto): ciclo visual del lote C1** (pruebas (p) a (v), capturas por sección con `PHASE2_BATCH=C1`, `impeccable` `critique`, `layout`, `colorize`, `typeset`, `adapt` y `design-taste-frontend`, una ronda de corrección y una de confirmación, revisión de la lupa frente a la cifra a 320 y 1280 px, registro "Lote C1, ronda N", rasgos 2, 3, 4 y 7). Al cerrar el plan: SUMMARY completo, `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02`, `requirements.mark-complete CONT-05 CONT-06 COPY-01 DSGN-04`, y revisar a mano que ROADMAP.md marque 02-04 como `[x]` y STATE.md apunte a 02-05.

## Hallazgos para Ari (parciales; el resumen final suma los de casos)

1. **Rango de presupuesto de ads** ("entre 30% y 50%", `[VERIFICAR rango]`): sin respaldo propio; la página no lo publica y muestra FALTA CONFIRMAR. Ari aporta el dato con su fuente o decide otro texto.
2. **Resultado 2, lead** ("Dependes menos de los ads."): se muestra tal cual pero queda pending, porque resume el resultado cuyo dato falta.
3. **Inferencia "el orgánico se abarata"** y "una fracción" (resultado 1, COPY-VERIFICATION 3d): se muestran tal cual y quedan pending.
4. **Lenguaje de promesa:** "Apareces donde antes no estabas." promete visibilidad. Solo se reporta; no se reescribe (hallazgo 7 del UI-SPEC).

## Erratas del doc en esta sección

Ninguna en `results` (las de casos, 'trafico', 'organico' y 'exito', y la falta de punto final del caso 5, las conserva la tarea 2).

## Deviations from Plan

None hasta ahora: la tarea 1 se ejecutó tal como está escrita (con la nota de "Supuestos" 5: el lead del resultado 2 se muestra y solo el cuerpo dice FALTA CONFIRMAR).

## Known Stubs

Un relleno intencional: `results.items[1].body` muestra FALTA CONFIRMAR hasta que Ari entregue el dato (listado en `PENDING-COPY.md`).

## Threat Flags

Ninguno: sin endpoints, rutas de autenticación, acceso a archivos ni peticiones nuevas; el texto sale escapado del YAML.

## Self-Check: PASSED

- Archivos creados existen: `ResultItem.astro`, `Results.astro`, `results-cases.spec.ts`.
- Commit `d4def27` existe en la rama `gsd/phase-02-secciones-marca-y-copy`.
