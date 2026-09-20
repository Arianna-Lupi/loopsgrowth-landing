---
phase: 02-secciones-marca-y-copy
plan: 05
subsystem: ui
tags: [astro, copy, yaml, playwright, team, avatars, includes, how-it-works]
status: partial
plan_head_before: ac77d7a4e23d1e75341ba39b3d125cc0e5dd8b6d
# commits es el conteo medido del libro (git rev-list --count plan_head_before..HEAD) al escribir este resumen parcial (antes del commit de este propio resumen).
commits: 3
tasks_done: [1, 2]
tasks_pending: [3]
requirements-completed: []

provides:
  - "Claves includes (seis entregables) y how_it_works (cuatro fases con plazo) en el YAML y en el esquema estricto (.length(6) y .length(4)); nueve pending en total (36 en PENDING-COPY.md)"
  - "Includes.astro (#incluye, light, seis li.include-item abiertos con disco de check SVG) y HowItWorks.astro (#como-funciona, dark, ol de cuatro fases con disco por contador CSS, chip de plazo y conector discontinuo naranja), montados tras Team"
  - "Guarda y spec extendidos: SECTIONS = team, includes, how_it_works; cantidades 4, 6 y 4; bloques de spec de Qué incluye (1, 1, 2, 3 y 3 columnas a 320, 390, 768, 1024 y 1280 px) y de Cómo funciona (columna hasta 1023 px, cuatro columnas con el mismo top desde 1024 px, conector vertical y horizontal)"
  - "Clave team en el YAML (titular verified, cuatro cargos verified, cuatro nombres pending por consentimiento) y su esquema estricto de cuatro integrantes"
  - "Team.astro (#nosotros, tono yellow, cuatro tarjetas pop con avatar Loopy, nombre y cargo), con la constante AVATARS por posición, montada entre Casos y la agenda"
  - "team-includes-how.spec.ts (solo el bloque de Quiénes somos) y copy-team-includes-how.test.mjs (SECTIONS = ['team'], cantidades [team.members, 4])"
  - "Entrada Lote C (equipo), ronda 0 en 02-VISUAL-LOG.md"

key-files:
  created:
    - src/components/sections/Team.astro
    - src/components/sections/Includes.astro
    - src/components/sections/HowItWorks.astro
    - tests/e2e/team-includes-how.spec.ts
    - tests/guards/copy-team-includes-how.test.mjs
  modified:
    - src/content/landing.es.yaml
    - src/content.config.ts
    - src/pages/index.astro
    - PENDING-COPY.md
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
---

# Phase 2 Plan 05: Quiénes somos, Qué incluye y Cómo funciona (PARCIAL: tareas 1 y 2 de 3)

Tareas 1 (tracer de Quiénes somos) y 2 (Qué incluye y Cómo funciona) hechas y commiteadas; la tarea 3 (ciclos visuales y cierre) queda para un ejecutor nuevo.

## Hecho

**Tarea 1, commit `28f0d1c`:** YAML `team` (titular y cuatro cargos `verified`; cuatro nombres `pending` con `confirm_by: Ari` y `reason` de consentimiento), esquema `team` con `.length(4)`, `Team.astro` (`SectionShell id="nosotros" tone="yellow"`, `<ul role="list">` de cuatro `li.team-card data-tone="light"`, `Avatar` desde `AVATARS = ['ojo-morado', 'ojo-amarillo', 'ojos-morado', 'ojos-amarillo']`, `h3` con el nombre y `p.team-role` con el cargo, solo nodos de texto), `index.astro` con `<Team />` tras `<Cases />`, `PENDING-COPY.md` regenerado (31 pendientes, 4 nuevos), spec de estructura (10 pruebas a 1280 y 390 px) y guarda derivada del YAML (`walkClaims`, `checkCopy`, `MISSING_MARK`).

**Skills invocadas** con la herramienta Skill: `impeccable` (contexto sin entrevista, verbo `shape` con brief por supuestos) y `design-taste-frontend` (diales 7, 3 y 4). Registro en `02-VISUAL-LOG.md`, "Lote C (equipo), ronda 0".

