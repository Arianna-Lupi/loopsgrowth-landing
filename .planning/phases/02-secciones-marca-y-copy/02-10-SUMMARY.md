---
phase: 02-secciones-marca-y-copy
plan: 10
subsystem: ui
tags: [collage, loopy, brand, moodboard, scenes, guards, playwright, svg, astro]
status: partial
plan_head_before: 7d84e0894bc620eb66a21d8cf501f773e2fa45e1

requires:
  - phase: 02-09
    provides: mesas oficiales del .ai, catalogo resolveLogo, morado oficial y crema como tokens, extract-artboards.mjs
provides:
  - "src/assets/loopy/: cuatro fuentes de Loopy sin unir rutas (mesas 13, 14, 18 y 19; 11 y 6 rutas)"
  - "loopy.mjs (parsePaths, loopyScheme, loopyGeometry, schemeColors, LOOPY_ROLES), scenes.mjs (SCENES, assertScene R1 a R11, PHOTO_SLOTS, sceneTraits, ayudas de geometria), CollageScene.astro y Pill.astro como unico mecanismo"
  - "collage-rules.mjs: crema, SURFACE_OF_COLOR, CHIP_WORDS, assertChipWord, assertPill, PILL_MIN_RATIO, SCENE_PIECES"
  - "Sprite con ocho simbolos lg (aditivo, convive con los cs-* hasta la tarea 3) y hero reconstruido"
  - "Escenas whynow y siete minis (3 pegatinas y 4 chips) en scenes.mjs; PainCard, PillarCard y WhyNow sobre CollageScene con las mismas props"
affects: [02-03, 02-04, 02-05, 02-06, 02-07, 02-08, 02-11]

commits: 4
actuals:
  tokens: 46000
  tasks: 2
  commits: 4
---

# Phase 2 Plan 10: Collage de marca Summary (PARCIAL, tareas 1 y 2 de 4)

**Loopy oficial de las mesas 13 y 14 de punta a punta en el hero (tarea 1) y el mismo mecanismo de escenas en Por que ahora, las tres pegatinas de dolor y los cuatro chips de pilar (tarea 2): assertScene R1 a R11 en el build, renderizador unico, sprite lg y guardas con mutacion; el collage viejo solo sigue en Agenda y avatares hasta la tarea 3.**

## Estado del plan

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Loopy oficial de punta a punta en el hero (tracer) | Hecha | 37c3a0c |
| 2. Por que ahora, pegatinas y chips (PainCard, PillarCard, WhyNow) | Hecha | bc5e28f |
| 3. Agenda, avatares, hoja al dia y retiro del collage viejo | Pendiente | |
| 4. Ciclo visual (Lote C (collage de marca)), documentos y cierre | Pendiente | |

Se detuvo tras la tarea 2 por presupuesto de contexto (el contexto pasaba del 35 % fijado para seguir con la tarea 3). STATE.md, ROADMAP.md y REQUIREMENTS.md NO se tocaron: no se corrio state.advance-plan, update-progress, roadmap.update-plan-progress ni requirements.mark-complete (solo al completar el plan).

## Tarea 1: que se hizo

