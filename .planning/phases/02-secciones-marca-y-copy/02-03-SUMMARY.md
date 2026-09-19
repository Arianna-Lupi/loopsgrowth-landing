---
phase: 02-secciones-marca-y-copy
plan: 03
subsystem: ui
tags: [astro, copy, yaml, collage, svg, playwright, cards, guards]
status: partial
plan_head_before: ae44486e5062b8a1cfa9f3d018c19b27005b2bea

requires:
  - phase: 02-secciones-marca-y-copy
    provides: "Plan 01 (tonos, SectionShell, CtaLink, tokens) y plan 02 (CollagePiece, sprite, chips y pegatinas)"
provides:
  - "Claves problem, why_now y solution en el YAML con las 26 afirmaciones del doc de Ari (cuatro pending, dos con la marca FALTA CONFIRMAR) y su esquema estricto"
  - "Prueba 9b de la guarda de copy reescrita: solo PENDING y MISSING, derivada del YAML con walkClaims, y toda marca debe ser pending"
  - "Secciones Problem, WhyNow y Solution completas entre el hero y #agenda; PainCard, PillarCard y la variante split del SectionShell"
  - "CTA de La solución con orden de tabulación actualizado y aserción de marcas visibles del caso k derivada del YAML"
  - "sections-problem-solution.spec.ts con 34 pruebas (estructura, copy del YAML, estilos calculados, columnas, collage, CTA y foco)"
affects: [02-04, 02-05, 02-06, 02-07, 02-08]

actuals:
  tokens: 12500
  tasks: 3
  commits: 3

tech-stack:
  added: []
  patterns:
    - "Ranura sin dato o rechazada por una guarda: text FALTA CONFIRMAR, status pending, confirm_by Ari y reason con la causa y el texto literal del doc; el componente imprime solo .text"
    - "Sombra dura heredada: --card-shadow se declara en el contenedor de la rejilla (lee --pop-shadow-color del tono padre) y la tarjeta de tono anidado la usa"
    - "SectionShell split y slot aside: h2, lead y collage a la izquierda y cuerpo a la derecha desde 64em, compatible hacia atrás"
    - "Numeral por contador de CSS (counter-reset en la rejilla, counter-increment en la tarjeta), decorativo y aria-hidden"

key-files:
  created:
    - src/components/ui/PainCard.astro
    - src/components/ui/PillarCard.astro
    - src/components/sections/Problem.astro
    - src/components/sections/WhyNow.astro
    - src/components/sections/Solution.astro
    - tests/e2e/sections-problem-solution.spec.ts
  modified:
    - src/content/landing.es.yaml
    - src/content.config.ts
    - PENDING-COPY.md
    - tests/guards/copy.test.mjs
    - src/components/ui/SectionShell.astro
    - src/pages/index.astro
    - tests/e2e/a11y-base.spec.ts
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md

key-decisions:
  - "El titular de La solución y el cuerpo del Pilar 4 se guardan como FALTA CONFIRMAR (pending) con el texto íntegro del doc en reason: la guarda rechaza la sigla de tres letras y la nota entre corchetes, y no se edita el texto de Ari."
  - "Por qué ahora se parte en seis filas, una por oración del doc; solo la segunda oración (clientes que preguntan a ChatGPT o a Gemini) queda pending."
  - "Verónica queda pending: su cargo en La solución difiere del de Quiénes somos."
  - "Numerales de las tarjetas por contador de CSS; la prueba comprueba la expresión y el contador porque getComputedStyle no resuelve el valor."

requirements-completed: []
requirements-pending: [CONT-02, CONT-03, CONT-04, COPY-01, DSGN-04]

coverage:
  - id: D1
    description: "Copy de las tres secciones tal cual del doc: 26 afirmaciones, cada text (salvo las dos marcas) es subcadena literal de 02-ARI-COPY-V2.md; producción reporta solo PENDING y MISSING"
    requirement: "COPY-01"
    verification:
      - kind: unit
        ref: "node --test tests/guards/*.test.mjs (88 pruebas, incluida la 9b reescrita) y el script de subcadenas literales de la tarea 1"
        status: pass
    human_judgment: false
  - id: D2
    description: "Las tres secciones con tono dark, yellow y light, tarjetas y filas con estilos calculados del contrato, columnas por ancho y CTA de La solución a 48 px bajo la rejilla con foco en #agenda-title (a 1280 y 390 px)"
    requirement: "CONT-02, CONT-03, CONT-04"
    verification:
      - kind: e2e
        ref: "npm run test:e2e:isolated -- tests/e2e/sections-problem-solution.spec.ts tests/e2e/page-structure.spec.ts tests/e2e/a11y-base.spec.ts tests/e2e/cta-focus.spec.ts (110 pasan)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Lote B de diseño (rondas de captura, critique, correcciones y verificación de 320 a 1280 px)"
    requirement: "DSGN-04"
    verification: []
    human_judgment: true
