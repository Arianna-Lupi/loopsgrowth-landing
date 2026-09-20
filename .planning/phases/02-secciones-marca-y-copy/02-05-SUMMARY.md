---
phase: 02-secciones-marca-y-copy
plan: 05
subsystem: ui
tags: [astro, copy, yaml, playwright, team, avatars, includes, how-it-works]
status: partial
plan_head_before: ac77d7a4e23d1e75341ba39b3d125cc0e5dd8b6d
# commits es el conteo medido del libro (git rev-list --count plan_head_before..HEAD) al escribir este resumen parcial.
commits: 1
tasks_done: [1]
tasks_pending: [2, 3]
requirements-completed: []

provides:
  - "Clave team en el YAML (titular verified, cuatro cargos verified, cuatro nombres pending por consentimiento) y su esquema estricto de cuatro integrantes"
  - "Team.astro (#nosotros, tono yellow, cuatro tarjetas pop con avatar Loopy, nombre y cargo), con la constante AVATARS por posición, montada entre Casos y la agenda"
  - "team-includes-how.spec.ts (solo el bloque de Quiénes somos) y copy-team-includes-how.test.mjs (SECTIONS = ['team'], cantidades [team.members, 4])"
  - "Entrada Lote C (equipo), ronda 0 en 02-VISUAL-LOG.md"

key-files:
  created:
    - src/components/sections/Team.astro
    - tests/e2e/team-includes-how.spec.ts
    - tests/guards/copy-team-includes-how.test.mjs
  modified:
    - src/content/landing.es.yaml
    - src/content.config.ts
    - src/pages/index.astro
    - PENDING-COPY.md
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md
---

# Phase 2 Plan 05: Quiénes somos, Qué incluye y Cómo funciona (PARCIAL: tarea 1 de 3)

Tarea 1 (tracer de Quiénes somos de punta a punta) hecha y commiteada; las tareas 2 y 3 quedan para un ejecutor nuevo.

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

## Pendiente (para el ejecutor siguiente)

**Tarea 2** (ver `02-05-PLAN.md`, líneas 336 a 390): Qué incluye y Cómo funciona. Extender `SECTIONS` y `COUNTS` de la guarda (`includes`, `how_it_works`, `includes.items` 6, `how_it_works.steps` 4), agregar los dos bloques del spec (en rojo primero), YAML de `includes` y `how_it_works` entre `team` y `agenda` con las cadenas de la tabla de ranuras (nueve `pending` en total: los cuatro nombres, `includes.items[0].title` con `text: FALTA CONFIRMAR` y cuatro `timeframe`), esquema, `Includes.astro` (`#incluye`, light) y `HowItWorks.astro` (`#como-funciona`, dark), montaje en `index.astro` tras `Team`, `npm run pending`. Invocar `impeccable` (`shape` y `layout`) y `design-taste-frontend` antes de escribir los componentes. Nota para el spec: `a11y-base.spec.ts` deriva las marcas FALTA CONFIRMAR de `/` del YAML, así que la nueva marca del título AEO se contará sola.

**Tarea 3:** mediciones a cinco anchos, ciclos visuales de los lotes C (equipo) y D (incluye y cómo funciona) con `PHASE2_BATCH`, capturas (15 por lote), entradas de `02-VISUAL-LOG.md`, cierre con la suite completa y `PUBLIC_ENV=production npm run build`.

**Cierre del plan (solo cuando las tres tareas estén hechas):** completar este SUMMARY (secciones "Erratas del doc", "Hallazgos para Ari", "Desviaciones", autoverificación, `status: complete`, `commits:` medido de nuevo), `state.advance-plan`, `state.update-progress`, `roadmap.update-plan-progress 02`, `requirements.mark-complete CONT-07 CONT-08 CONT-09 COPY-01 DSGN-04` una vez cada uno, y revisar a mano ROADMAP.md (02-05 `[x]`, tabla 8/11) y STATE.md (`Plan:` apuntando a 02-06).

## Notas para el ejecutor siguiente

- **Presupuesto de HTML (autorización del orquestador para 02-05 y 02-06):** `dist/index.html` mide 51790 bytes. Si al terminar las tareas 2 y 3 pasara de 61440 crudos, subir las guardas que lo afirman a 81920 bytes crudos con la condición dura adicional de 25600 bytes como máximo con gzip (`gzip -9 -c dist/index.html | wc -c`), registrar la desviación con las cifras medidas y la lista de guardas tocadas, y avisar a Juan. Guardas que hoy afirman el tope: `tests/e2e/page-structure.spec.ts` (prueba "el HTML de / pesa menos de 60 KB", línea 317) y el criterio de peso del spec nuevo (fragmento de 20480 caracteres para las tres secciones y `/` menor a 61440 bytes). Ojo con el fragmento de 20480 caracteres del plan: las tres secciones ya ocupan unos 3.5 KB solo con Team; medir antes de decidir.
- Protocolo Playwright que funcionó: `npm run build`, `(npx astro preview --port 4322 &)`, `E2E_BLOCK_CLICKUP=1 npx playwright test --project=chromium <specs>`, `npx astro preview stop`. Ningún servidor quedó en marcha por este ejecutor; `astro dev` del usuario (pid 86100) no se tocó.
- No hay clase de tarjeta pop compartida (PillarCard, PainCard, ResultItem y MetricCard tienen la suya): `Team.astro` lleva sus estilos locales con `--border-pop`, `--shadow-pop`, `--radius-card` y `--card-pad` (Supuesto 11 del plan).
- El tono anidado se resuelve con `data-tone="light"` en `li.team-card` y `background: var(--surface)`.

## Erratas del doc (para el SUMMARY final)

Presentes en el doc de Ari (`02-ARI-COPY-V2.md`, sección 6) y NO mostradas en la página por el Supuesto 1 (sin biografías ni introducción): "agil", "traves", "direccion", "técnico.Coach SEO" pegado y "Coach SEO en aprendoclub" sin punto final. Falta reportar en el SUMMARY final las de la sección 7 ("cuándo y cuándo" en "Estrategia a 6-12 meses", que sí se muestra tal cual).

## Deviations from Plan

None hasta ahora en la tarea 1: el plan se ejecutó tal como está escrito. `Avatar.astro` ya acepta las cuatro variantes de 02-10 (comprobado antes de editar).

## Known Stubs

Ninguno. Los cuatro nombres `pending` se muestran tal cual y quedan listados en `PENDING-COPY.md`.

## Self-Check: PASSED (tarea 1)

- FOUND: src/components/sections/Team.astro, tests/e2e/team-includes-how.spec.ts, tests/guards/copy-team-includes-how.test.mjs
- FOUND: commit 28f0d1c