- Skills invocadas con la herramienta Skill: `design-taste-frontend` e `impeccable` (context, sin entrevista). Lectura de diseno: landing B2B de captacion, lenguaje collage pop de marca con las piezas reales de Loopy y el moodboard, accesibilidad por encima de la estetica, diales 7/3/4. Conflictos resueltos a favor de la marca: SVG dibujados a mano (aqui la pieza principal es arte oficial), morado de IA (es el color de marca) y contorno de 3 px del UI-SPEC (formas sin contorno, trazo de 3 px solo en garabatos).
- Sondeos: (a) `shasum -a 256` del .ai = d55c86b54ff2cfd8cb1a0de24f46bf9a858b884687015b475a6047ae1014df03, igual al de 02-09; usado desde `.../scratchpad/brand/logo.ai` (`file` dice PDF document, 32 paginas). (b) `resolveLogo`: isotipo light/yellow/purple = mesas 13/16/14 con fg purple/purple/cream; ojo = 18/21/19 con fg purple/purple/cream. (c) `parseTokens`: `--color-brand-cream` = #f4f3e0 y `--color-brand-purple` = #4228d1. (d) Las rutas de archivos se leen relativas a la raiz del repo (cwd), sin `import.meta.url`.
- Pruebas en rojo antes del codigo (por modulo inexistente): en collage-scenes.test.mjs, "(i) fuentes...", "(ii) geometria...", "(ii) loopyGeometry...", "(ii) parsePaths...", "(iii) loopyScheme...", "(iii) fidelidad...", "(iii) schemeColors...", "(iii) el sprite: .lp-a y .lp-b...", "(iv) el crema entra en BRAND_COLORS...", "(v) CHIP_WORDS...", "(v) assertChipWord y assertPill...", "(vi) assertScene pasa en el hero y lanza con cada mutacion...", "(vi) hero: seis grupos...", "(vi) SCENE_PIECES...", "(vi) los archivos del mecanismo..."; brand-assets.test.mjs entero (importa SCENE_PIECES, inexistente). En Playwright, collage-language.spec.ts y las pruebas reescritas de page-structure.spec.ts fallaban contra el hero viejo.
- Fuentes: `extract-artboards.mjs --keep-paths` (config `scripts/brand/svgo-keep-paths.config.cjs`) sobre las mesas 13, 14, 18 y 19: 2414 y 1490 bytes, 11 y 6 rutas, viewBox 138.95 250.67 543.04 332 (ojos) y 176.65 188.12 437.35 449.1 (lupa), sin rect.
- Guardas: mutacion de cada regla R1 a R11 del hero (Loopy fuera del disco, garabato del color del escenario, palabra no listada, septimo grupo, capa fuera del viewBox, garabato sobre pildora, sin sombra, garabato tocando el disco, ranura mal nombrada, sin pildoras), fidelidad de las ocho mesas (con mutacion de la 14 con aro morado), paridad de `.lp-a`/`.lp-b` con `schemeColors`. `node --test tests/guards/*.test.mjs`: 129 de 129.
- Playwright (ClickUp bloqueado, build servido en 4322): collage-language, page-structure, brand-assets, sections-problem-solution, a11y-base y cta-focus: 182 pasadas, 20 omitidas, 0 fallos. Preview detenido (`astro preview stop`).
- Revision visual rapida del hero a 1280 (captura de elemento): el Loopy oficial de dos ojos sobre disco morado con sombra dura, panel crema con reticula, pildoras seo (amarilla) y geo (morada), flecha, destello, asterisco naranja, mas y garabato. Se lee como el moodboard, no como clip art. El ciclo formal a cinco anchos es la tarea 4.

## Pesos medidos (tarea 1)

| Pieza | Bytes | Tope |
|-------|------:|-----:|
| Raiz del hero (outerHTML) | 5022 | 8192 |
| Sprite completo (15 cs-* viejos + 8 lg-* nuevos) | 11576 | 16384 (temporal) |
| Solo los 8 simbolos lg-* | 6008 | 10240 (definitivo, con el sprite limpio) |
| dist/index.html | 38495 | 61440 (objetivo final 40960 tras retirar el sprite viejo) |

Razones de contraste medidas de las dos pildoras del hero: oscuro sobre amarillo 10.22; crema sobre morado 7.63. `check-contrast`: 14/14 aprobados, 11 prohibidos.

## Archivos

Creados: `src/assets/loopy/{isotipo-13-blanco,isotipo-14-morado,ojo-18-blanco,ojo-19-morado}.svg`, `scripts/brand/svgo-keep-paths.config.cjs`, `src/components/collage/{loopy.mjs,scenes.mjs,CollageScene.astro,Pill.astro}`, `tests/guards/collage-scenes.test.mjs`, `tests/e2e/collage-language.spec.ts`.
Tarea 2, modificados: `src/components/collage/{scenes.mjs,Pill.astro}`, `src/components/sections/WhyNow.astro`, `src/components/ui/{PainCard,PillarCard}.astro`, `tests/guards/collage-scenes.test.mjs`, `tests/e2e/{collage-language,sections-problem-solution}.spec.ts`.
Modificados (tarea 1): `scripts/brand/extract-artboards.mjs` (opcion `--keep-paths`), `src/components/collage/{collage-rules.mjs,CollageSprite.astro,HeroCollage.astro}`, `src/components/sections/Hero.astro` (solo el CSS del collage), `tests/guards/brand-assets.test.mjs`, `tests/e2e/page-structure.spec.ts`.
Eliminados: ninguno (el sprite viejo, `PIECES` y `CollagePiece` siguen hasta la tarea 3).