---

# Phase 2 Plan 03: Problema, Por qué ahora y La solución Summary

**Tres secciones de contenido con el texto de Ari tal cual (tarjetas de dolor con sombra naranja, lista de frases con collage compacto y cuatro pilares con chip propio y CTA), con el titular de La solución y el cuerpo del Pilar 4 mostrando FALTA CONFIRMAR y las guardas de copy aceptando solo PENDING y MISSING. Las tareas 1 a 3 están hechas; falta la tarea 4 (lote B de diseño y verificación de 320 a 1280 px).**

## Estado: parcial (corte natural tras la tarea 3)

El plan prevé cortar tras la tarea 3 cuando el contexto pasa de la mitad (las tres secciones ya están construidas y probadas). Las tareas 1, 2 y 3 están commiteadas y en verde. **Pendiente de un ejecutor nuevo: la tarea 4 completa.** No se marcaron como cumplidos CONT-02, CONT-03, CONT-04, COPY-01 ni DSGN-04 en REQUIREMENTS.md, ni se avanzó el contador de planes: eso corresponde al cierre de la tarea 4.

### Qué debe hacer la tarea 4 (según 02-03-PLAN.md)

1. **Pruebas primero** en `tests/e2e/sections-problem-solution.spec.ts`: (a) matriz de cinco anchos (320, 390, 768, 1024, 1280 px) con columnas esperadas (dolores en 3 desde 1024 px, pilares en 2 desde 640 px, Por qué ahora en dos columnas desde 1024 px), `scrollWidth` de cada sección menor o igual al viewport, ningún rectángulo de tarjeta o fila fuera de `[0, innerWidth]` y `.whynow-art` sin cruzar h2 ni lista; (b) padding vertical de las tres secciones (64 px bajo 1024 px, 96 px desde 1024 px); (c) espaciado de texto SC 1.4.12 con `addStyleTag` (interlineado 1.5, letras 0.12em, palabras 0.16em, párrafos 2em, prioridad forzada solo en el spec): ninguna `.pain-card`, `.pillar-card` ni `.whynow-list > li` recorta su contenido y no hay scroll horizontal a 320 px; (d) `document.getAnimations().length` es 0 con `reduce` y `no-preference`, y con `javaScriptEnabled: false` las tres secciones y el CTA `solucion` son visibles; (e) bloque de capturas que solo corre con `PHASE2_BATCH` (`test.skip` si no) con título que contenga "captura", que a 390 y 1280 px guarda `test-results/phase2/<lote>-<id>-<ancho>.png` de `problema`, `por-que-ahora` y `solucion` con todo lo que no es localhost abortado.
2. **Ciclo del lote B** (invocar `impeccable` con `critique`, `layout`, `colorize` y `bolder` solo si una sección se ve plana, y `design-taste-frontend` con diales 7, 3 y 4): una ronda de captura con `PHASE2_BATCH=B` (21 archivos: 15 de página completa más 6 de sección), mirar solo 390 y 1280 px de sección, corregir todo en un lote, una ronda de confirmación como máximo (tope de tres ciclos), y registrar "Lote B, ronda 1" en `02-VISUAL-LOG.md` con verbos, hallazgos, correcciones, capturas, la nota de las listas con `role="list"` (respaldo de VoiceOver) y los rasgos 2, 3, 7 y 8 de la lista de vibra.
3. **Cierre:** suite completa (`npm run test:e2e:isolated`), guardas, `PUBLIC_ENV=production node scripts/check-copy.mjs --dist dist --json` con solo MISSING en el mismo número que las marcas del YAML, actualizar este SUMMARY a `status: complete` y correr `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02` y `requirements.mark-complete CONT-02 CONT-03 CONT-04 COPY-01 DSGN-04`.

### Observaciones visuales de una revisión previa (1280 px, no es una ronda del lote B)

Se miraron capturas de las tres secciones a 1280 px (fuera del repositorio) al terminar cada tarea. Candidatos para el `critique` de la tarea 4:

- **El problema:** funciona (tarjetas blancas, sombra naranja, numerales morados, pegatinas distintas). Las tarjetas 1 y 2 quedan medio vacías junto a la 3, que trae el párrafo largo; es el comportamiento esperado del contrato (alto parejo).
- **Por qué ahora:** a 1280 px la columna izquierda queda con mucho vacío bajo el collage de 160 px frente a la lista de seis filas; evaluar si `layout` debe anclar el collage o dar más presencia.
- **La solución:** las cuatro tarjetas blancas se ven uniformes y algo planas; `bolder` o `colorize` pueden dar variación al Pilar 3 (equipo) o a los chips sin salirse de la paleta ni de la escala. La tarjeta del Pilar 4 queda con mucho aire bajo "FALTA CONFIRMAR" (cuerpo en Body 400, sin énfasis); decidir si la marca necesita un estilo de ranura más visible sin ocultarla. Las filas del equipo no tienen regla de 3 px (decisión abierta del plan: la iteración decide).
- No se miraron aún capturas a 390 px de las tres secciones; las mediciones del spec pasan a 390 px.

