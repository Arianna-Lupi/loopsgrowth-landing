---
phase: 02-secciones-marca-y-copy
plan: 11
subsystem: ui
tags: [collage, photos, halftone, licenses, brand, moodboard, astro-assets, guards, playwright]
status: partial
plan_head_before: a67b4dcb6f9016cea1c0ddc596818b0ba6e1a886
tasks_done: [1]
tasks_remaining: [2, 3, 4]
---

# Phase 2 Plan 11: Recortes fotograficos en media tinta (PARCIAL, tarea 1 de 4)

## Estado del plan

| Tarea | Estado | Commit |
|-------|--------|--------|
| 1. Una foto en media tinta de punta a punta en el hero (tracer) | Hecha | f11420a |
| 2. hero-b, whynow-a, whynow-b y Por que ahora con foto | Pendiente | |
| 3. Hoja de eleccion `[data-sheet="fotos"]` y puerta de produccion | Pendiente (la puerta `check-photos.mjs` ya existe y corre en prebuild, ver abajo) | |
| 4. Ciclo visual "Lote P (fotos)", documentos y cierre | Pendiente | |

No se corrieron `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress` ni `requirements.mark-complete` (solo al cerrar las 4 tareas).

## Tarea 1: que se hizo

- **Foto hero-a:** Unsplash, "a close-up of a person's eye through a magnifying glass", autor Mohammed Idris Djoudi (https://unsplash.com/@idris_djoudi), pagina https://unsplash.com/photos/a-close-up-of-a-persons-eye-through-a-magnifying-glass-Yu7UxPvBVOM, descargada el 2026-09-19 (1600x2408, sha256 `59b39ecb00f45caff948de8701c9ce90ace89d607712d6f8c3f3f41fb3255925`), original en `photo-sources/hero-a.jpg` (ignorado, no versionado). Sujeto: ojo humano en primer plano detras del aro de una lupa, recortado a ojo y ceja; es la unica excepcion permitida a "sin persona identificable" y queda marcada en la nota para Ari. Aprobacion de Ari: **pendiente**. Solo se reviso 1 candidata (cumplio a la primera; el plan pedia revisar al menos 12 antes de rendirse, no aplica porque no hubo rendicion).
- **Licencia:** ver "Acceso web" abajo. Cita en `src/assets/photos/LICENSES.md` (Unsplash License, leida el 2026-09-19); coincide con la referencia del plan, sin cambios.
- **Tratamiento** (`scripts/photos/halftone.mjs`, `scripts/photos/treat.mjs`): recorte left 0.12, top 0.2326, ancho 0.68, alto 0.588 (proporcion 0.768), `out` 384x500, celda 6, angulo 45, contrast 1.0, brightness 165 (la foto es muy oscura: con brightness bajo la cobertura de tinta pasaba de 0.64; a 165 queda en 0.495). PNG tratado 10265 bytes, paleta de 2 colores, sin metadatos, tinta `--color-brand-dark`. Vista previa revisada con la herramienta de imagenes: el ojo, la ceja y el aro de la lupa se leen con media tinta clara, como los recortes del moodboard.
- **Escena y componente:** `photos.mjs` (manifiesto con `hero-a`), `photoFrame()` y regla R12 en `scenes.mjs` (sin cambiar ninguna coordenada; el hero actual ya cumple R12), `CollagePhoto.astro` montado por `CollageScene.astro` entre la capa svg y las pildoras, con `data-piece-of="panel"` y los mismos `--i`, `--r` y `--r-from` del panel. `check-photos.mjs` agregado a `prebuild` (unica linea de `package.json` que cambia).
- **Formato:** `Image` de astro:assets con `format="png"` y `quality={80}`; servido `hero-a.CYDZQLKo_n00dj.png` de 13 KB (13k segun `ls`, tope 25600). Con esta foto real el PNG pesa mas que la estimacion del plan (7.9 a 10 KB); no se midieron webp ni avif con las fotos reales (queda para la tarea 2, con las cuatro).

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

## Para quien continua (tareas 2 a 4)

- Mecanismo completo: `PHOTOS` en `photos.mjs` acepta mas entradas; `CollagePhoto` y `CollageScene` ya montan la elegida de cada ranura (whynow en cuanto exista `whynow-a` con `chosen: true`). `treat.mjs --id <id> [--preview dir] [--dry]`; `LICENSES.md` ya trae las secciones Estado, Como cerrar la eleccion, Reglas de seleccion, Licencias verificadas (Unsplash) y Registro (1 fila). Las guardas de `photos.test.mjs` ya cubren cada foto que se agregue; falta el bloque "conjunto de fotos" (dos por ranura con `Eleccion: abierta`, una con `cerrada`) de la tarea 2.
- Fuentes: para las otras tres fotos se puede seguir el mismo camino que funciono: WebSearch para candidatas de Unsplash, WebFetch de la pagina de la foto para autor y URL de `images.unsplash.com`, curl al CDN (`?fm=jpg&q=85&w=1600&auto=format&fit=max`). Pexels y Pixabay no se probaron en descarga. Si se usan, leer y citar su licencia el mismo dia.
- Sujetos ya usados: ojo detras de una lupa en el hero (hero-a). hero-b debe tener otro sujeto o encuadre (manos con lupa o telefono); whynow-a y whynow-b: manos con laptop o telefono, sin repetir sujeto del hero.
- Tope de peso: la suma de imagenes de `/` debe quedar en 40960 (hoy 13 KB con una foto, con la de whynow de 208x256 se espera menos de 6 KB).
- Pruebas que faltan por cambiar: `collage-language.spec.ts` (l) y (m) de whynow (3712), `brand-assets.spec.ts` (a) whynow 3712 y suma 32000 (suma hoy 30720: con el hero de 5490 la suma de la hoja aun cabe; comprobar), `sections-problem-solution.spec.ts` solo si afirma cero img en `.whynow-art`, y la prueba que enumera los `[data-sheet]` (suma `fotos`, tarea 3).
- Servidores: ninguno levantado por esta corrida (`astro preview stop` ejecutado); el `astro dev` del usuario (pid 86100) no se toco.
- Al cerrar el plan: correr las 4 operaciones de estado UNA vez y revisar ROADMAP.md (02-03 debe seguir `[ ]`) y STATE.md (`Plan:` no debe saltar).

## Preguntas abiertas para Juan y Ari

1. Ari: aprobar hero-a (ojo con lupa de Mohammed Idris Djoudi, Unsplash). Sin aprobacion la puerta de produccion (`PUBLIC_ENV=production`) bloquea el build.
2. Juan: el PNG tratado pesa 10 KB y el servido 13 KB con esta foto; siguen dentro de topes. Se evaluara webp o avif con las cuatro fotos en la tarea 2.