## Decisiones de implementacion (para quien continua)

- Campo de la capa Loopy: `art` (`ojos` o `lupa`) porque `kind` ya es el tipo de capa. Escena: `name`, `family`, `kind` (full, mini o avatar), `w`, `h`, `ground`, `stage`, `groups?`, `layers`. Capas: `disc`, `rect`, `slot`, `loopy`, `doodle`, `dots`, `pill`, con `shadow: [dx, dy]`, `on: 'ground' | 'stage'` y `group` solo en el hero.
- `assertScene(nombre | objeto)` acepta el objeto entero para las mutaciones. Orden de reglas: R1 a R9, luego R11 y despues R10 (asi la mutacion de R11 no la tapa R10). Mensajes: `Escena "<nombre>", capa "<id>": [Rn] ...`.
- `CHIP_WORDS` es una lista de objetos `{ word, lang, source }` (no de cadenas); el spec usa `.word`.
- `CollageScene.astro` acepta `scene`, `class?`, `bare?` y `variant?` (esta ultima para avatares, tarea 3, escribe `data-variant` en la raiz svg). Con `bare` la raiz es el propio svg (`Fragment` como envoltura). Cada escena sin grupos se dibuja en un `<g>` sin atributos. Estilos globales (`is:global`) con prefijos `cw-` (escena y pildora) y `lg-`/`lp-` (sprite) para no cargar `data-astro-cid` en cada elemento.
- Pildoras: `span[data-pill][data-trait=pill][aria-hidden]` con `lang="en"` si la palabra es inglesa, tamano en `cqw` y posicion en % de la escena; `card` usa `width: min-content` para partir "team work" en dos lineas sin `<br>`.
- `sceneTraits(scene)` y `photoSlots()` estan exportados de scenes.mjs; `PHOTO_SLOTS` = `[{ scene: 'hero', name: 'hero', x: 344, y: 22, w: 192, h: 250, aspect: 0.768 }]` por ahora (falta whynow en la tarea 2: 104 x 128 en x 204, y 14).
- En el spec de collage-language el ayudante `open(page, width)` y el mapa `SCENES` (selector por escena) estan listos para extenderse a whynow, stickers y chips (tarea 2) y a la hoja (tarea 3).
- Prueba de sprite de brand-assets.test.mjs ahora lee `dist/index.html` (el viewBox de los Loopy no es literal en el fuente) y separa cs-* (PIECES) de lg-* (SCENE_PIECES); tope temporal de 16384 (vuelve a 10240 en la tarea 3).

## Tarea 2: que se hizo

