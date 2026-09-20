---
phase: 02-secciones-marca-y-copy
plan: 11
subsystem: ui
tags: [collage, photos, halftone, licenses, brand, moodboard, astro-assets, guards, playwright]
status: partial
plan_head_before: a67b4dcb6f9016cea1c0ddc596818b0ba6e1a886
tasks_done: [1, 2, 3]
tasks_remaining: [4]
---

# Phase 2 Plan 11: Recortes fotograficos en media tinta (PARCIAL, tareas 1 a 3 de 4)

## Estado del plan

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Una foto en media tinta de punta a punta en el hero (tracer) | Hecha | f11420a |
| 2. hero-b, whynow-a, whynow-b y Por que ahora con foto | Hecha | ababf3c |
| 3. Hoja de eleccion `[data-sheet="fotos"]` y puerta de produccion | Hecha | f9ab7f6 |
| 4. Ciclo visual "Lote P (fotos)", documentos y cierre | Pendiente | |

No se corrieron `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete` (solo al cerrar las 4 tareas).

## Tarea 1: que se hizo

- **Foto hero-a:** Unsplash, "a close-up of a person's eye through a magnifying glass", autor Mohammed Idris Djoudi (https://unsplash.com/@idris_djoudi), pagina https://unsplash.com/photos/a-close-up-of-a-persons-eye-through-a-magnifying-glass-Yu7UxPvBVOM, descargada el 2026-09-19 (1600x2408, sha256 `59b39ecb00f45caff948de8701c9ce90ace89d607712d6f8c3f3f41fb3255925`), original en `photo-sources/hero-a.jpg` (ignorado, no versionado). Sujeto: ojo humano en primer plano detras del aro de una lupa, recortado a ojo y ceja; es la unica excepcion permitida a "sin persona identificable" y queda marcada en la nota para Ari. Aprobacion de Ari: **pendiente**. Solo se reviso 1 candidata (cumplio a la primera; el plan pedia revisar al menos 12 antes de rendirse, no aplica porque no hubo rendicion).
- **Licencia:** ver "Acceso web" abajo. Cita en `src/assets/photos/LICENSES.md` (Unsplash License, leida el 2026-09-19); coincide con la referencia del plan, sin cambios.
- **Tratamiento** (`scripts/photos/halftone.mjs`, `scripts/photos/treat.mjs`): recorte left 0.12, top 0.2326, ancho 0.68, alto 0.588 (proporcion 0.768), `out` 384x500, celda 6, angulo 45, contrast 1.0, brightness 165 (la foto es muy oscura: con brightness bajo la cobertura de tinta pasaba de 0.64; a 165 queda en 0.495). PNG tratado 10265 bytes, paleta de 2 colores, sin metadatos, tinta `--color-brand-dark`. Vista previa revisada con la herramienta de imagenes: el ojo, la ceja y el aro de la lupa se leen con media tinta clara, como los recortes del moodboard.
- **Escena y componente:** `photos.mjs` (manifiesto con `hero-a`), `photoFrame()` y regla R12 en `scenes.mjs` (sin cambiar ninguna coordenada; el hero actual ya cumple R12), `CollagePhoto.astro` montado por `CollageScene.astro` entre la capa svg y las pildoras, con `data-piece-of="panel"` y los mismos `--i`, `--r` y `--r-from` del panel. `check-photos.mjs` agregado a `prebuild` (unica linea de `package.json` que cambia).
- **Formato:** `Image` de astro:assets con `format="png"` y `quality={80}`; servido `hero-a.CYDZQLKo_n00dj.png` de 13 KB (13k segun `ls`, tope 25600). Con esta foto real el PNG pesa mas que la estimacion del plan (7.9 a 10 KB); no se midieron webp ni avif con las fotos reales (queda para la tarea 2, con las cuatro).

## Tarea 2: que se hizo

- **Tres fotos de Unsplash** (licencia Unsplash License, leida el 2026-09-19, misma cita de LICENSES.md; descarga del CDN `images.unsplash.com` con curl, HTTP 200; autor y URL de imagen por WebFetch de la pagina de cada foto; originales en `photo-sources/`, ignorado):

| id | autor | pagina | descargada | dimensiones | sha256 | aprobacion |
|----|-------|--------|------------|-------------|--------|------------|
| `hero-b` | ThisisEngineering | https://unsplash.com/photos/a-person-holding-a-magnifying-glass-with-a-finger-on-it-ZJUG912sIW4 | 2026-09-19 | 1600x1067 | ver LICENSES.md | pendiente |
| `whynow-a` | Nubelson Fernandes | https://unsplash.com/photos/a-person-holding-a-cell-phone-in-their-hand-f4swqEOv2B4 | 2026-09-19 | 1600x2845 | ver LICENSES.md | pendiente |
| `whynow-b` | Vitaly Gariev | https://unsplash.com/photos/hands-typing-on-a-laptop-keyboard-at-a-desk-lMScFOdgRNg | 2026-09-19 | 1600x900 | ver LICENSES.md | pendiente |

  Las cuatro filas (hero-a incluida) estan completas en `src/assets/photos/LICENSES.md`, todas descargadas el 2026-09-19.
- **Sujetos:** hero-b es una mano con una lupa grande sobre una mesa de trabajo (sujeto distinto al ojo de hero-a); whynow-a es una mano tocando un telefono, recortada bajo el reloj de la pantalla para no dejar texto legible; whynow-b son manos tecleando en una laptop de perfil (sin pantalla en el recorte).
- **Candidatas revisadas y rechazadas (a ojo):** 9 en total antes de elegir. Anteriores a la eleccion: gafas transparentes sostenidas por una mano (no es lupa), una mano con un balon de baloncesto (la busqueda la etiqueto como lupa), una laptop con pantalla de codigo SAP legible, un telefono con el logo de Threads, una ilustracion 3D de lupa (no es foto), un paisaje con una lupa diminuta, una laptop con la pantalla de Pinterest y una laptop de Shoper con la marca "MacBook Pro" y texto en pantalla imposibles de excluir con un recorte de al menos 416 px. Una busqueda de premium_photo (Unsplash+) se descarto por otra licencia. No se llego al limite de 12 por sujeto del plan porque cada sujeto tuvo una candidata que cumplio, pero **el criterio 6 (fondo claro y liso) no lo cumple del todo whynow-b** (fondo desenfocado, no liso) ni hero-b (mesa verde y madera): se avisa a Ari en la nota de la fila y se deja como candidata, no como elegida.
- **Tratamiento** (`treat.mjs --preview`, vistas revisadas con la herramienta de imagenes):

| id | recorte (left, top, ancho, alto) | out | celda | brillo | PNG | cobertura |
|----|----------------------------------|-----|------:|-------:|----:|----------:|
| hero-b | 0.02, 0, 0.512, 1 | 384x500 | 6 | 118 | 8092 B | 0.284 |
| whynow-a | 0.194, 0.4675, 0.5625, 0.3894 | 208x256 | 4 | 92 | 2584 B | 0.247 |
| whynow-b | 0.47, 0, 0.457, 1 | 208x256 | 4 | 105 | 2887 B | 0.281 |

  Primer intento con brillo 128 dejaba la mano de whynow-a lavada y hero-b abstracto; se bajo el brillo y se movio el recorte a la mano.
- **Manifiesto:** cuatro entradas; `chosen` verdadero en `hero-a` y `whynow-a`. El marco de Por que ahora aparecio sin tocar `CollageScene.astro` ni `WhyNow.astro` (el mecanismo de la tarea 1 sirve tal cual).
- **Guardas:** bloque 'conjunto de fotos' en `photos.test.mjs` (`photoSetErrors`, elegida por ranura, dos por ranura con `abierta`, una aprobada con `cerrada`) y su prueba de mutaciones (dos elegidas, ranura sin candidatas, id sin fila, cerrada con dos por ranura y sin aprobacion); la guarda de dist ya exigia una img por foto elegida.
- **Pruebas cambiadas:** `collage-language.spec.ts` (m) pesos, whynow 3712 y hero 8832 en el titulo; `brand-assets.spec.ts` (a) whynow 3712 y suma 32000; `collage-photos.spec.ts` suma 'dos fotos: hero eager y whynow lazy...' y, por cada ancho, 'Por que ahora conserva su caja, no cruza el h2 ni la lista y no desborda'. `sections-problem-solution.spec.ts` **no cambio**: no afirma cero img en `.whynow-art` (solo cuenta una ranura).

### Rojo antes del codigo (tarea 2)

Desviacion: el orden fue tratar las fotos y despues escribir las guardas del conjunto y los specs, no al reves. Lo unico observado en rojo fue la guarda de dist ('una img por foto elegida', 1 de 2) con el dist anterior tras elegir `whynow-a`; se puso en verde al reconstruir. Las pruebas de mutacion del conjunto nacieron en verde porque validan la funcion nueva contra manifiestos fabricados.

### Formato: png contra webp y avif (las cuatro fotos, sharp con calidad 80)

| Foto | png con paleta | webp | avif |
|------|---------------:|-----:|-----:|
| hero-a | 13006 | 18102 | 26165 |
| hero-b | 10652 | 15176 | 19389 |
| whynow-a | 3306 | 4116 | 6124 |
| whynow-b | 3384 | 5208 | 7431 |

png gana en las cuatro: se conserva `Image` con `format="png"`, sin `Picture`. (Medido con sharp directamente sobre los PNG tratados con la misma calidad, no con la llamada de Astro; los archivos servidos por Astro coinciden en peso: hero-a 13006, whynow-a 3306.)

### Mediciones (tarea 2, dos fotos elegidas, ClickUp bloqueado)

| Medida | Valor | Tope |
|--------|------:|-----:|
| PNG tratado hero-b / whynow-a / whynow-b | 8092 / 2584 / 2887 | 30720 |
| Servido hero-a / whynow-a | 13006 / 3306 | 25600 |
| Suma de imagenes de `/` | 16312 | 40960 |
| `.hero-collage` outerHTML | 5490 | 8832 |
| Raiz whynow outerHTML | 2257 | 3712 |
| `dist/index.html` | 39495 | 42240 |
| LCP a 390x844 / 1280x800 | H1 a 112 ms / 36 ms | texto |
| CLS tras recorrer (390 y 1280) | 0 | 0 |

Nota: en el build tambien salen a `dist/_astro` las candidatas no elegidas (`hero-b`, `whynow-b`) como originales (8.1 y 2.9 KB), porque el `import.meta.glob` las incluye; no se referencian desde el HTML y desaparecen al cerrar la eleccion (la puerta de produccion ya bloquea candidatas sin elegir).

Guardas `node --test tests/guards/*.test.mjs` 159 de 159; `check-contrast` sale 0. Playwright con ClickUp bloqueado (preview en 4322, detenido): `collage-photos`, `collage-language`, `brand-assets`, `sections-problem-solution`, `page-structure`, `a11y-base` y `cta-focus` 254 pasadas, 55 omitidas (capturas), 0 fallos. Conteos de dist: 2 `<img>`, 2 `data-photo-frame`, 2 `data-photo-slot`, 6 `data-piece`. Sin hex en `src/components|pages|layouts`, sin `set:html`, sin `outline: none`, sin `fetchpriority|priority` en collage; `git ls-files | grep ^photo-sources` vacio.

Archivos de la tarea 2: `src/assets/photos/LICENSES.md`, `src/assets/photos/treated/{hero-b,whynow-a,whynow-b}.png`, `src/components/collage/photos.mjs`, `tests/guards/photos.test.mjs`, `tests/e2e/{collage-photos,collage-language,brand-assets}.spec.ts`.

## Tarea 3: que se hizo

- **Prop `photo` en `CollageScene.astro`:** monta la candidata por id en lugar de la elegida; `assertPhotoForSlot` falla en el build con mensaje en español si el id no existe o es de otra ranura, y una escena sin ranura de foto que reciba `photo` tambien falla.
- **Hoja `/marca/hoja/`:** dos secciones `section[data-sheet="fotos"]` (hero sobre banda `light`, whynow sobre `yellow`), una celda `data-demo="foto-<id>"` por foto del manifiesto con la escena completa y un rotulo `code` `<id> / <estado>` (`pendiente` o `aprobada`, leido de LICENSES.md con `parseLicenses`). Celda de hero `min(100%, 30rem)`, de whynow `min(100%, 20rem)`, una columna bajo 40em. Sin frases en los rotulos. No se genera con `PUBLIC_ENV=production` (comprobado: `dist/marca` no existe).
- **Puerta de produccion (`check-photos.mjs`):** ya existia desde la tarea 1; se completo: criterio de entorno de `check-copy.mjs` (`loadEnv` de vite mas proceso, solo el valor exacto `production` bloquea), lineas `FAIL` o `WARN`, y en un bloqueo imprime los pasos de "Como cerrar la eleccion" leidos de LICENSES.md (`closingSteps`). `evaluatePhotoGate` (firma real: `{ rows, photos, files, env }`, distinta de la del plan) ahora hace que una elegida sin fila bloquee siempre. `package.json` no cambio (ya corria la puerta en `prebuild`, tarea 1).
- **LICENSES.md:** pasos de cierre precisados (arreglo `PHOTOS`, ruta del archivo, un solo commit); la nota de fotos reales del equipo ya estaba.
- **Pruebas:** `photos.test.mjs` +3 (mutaciones de la puerta por regla; subproceso de `check-photos.mjs`: sale 0 sin produccion, 0 con `Production`, 1 con `production` mientras haya pendiente o candidata sobrante, y el mensaje trae `FAIL`, "Como cerrar la eleccion", `photos.mjs` y `LICENSES.md`; `prebuild` con `check-photos` y prop `photo` con `assertPhotoForSlot`); guardas 162 de 162. `collage-photos.spec.ts` +6 ('hoja de fotos': por cada uno de los cinco anchos una celda por foto con su marco, una img de alt vacio, rotulo `code` y sin scroll horizontal; ancho maximo de las celdas). `brand-assets.spec.ts`: la prueba (f) suma `fotos` y `ROOTS_ON_SHEET` suma las cuatro escenas de candidatas; `collage-language.spec.ts`: el conteo de pildoras de la hoja suma 2 por candidata (era 13, ahora 21).

### Mensaje de la puerta con el estado actual (`PUBLIC_ENV=production node scripts/check-photos.mjs`, sale 1)

```
FAIL check-photos: La foto elegida "hero-a" tiene la aprobación de Ari pendiente.
FAIL check-photos: La foto elegida "whynow-a" tiene la aprobación de Ari pendiente.
FAIL check-photos: Existe el raster de la candidata "hero-b" y no está elegida (Astro lo emitiría en dist).
FAIL check-photos: Existe el raster de la candidata "whynow-b" y no está elegida (Astro lo emitiría en dist).
Cómo cerrar la elección (src/assets/photos/LICENSES.md): pasos 1 a 5 de LICENSES.md
```

Sin `PUBLIC_ENV=production` sale 0 con cuatro `WARN`. `PUBLIC_ENV=production npm run build` se detiene antes en `check-copy` por textos pendientes; la puerta de fotos se ejecuta despues en la cadena de `prebuild` y con textos cerrados tambien bloqueara.

### Mediciones (tarea 3, ClickUp bloqueado)

`dist/index.html` 39495 bytes (tope 42240), 2 `<img `, 6 `data-piece="`; `dist/marca/hoja/index.html` con 4 `data-demo="foto-`. Guardas 162 de 162, contraste sale 0. Playwright chromium con ClickUp bloqueado (preview 4322, detenido): `collage-photos`, `brand-assets`, `collage-language`, `page-structure`, `sections-problem-solution`, `a11y-base` y `cta-focus` 259 pasadas y 55 omitidas (capturas) tras corregir dos conteos de la hoja (arriba). Sin hex en `src/components|pages|layouts`, sin `set:html`, sin `outline: none`, sin `fetchpriority|priority` en collage; sin cambios en `src/content`, `PENDING-COPY.md`, `src/layouts`, `src/styles`, `src/components/sections`, `src/components/ui` ni `package-lock.json`.

### Desviaciones de la tarea 3

- **Rojo:** los tres casos nuevos de guardas nacieron en rojo antes del codigo (mutaciones de la puerta, subproceso, prop `photo`). Los e2e de la hoja se escribieron despues de la hoja (no se corrieron en rojo). Los dos fallos que aparecieron al correrlos por primera vez fueron conteos de pruebas anteriores que asumian la hoja sin candidatas (`ROOTS_ON_SHEET` y las pildoras).
- La firma de `evaluatePhotoGate` sigue siendo la de la tarea 1 (`rows, photos, files, env`), no la del plan (`chosen, treatedIds, production`); mismo comportamiento.
- Skills `impeccable` y `design-taste-frontend` **no** invocadas en esta tarea (encargo del orquestador: solo en la tarea 4). La jerarquia de la hoja reutiliza el marcado de bandas de composiciones.

## Sondeos

- (a) `git status` de src, tests, scripts y public limpio y `node --test tests/guards/*.test.mjs` 139 de 139 antes de empezar.
- (b) `PHOTO_SLOTS` y capas slot tal como los declara 02-10: hero (344, 22, 192x250, rx 22, fill cream, shadow 10,10) y whynow (204, 14, 104x128, rx 16, fill white, shadow 8,8). Sin desviaciones de nombres.
- (c) `sharp` 0.35.4; `sharp.format.png.output.buffer` verdadero.
- (d) **Acceso web:** unsplash.com/license respondio 307 y despues 401 con un desafio anti bots (Anubis) a curl; pexels.com/license 403 y pixabay.com/service/license-summary 403 a curl. La licencia de Unsplash se leyo con la herramienta de lectura web (WebFetch), que entrega fragmentos entrecomillados y no la pagina completa; la de Pexels tambien se leyo con WebFetch pero **no se uso ni se registro** porque no se eligio ninguna foto de Pexels. La pagina de la foto de Unsplash se leyo con WebFetch (autor, fecha, URL de imagen); la descarga salio de `images.unsplash.com` (CDN) con curl y un User-Agent normal, HTTP 200, sin claves ni sesion.
- (e) Linea base antes de tocar codigo: `.hero-collage` outerHTML 5028 bytes (02-10) y `dist/index.html` 38627 bytes.

## Pruebas en rojo antes del codigo

Por modulo inexistente: `tests/guards/halftone.test.mjs` (todo) y `tests/guards/photos.test.mjs` (todo, importa `photo-licenses.mjs`). Por asercion o simbolo inexistente: en `collage-scenes.test.mjs` "marco de foto: photoFrame..." y "R12: un garabato o una reticula...", en `brand-assets.test.mjs` "plan 02-11: CollagePhoto.astro y photos.mjs estan en OWNED...". Las pruebas de Playwright nuevas (`collage-photos.spec.ts`) y las modificadas (page-structure, collage-language, brand-assets) no se corrieron en rojo contra el hero sin foto: se escribieron y se confirmo directamente en verde (desviacion, ver abajo).

## Mediciones (tarea 1)

| Medida | Valor | Tope / referencia |
|--------|------:|------------------|
| PNG tratado hero-a en el repo | 10265 bytes | 30720 |
| Archivo servido en dist/_astro | 13 KB (`ls`) | 25600 |
| `.hero-collage` outerHTML | 5490 bytes | 8832 (linea base 5028, +462) |
| `dist/index.html` | 39083 bytes | 42240 (linea base 38627, +456) |
| LCP a 390x844 | H1 a 36 ms (no es una img ni esta en `[data-collage]`) | texto |
| LCP a 1280x800 | H1 a 32 ms | texto |
| CLS tras recorrer la pagina (390 y 1280) | 0 | 0 |
| Cobertura de tinta | 0.495 | 0.12 a 0.55 |

Guardas: `node --test tests/guards/*.test.mjs` 157 de 157; `node scripts/check-contrast.mjs` sale 0. Playwright con ClickUp bloqueado (`E2E_BLOCK_CLICKUP=1`, preview en 4322, detenido con `astro preview stop`): `collage-photos` 14 pasadas; `collage-language`, `page-structure`, `brand-assets`, `sections-problem-solution`, `a11y-base` y `cta-focus` 232 pasadas, 55 omitidas (capturas), 2 fallos iniciales (rasgo `photo` nuevo en el hero) corregidos en `collage-language.spec.ts`; segunda corrida de ese archivo 66 pasadas. Sin hex en `src/components`, `src/pages` ni `src/layouts`; sin `set:html`; sin `73187f`; sin `fetchpriority` ni `priority` en `src/components/collage`; ningun original versionado (`git ls-files | grep ^photo-sources` vacio).

## Archivos de la tarea 1

Creados: `scripts/photos/{halftone,treat}.mjs`, `scripts/lib/photo-licenses.mjs`, `scripts/check-photos.mjs`, `src/assets/photos/LICENSES.md`, `src/assets/photos/treated/hero-a.png`, `src/components/collage/{photos.mjs,CollagePhoto.astro}`, `tests/guards/{halftone,photos}.test.mjs`, `tests/e2e/collage-photos.spec.ts`. Modificados: `.gitignore`, `package.json` (solo `prebuild`), `src/components/collage/{CollageScene.astro,scenes.mjs}`, `tests/guards/{collage-scenes,brand-assets}.test.mjs`, `tests/e2e/{collage-language,page-structure,brand-assets}.spec.ts`.

## Desviaciones

1. **Skills no invocadas en la tarea 1.** El plan (paso 1) pide invocar `design-taste-frontend` e `impeccable` con la herramienta Skill en la primera tarea de UI; el encargo del orquestador dijo usarlas solo en el ciclo visual (tarea 4) para ahorrar contexto. Se siguio el encargo del orquestador. **Deben invocarse en la tarea 4** (y en la 2 si se toca diseno).
2. **R12 usa el formato `[R12]` de 02-10** (`Escena "hero", capa "x": [R12] el marco opaco...`), no `R12 el marco...` como en el plan, para conservar el formato de todos los errores de `assertScene`. La guarda busca `R12`.
3. **Rojo de Playwright no observado** (ver arriba).
4. **Cita de la licencia via WebFetch, no via curl:** la cita en LICENSES.md son los fragmentos entrecomillados que devolvio la herramienta de lectura web, no el texto completo de la pagina (curl esta bloqueado por Anubis). Esta dicho en la propia seccion de LICENSES.md. Si se quiere la cita completa, leer la pagina en un navegador.
5. **brightness/contrast** de partida distintos a los del plan por la foto oscura; documentado arriba.
6. `params.contrast` 1.0 y `brightness` 165 son los del manifiesto; `treat.mjs` reproduce el PNG exacto desde el original con su sha256.

## Para quien continua (tarea 4)

- Falta toda la tarea 4 del plan: bloques 'informe de fotos' (medicion) y 'captura de fotos' en `collage-photos.spec.ts` (solo con `PHASE2_BATCH`), captura en lote P-fotos a cinco anchos, seis recortes lado a lado con Pillow contra `brand-inventory/moodboard.png`, invocar `design-taste-frontend` e `impeccable` con la herramienta Skill (aun no invocadas en todo el plan), correcciones de fotos en un lote, "Lote P (fotos), ronda 0 y 1" al final de `02-VISUAL-LOG.md`, fe de erratas de las fotos en `02-UI-SPEC.md`, frase de media tinta en `DESIGN.md`, suite completa con barridos y SUMMARY completo. La hoja de fotos ya existe y da las capturas `[data-demo="foto-<id>"]` para comparar candidatas.
- Mecanismo: `PHOTOS` en `photos.mjs`; `treat.mjs --id <id> [--preview dir] [--dry]`; `LICENSES.md` con Estado, Como cerrar la eleccion, Reglas de seleccion, Licencias verificadas y Registro (4 filas). Las guardas de `photos.test.mjs` cubren el conjunto, la puerta y el subproceso de `check-photos.mjs`.
- Fuentes usadas para las fotos: WebSearch, WebFetch de la pagina de la foto y curl al CDN de Unsplash (`?fm=jpg&q=85&w=1600&auto=format&fit=max`).
- Sujetos ya usados: ojo detras de una lupa en el hero (hero-a). (ya hechas en la tarea 2: hero-b mano con lupa, whynow-a mano con telefono, whynow-b manos en laptop).
- Tope de peso: la suma de imagenes de `/` debe quedar en 40960 (hoy 13 KB con una foto, con la de whynow de 208x256 se espera menos de 6 KB).
- Pruebas: la tarea 3 ya cambio la que enumera los `[data-sheet]`, `ROOTS_ON_SHEET` y el conteo de pildoras de la hoja. Queda solo la tarea 4.
- Servidores: ninguno levantado por esta corrida (`astro preview stop` ejecutado); el `astro dev` del usuario (pid 86100) no se toco.
- Al cerrar el plan: correr las 4 operaciones de estado UNA vez y revisar ROADMAP.md (02-03 debe seguir `[ ]`) y STATE.md (`Plan:` no debe saltar).

## Preguntas abiertas para Juan y Ari

1. Ari: aprobar hero-a (ojo con lupa de Mohammed Idris Djoudi, Unsplash). Sin aprobacion la puerta de produccion (`PUBLIC_ENV=production`) bloquea el build.
2. Juan: resuelto en la tarea 2, se sirve png (gana a webp y avif en las cuatro fotos).
3. Ari y Juan: elegir entre hero-a y hero-b, y entre whynow-a y whynow-b, en `/marca/hoja/` (ya existe, `npm run dev` o preview) y cerrar con los pasos de LICENSES.md; advertir que las cuatro fotos muestran manos u ojo de personas reales sin permiso de modelo registrado por la fuente.