## Hecho

### Tarea 1 (tracer), commit `d07604f`

- `landing.es.yaml`: claves `problem` (título, tres dolores, frase final), `why_now` (título y seis oraciones) y `solution` (título, lead y cuatro pilares con lista de equipo en el tercero), 26 afirmaciones, con el texto de `02-ARI-COPY-V2.md` carácter por carácter (incluidos el espacio doble de `problem.items[2]`, la errata "direcciôn", los dos puntos finales y la línea de Arianna sin punto).
- Pending: `why_now.items[1]`, `solution.title`, `solution.items[2].list[2]` y `solution.items[3].body`; las dos con `FALTA CONFIRMAR` como texto guardado y el texto literal del doc en `reason`.
- `content.config.ts`: `problem.items` exactamente 3, `solution.items` exactamente 4, `why_now.items` 1 o más, lista de equipo opcional.
- `tests/guards/copy.test.mjs` 9b: acepta solo PENDING y MISSING sobre el YAML real, deriva rutas de `walkClaims` y `findMissingMark`, exige `pending` en toda reclamación con la marca y comprueba el hash del YAML. Guardas: 88 pruebas verdes.
- `a11y-base.spec.ts`: caso a de 1280 y de 390 px con `cta:solucion`; caso k con aserción derivada del YAML (apariciones de la marca en `/` igual a las reclamaciones con la marca fuera de `privacy.`), con y sin JavaScript.
- Secciones en HTML plano, `index.astro` con el orden Problem, WhyNow, Solution entre el hero y `#agenda`, spec nuevo del tracer y "Lote B, ronda 0" en `02-VISUAL-LOG.md`. `PENDING-COPY.md` regenerado (11 pendientes, cuatro nuevos).

### Tarea 2, commit `1ecebf6`

- `SectionShell` con la prop `split` y el slot `aside` (`Astro.slots.has('aside')`), compatible hacia atrás.
- `PainCard` (tono anidado light, borde de 3 px, radio 16, sombra `6px 6px 0 var(--card-shadow)`, numeral por contador, pegatina de 64 px), `Problem` (rejilla de 1 y 3 columnas, `--card-shadow` en el contenedor, frase final en Title 700 a 48 px) y `WhyNow` (`split`, collage compacto de 160 px con lupa y ojos de tono yellow, filas con regla de 3 px y la última con regla inferior).

### Tarea 3, commit `d194134`

- `PillarCard` (chip de 64 px, h3 a 16 px del chip, cuerpo a 8 px del h3, lista opcional del equipo; borde de 3 px y sombra dura de 4 px) y `Solution` (chips lupa, ojos, loop y clic; 1 columna bajo 640 px y 2 desde 640 px; CTA a 48 px bajo la rejilla). El Pilar 4 muestra `FALTA CONFIRMAR`; la errata "direcciôn" sale tal cual.
- Esta tarea sí corrió en rojo primero: cinco pruebas fallaron por contenido (sin `.pillar-card`) antes de construir.

## Verificación (estado tras la tarea 3)

- `npm run test:e2e:isolated -- tests/e2e/sections-problem-solution.spec.ts tests/e2e/page-structure.spec.ts tests/e2e/a11y-base.spec.ts tests/e2e/cta-focus.spec.ts`: 110 pasan, 15 omitidas (capturas de lote sin `PHASE2_BATCH`).
- `node --test tests/guards/*.test.mjs`: 88 pasan. `node scripts/check-contrast.mjs`: 11/11 pares. `npm run build` pasa; `node scripts/list-pending.mjs --check` sale 0 (11 pendientes).
- Producción (`PUBLIC_ENV=production`): solo reglas PENDING y MISSING; cero estructurales.
- `dist/index.html`: 2 apariciones de `FALTA CONFIRMAR`, 3 ids de sección, 4 `<h3>`, `direcciôn` presente, 0 apariciones de `AEO` y 0 de `[VERIFICAR`. Cero `set:html`, cero hex en `src/components` y `src/pages`, cero `outline: none`. Ninguno de los archivos prohibidos (hero, collage, brand, header, layouts, agenda, skip links, `CtaLink`, `styles`, `scripts`, `public`) cambió.
- Ningún servidor quedó levantado por este ejecutor (`npx astro preview stop` tras cada ciclo; el `astro dev` del usuario no se tocó).

## Erratas del doc detectadas en estas secciones (se muestran tal cual)