- Alcance: escenas `whynow` (320 x 320, fondo yellow, escenario purple, lupa oficial esquema B, ranura `whynow`, dos pildoras seo y geo, flecha, destello, mas y puntos) y siete minis de 96 x 80 con la plantilla del plan, generadas por una funcion `mini()` en `scenes.mjs` (datos, no logica de dibujo). `PainCard.astro` monta `<CollageScene scene={`sticker-${sticker}`} class="pain-sticker" />` y `PillarCard.astro` `<CollageScene scene={`chip-${chip}`} class="pillar-chip" />`, ambas a 6rem y `flex: none`, con las mismas props, el mismo texto y el mismo orden. `WhyNow.astro` monta `<CollageScene slot="aside" scene="whynow" class="whynow-art" />` de `min(100%, 14rem)` (224 px) y `min(100%, 20rem)` (320 px) desde 64em, con `margin-top: 2rem`. Los estilos de clase de los componentes hijos usan `:global` porque la raiz del hijo no lleva el `data-astro-cid` del padre.
- Skills: se reutilizo la lectura de diseno de la tarea 1 (misma linea: collage pop de marca, alternancia de escenarios morado y amarillo entre tarjetas vecinas); no se corrio el ciclo completo (es la tarea 4, como pide el encargo de esta corrida). Revision visual rapida por captura de elemento a 3x de #por-que-ahora y #solucion: se leen como el moodboard (disco plano con sombra dura, Loopy oficial, pildora con palabra, destello); a 96 x 80 la palabra de la pildora queda pequena (unos 10.5 a 12 px, es texto decorativo aria-hidden). La revision formal a cinco anchos es de la tarea 4.
- Rojo primero: en collage-scenes.test.mjs el bloque nuevo (vii) fallo por escena inexistente (`falta la escena whynow`) y por consumidores que aun usaban `CollagePiece`; en Playwright, sections-problem-solution y collage-language fallaron contra el DOM viejo (selectores `[data-collage="sticker"]`, `[data-collage="chip"]`, `whynow`).
- Guardas (bloque vii, 5 pruebas nuevas, `node --test tests/guards/*.test.mjs`: 134 de 134): assertScene pasa en las ocho escenas; palabra por mini (ads, seo, spy, spy, geo, team work, seo) dentro de `CHIP_WORDS`; sticker-clic y chip-clic sin Loopy y las otras cinco con Loopy; `PHOTO_SLOTS` con exactamente hero y whynow (whynow 204, 14, 104 x 128); escenarios de los chips alternando (purple, yellow, purple, yellow); mutaciones sobre las ocho escenas (palabra no listada = R7, garabato fuera del viewBox = R6, Loopy fuera del disco = R3 en las seis con Loopy, ranura agregada a una mini = R9); sin hex ni `set:html` en los tres consumidores y sin `CollagePiece`.
- Playwright (ClickUp bloqueado, build servido en 4322, preview detenido con `astro preview stop`): sections-problem-solution, collage-language, page-structure, brand-assets, a11y-base y cta-focus: 200 pasadas, 20 omitidas, 0 fallos. collage-language ahora recorre las nueve escenas de `/` (existencia, rasgos por estructura, paleta, pildoras, caja a cinco anchos, arbol de accesibilidad, sin JS, cero animaciones, espaciado de texto a 320 y 1280), suma dos ranuras exactas, 224 a 1023 px y 320 a 1024 px, y pesos.
- `node scripts/check-contrast.mjs`: sale 0.

## Pesos medidos (tarea 2)

| Pieza | Bytes (outerHTML) | Tope |
|-------|------------------:|-----:|
| whynow | 1839 | 3072 |
| sticker-clic / sticker-lupa / sticker-ojos | 935 / 912 / 923 | 1536 |
| chip-lupa / chip-ojos / chip-loop / chip-clic | 912 / 903 / 941 / 926 | 1536 |
| dist/index.html | 44069 | 61440 (objetivo final de 40960) |

`dist/index.html` supera el objetivo propio de 40960 en 3109 bytes. Todavia falta retirar el sprite viejo (15 simbolos cs-*, unos 5.5 KB) y las clases de contorno en la tarea 3, con lo que debe quedar bajo 40960; si aun asi no bajara, se recortaria la retícula de las minis o se agruparian las pildoras repetidas.

## Decisiones de implementacion de la tarea 2 (para quien continua)