**Verificación de la tarea 1 (todo en verde):**
- Rojo antes de agregar `team`: la guarda falló 2 de 6 (existencia de la clave y cantidades).
- `npm run build` verde (con `prebuild` y `postbuild`); `node --test tests/guards/*.test.mjs`: 168 de 168; `node scripts/list-pending.mjs --check` sale 0.
- Comprobación de YAML contra `dist/index.html` y `PENDING-COPY.md`: OK; comprobación de producción (`PUBLIC_ENV=production node scripts/check-copy.mjs --json`): 0 estructurales y solo reglas PENDING y MISSING; los cuatro `team.members[i].name` figuran como PENDING.
- `grep -o 'id="nosotros"' dist/index.html | wc -l` = 1; `grep -o 'data-collage="avatar"' dist/index.html | wc -l` = 4; `set:html`, hex en `src/components/sections` y `outline: none` = 0.
- Playwright con ClickUp bloqueado (`team-includes-how`, `page-structure`, `a11y-base`): 76 pasadas, 15 omitidas (capturas sin lote), 0 fallos.
- Presupuesto de HTML: `dist/index.html` pasó de 48310 a 51790 bytes crudos con esta sección (+3480, avatares incluidos). Quedan unos 9650 bytes bajo el tope de 61440 para Qué incluye, Cómo funciona y el plan 02-06. Ver la nota de presupuesto abajo.

**Tarea 2, commit `485720e`:** YAML `includes` (título y seis entregables `verified`, salvo `includes.items[0].title` que es `pending` con `text: FALTA CONFIRMAR` y el texto del doc con AEO solo en `reason`) y `how_it_works` (título, cuatro fases `verified` y cuatro `timeframe` `pending` con `reason`), esquema con `.length(6)` y `.length(4)`, `Includes.astro` (`SectionShell id="incluye" tone="light"`, `ul.includes-grid[role=list]`, `li.include-item` con borde superior de 3 px, `span.include-check` con SVG Tabler `M5 12l5 5l10 -10`, `h3` y `p.include-desc`), `HowItWorks.astro` (`SectionShell id="como-funciona" tone="dark"`, `ol.steps[role=list]` con `counter-reset`, disco en `li::before`, conector en `li:not(:last-child)::after`, `h3`, `p.step-desc` y `p.step-time`), `index.astro` con `<Includes />` y `<HowItWorks />` tras `<Team />`, `PENDING-COPY.md` regenerado (36 pendientes, 5 nuevos).

**Skills invocadas** con la herramienta Skill: `impeccable` (contexto cargado con `impeccable context`, verbos `shape` y `layout`, brief por supuestos) y `design-taste-frontend` (diales 7, 3 y 4). Design Read: landing de captación para dueños de e-commerce con lenguaje collage y pop; Qué incluye abierto y sin tarjetas para variar respecto a Casos y Equipo; Cómo funciona oscuro con riel naranja y discos amarillos numerados, sin movimiento. La entrada de `02-VISUAL-LOG.md` del lote D queda para la tarea 3 (ciclo visual y capturas).

**Verificación de la tarea 2 (todo en verde):**
- Rojo: la guarda ampliada falló antes de agregar el YAML (la clave `includes` y las cantidades). El spec se escribió antes de los componentes; el rojo confirmado con ejecución fue el de la guarda.
- `npm run build` verde (con `prebuild` y `postbuild`); `node --test tests/guards/*.test.mjs`: 168 de 168; `node scripts/list-pending.mjs --check` sale 0; `grep` de `PENDING-COPY.md`: 9 de las tres secciones, 4 plazos y 1 título.
- Comprobación de YAML contra `dist/index.html`: OK (todos los textos presentes, el título con AEO ausente, cantidades 6 y 4); comprobación de producción (`PUBLIC_ENV=production node scripts/check-copy.mjs --json`): 0 estructurales, solo PENDING y MISSING, nueve rutas pending iguales a las del YAML.
- `grep`: `id="incluye"` 1, `id="como-funciona"` 1, `set:html` 0, hex en `src/components/sections` 0, `outline: none` 0, `line-height ... !important` 0, `height:` fijo en Team, Includes y HowItWorks 0.
- Playwright con ClickUp bloqueado (`team-includes-how`, `page-structure`, `a11y-base`, proyecto chromium): 97 pasadas, 15 omitidas (capturas sin lote), 0 fallos. Preview detenido con `npx astro preview stop`; no queda ningún servidor de este ejecutor.
- Presupuesto de HTML: `dist/index.html` pasó de 51790 a 56810 bytes crudos (+5020 por Qué incluye y Cómo funciona) y 11471 bytes con gzip. Quedan 4630 bytes crudos bajo el tope de 61440 para el plan 02-06; el tope NO se tocó ni se subió en este plan (ver nota de presupuesto).