1. `problem.items[2]`: espacio doble antes de "y" ("no se mueve  y el negocio"). El HTML lo colapsa a uno al mostrarlo; el YAML lo conserva.
2. `solution.items[2].list[3]`: "direcciôn" con circunflejo en lugar de "dirección".
3. La misma línea de Arianna termina sin punto final.
4. Del plan 01 (hero): "estan" sin tilde en `hero.description[1]`.

## Hallazgos para Ari

1. **Titular de La solución** ("Un equipo que ejecuta SEO y AEO, no que te asesora."): la guarda rechaza la sigla de tres letras; queda pending y la página muestra FALTA CONFIRMAR. Ari decide qué término usar.
2. **Pilar 4 (cuerpo):** el doc trae una nota `[VERIFICAR: ...]` sobre el desglose por canal (Google vs IA); queda pending con FALTA CONFIRMAR y el párrafo íntegro en `reason`. Ari lo respalda con datos o lo suaviza.
3. **Verónica:** el cargo de La solución ("Gerente de Proyectos y Consultora SEO") difiere del de Quiénes somos ("Directora de Proyectos"). Ari elige cuál usar.
4. **`why_now.items[1]`:** afirmación de mercado sobre clientes que preguntan a ChatGPT o a Gemini (misma familia que COPY-VERIFICATION 3b, datos de EE.UU.).
5. **Promesa:** "respondemos por el resultado" (lead de La solución) puede leerse como promesa de resultado; solo se reporta, no se edita.
6. **Las cinco afirmaciones de mercado del UI-SPEC** ("los ads se encarecen", "el orgánico se abarata", etc.) no existen en el Copy v2, que trae seis oraciones en dos párrafos; no se inventó ninguna.

Las cuatro rutas pending nuevas: `why_now.items[1]`, `solution.title`, `solution.items[2].list[2]` y `solution.items[3].body`.

## Brecha de la guarda (para el plan 07)

`VERIFICAR_RE` en `scripts/lib/copy-rules.mjs` es `/\[VERIFICAR\]/gi`: no reconoce la forma real del doc, `[VERIFICAR: ...]`. Aquí no importa porque el Pilar 4 se guarda con la marca y la prueba de este plan afirma que ninguna de las tres secciones muestra `[VERIFICAR`. El plan 07 debe ampliar la expresión.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Aserciones del spec que la primera corrida puso en rojo**
- **Found during:** Tarea 2
- **Issue:** (a) `getComputedStyle(el, '::before').content` devuelve la expresión `counter(pain, decimal-leading-zero)` y no el valor resuelto ("01"), así que la comprobación literal del plan no es medible; (b) tras el clic en el CTA, `document.activeElement.id` se leía antes de que el script de foco terminara.
- **Fix:** (a) la prueba comprueba la expresión con dos dígitos, `counter-reset: pain 0` en la rejilla y `counter-increment: pain 1` en cada tarjeta, que producen 01, 02 y 03 en orden; (b) se usa `toBeFocused()` con reintento, igual que `cta-focus.spec.ts`.
- **Files modified:** tests/e2e/sections-problem-solution.spec.ts
- **Commit:** 1ecebf6

### Otras desviaciones

- **Orden TDD en la tarea 2:** los componentes se escribieron antes que las pruebas, así que las pruebas nuevas nacieron en verde (salvo las dos correcciones de arriba) y no se vio el rojo previo. La tarea 3 sí respetó el rojo primero. La cobertura de la tarea 2 es equivalente; se anota por transparencia.
- **Prueba de estilos de La solución:** se añadió `toHaveLength(4)` para que no pase en vacío si no hay tarjetas.
- **`HeroCollage.astro` declarado por 02-01 y 02-02:** este plan no lo toca; el choque de `files_modified` no produjo conflicto (ambos planes ya estaban commiteados antes de esta wave).
- **Tarea 4 no ejecutada** (corte natural del plan por presupuesto de contexto); ver arriba.

## Threat Flags

Ninguno: no hay endpoints, rutas de autenticación, acceso a archivos ni cambios de esquema en fronteras de confianza; el texto sale escapado del YAML y las únicas peticiones externas siguen siendo las de ClickUp.

## Known Stubs

Los dos "FALTA CONFIRMAR" (`solution.title` y `solution.items[3].body`) son huecos intencionales del copy, listados en `PENDING-COPY.md` y en `.planning/WINDOWS.md` cuando el libro esté disponible. Los resuelve Ari.

## Self-Check: PASSED

- Archivos creados existen: PainCard, PillarCard, Problem, WhyNow, Solution y sections-problem-solution.spec.ts.
- Commits `d07604f`, `1ecebf6` y `d194134` existen en la rama `gsd/phase-02-secciones-marca-y-copy`.