- `scenes.mjs` exporta las mismas cosas; las minis se arman con `mini(name, family, opts)` (disco cx 40, cy 42, r 30, sombra 4 4; Loopy o flecha en el escenario; destello de 18 en x 68, y 6 sobre el fondo; pildora anclada a la derecha en x 88). La flecha de sticker-clic y chip-clic va en x 22, y 28 (el plan decia x 24, y 30): con x 24 solapaba a la pildora 6.9 % de su caja segun R5; con x 22, y 28 solapa 3.5 %. Se movio la coordenada, la regla no se toco.
- `whynow-pill-geo` va en x 308 y no en 312 (con la sombra de 0.2 em salia del viewBox por menos de 4 unidades, R6).
- `.cw-pill` declara `overflow-wrap: normal` y `word-break: normal`: dentro de `.pillar-card` (que hereda `overflow-wrap: anywhere`) la pildora de tarjeta `team work` con `width: min-content` colapsaba a una letra de ancho (24 x 93 px) y salia de la raiz; ahora mide 40 x 30 px como estima `pillBox`.
- Los specs de 02-03 mantienen sus selectores salvo donde el plan pedia cambiarlos; `focusable` de pegatinas y chips ahora cuenta focalizables dentro de la raiz (cero) porque la raiz ya no es un svg. Para las distancias chip a h3 se usa `:scope > [data-collage="chip"]`.
- El ayudante `paletteOf` de collage-language.spec.ts resuelve el `--cf-a` de cada garabato por una sonda `<i>` (el trazo de los garabatos vive dentro del `<use>` y no se ve en el estilo calculado).

## Trabajo restante exacto (tareas 3 y 4 del plan)

1. Tarea 3: escenas agenda y avatar-*; `bare` para avatares; `AgendaCollage`, `Avatar` y `CollagePiece` (firma nueva) sobre el mecanismo; retirar `PIECES`, los quince simbolos cs-* y las clases de contorno; hoja `/marca/hoja/` con bloques piezas, pildoras, composiciones y avatares (identidad, paleta y favicon intactos) y bloque 'captura de composiciones'; guardas y specs de la hoja; sprite bajo 10240 bytes; exclusion de la hoja en produccion.
2. Tarea 4: ciclo visual con `PHASE2_BATCH=C-collage` (capturas, siete recortes lado a lado con Pillow), critica, correcciones, "Lote C (collage de marca)" rondas 0 y 1 en 02-VISUAL-LOG.md, fe de erratas en 02-UI-SPEC.md y DESIGN.md, suite completa, `dist/index.html` de 40960 bytes o menos (hoy 44069, ver arriba) y SUMMARY completo. Solo entonces: state.advance-plan, state.update-progress, roadmap.update-plan-progress 02 y requirements.mark-complete DSGN-01 DSGN-03 DSGN-04 (revisar despues que 02-03 siga sin marcar y que `Plan:` de STATE.md no salte).

## Deviations from Plan

**[Rule 1 - Bug] Pildora de tarjeta colapsada por `overflow-wrap: anywhere` heredado** (tarea 2). Encontrada por la prueba de caja de collage-language: la pildora `team work` de chip-loop salia de su raiz. Correccion en `Pill.astro` (`overflow-wrap: normal`, `word-break: normal`), archivo del mecanismo del propio plan; commit bc5e28f.

**[Coordenadas] Dos ajustes de puntos de partida**, sin aflojar reglas: flecha de sticker-clic y chip-clic en x 22, y 28 (R5) y pildora geo de whynow en x 308 (R6).

Tarea 1: None - la tarea 1 se ejecuto como esta escrita. Observaciones menores: la extraccion de las fuentes se hizo despues de escribir las guardas (el rojo de las guardas fue por modulo inexistente, como pide el plan); el orden de R11 antes de R10 en `assertScene` es una eleccion de implementacion.

## Known Stubs

Ninguno de codigo. Las ranuras de foto del hero (`data-photo-slot="hero"`, panel crema) y de Por que ahora (`data-photo-slot="whynow"`, panel blanco) son paneles con retícula, intencionalmente sin foto hasta el plan 02-11.

## Threat Flags

Ninguno: no hay endpoints, rutas de autenticacion ni acceso a archivos nuevos en tiempo de ejecucion (los SVG de `src/assets/loopy` se leen al construir y `parsePaths` valida elementos, atributos y caracteres de `d`).

## Self-Check: PASSED

- FOUND: src/assets/loopy/*.svg (4), src/components/collage/{loopy.mjs,scenes.mjs,CollageScene.astro,Pill.astro}, tests/guards/collage-scenes.test.mjs, tests/e2e/collage-language.spec.ts
- FOUND commits 37c3a0c y bc5e28f (tareas 1 y 2); 4a60a2d (resumen de la tarea 1)