## Pendiente (para el ejecutor siguiente)

**Tarea 3** (`02-05-PLAN.md`, desde la línea 392): mediciones a cinco anchos, ciclos visuales de los lotes C (equipo) y D (incluye y cómo funciona) con `PHASE2_BATCH`, capturas (15 por lote), entradas de `02-VISUAL-LOG.md`, cierre con la suite completa y `PUBLIC_ENV=production npm run build`.

**Cierre del plan (solo cuando las tres tareas estén hechas):** completar este SUMMARY (secciones "Erratas del doc", "Hallazgos para Ari", "Desviaciones", autoverificación, `status: complete`, `commits:` medido de nuevo), `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02`, `requirements.mark-complete CONT-07 CONT-08 CONT-09 COPY-01 DSGN-04` una vez cada uno, y revisar a mano ROADMAP.md (02-05 `[x]`, tabla 8/11) y STATE.md (`Plan:` apuntando a 02-06).

## Notas para el ejecutor siguiente

- **Presupuesto de HTML (autorización del orquestador para 02-05 y 02-06):** `dist/index.html` mide ahora 56810 bytes crudos (11471 con gzip). Si al terminar la tarea 3 (los ajustes visuales pueden sumar marcado) o el plan 02-06 pasara de 61440 crudos, subir las guardas que lo afirman a 81920 bytes crudos con la condición dura adicional de 25600 bytes como máximo con gzip (`gzip -9 -c dist/index.html | wc -c`), registrar la desviación con las cifras medidas y la lista de guardas tocadas, y avisar a Juan. Guardas que hoy afirman el tope: `tests/e2e/page-structure.spec.ts` (prueba "el HTML de / pesa menos de 60 KB", línea 317) y el criterio de peso del spec nuevo (fragmento de 20480 caracteres para las tres secciones y `/` menor a 61440 bytes). Ojo con el fragmento de 20480 caracteres del plan: las tres secciones ya ocupan unos 3.5 KB solo con Team; medir antes de decidir.
- Protocolo Playwright que funcionó: `npm run build`, `(npx astro preview --port 4322 &)`, `E2E_BLOCK_CLICKUP=1 npx playwright test --project=chromium <specs>`, `npx astro preview stop`. Ningún servidor quedó en marcha por este ejecutor; `astro dev` del usuario (pid 86100) no se tocó.
- No hay clase de tarjeta pop compartida (PillarCard, PainCard, ResultItem y MetricCard tienen la suya): `Team.astro` lleva sus estilos locales con `--border-pop`, `--shadow-pop`, `--radius-card` y `--card-pad` (Supuesto 11 del plan).
- El tono anidado se resuelve con `data-tone="light"` en `li.team-card` y `background: var(--surface)`.

## Erratas del doc (para el SUMMARY final)

Presentes en el doc de Ari (`02-ARI-COPY-V2.md`, sección 6) y NO mostradas en la página por el Supuesto 1 (sin biografías ni introducción): "agil", "traves", "direccion", "técnico.Coach SEO" pegado y "Coach SEO en aprendoclub" sin punto final. Falta reportar en el SUMMARY final las de la sección 7 ("cuándo y cuándo" en "Estrategia a 6-12 meses", que sí se muestra tal cual).

## Deviations from Plan

None hasta ahora en las tareas 1 y 2: el plan se ejecutó tal como está escrito (el spec de la tarea 2 midió columnas a 320, 390, 768, 1024 y 1280 px en lugar de solo tres anchos, dentro del contrato). `Avatar.astro` ya acepta las cuatro variantes de 02-10 (comprobado antes de editar).

## Known Stubs

Ninguno. Los cuatro nombres `pending` se muestran tal cual y quedan listados en `PENDING-COPY.md`.

## Self-Check: PASSED (tareas 1 y 2)

- FOUND: src/components/sections/Team.astro, tests/e2e/team-includes-how.spec.ts, tests/guards/copy-team-includes-how.test.mjs
- FOUND: src/components/sections/Includes.astro, src/components/sections/HowItWorks.astro
- FOUND: commits 28f0d1c y 485720e
