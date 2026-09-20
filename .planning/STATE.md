---
gsd_state_version: "1.0"
current_phase: 03
current_phase_name: SEO, medición mínima y QA
status: planned
stopped_at: Fase 3 planificada (03-01, 03-02 y 03-03 escritos); falta plan-checker y ejecución. Fase 2 verificada por código, verificación humana diferida
last_updated: "2026-09-20T03:45:07.382Z"
last_activity: 2026-09-20
last_activity_desc: Fase 3 planificada; git flow, fotos del equipo y clientes en el hero integrados en develop
state_head: ac2d6546275c8ec9a826eb0cb8ff5864acf79974
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 15
  completed_plans: 15
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-18)

**Core value:** Un visitante entiende en segundos qué hace Loops Growth y llena el formulario de ClickUp, que está a un scroll de distancia.
**Current focus:** Phase 02 — Secciones, marca y copy

## Current Position

Phase: 03 (SEO, medición mínima y QA) — PLANNED
Plan: 0 of 3 (03-01 metadatos y schema, 03-02 medición y UTM, 03-03 auditoría y accesibilidad)
Status: Ready to execute (falta plan-checker)
Last activity: 2026-09-20 — Fase 3 planificada; fase 2 verificada por código (verificación humana diferida)

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: 0 min
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: sin datos
- Trend: sin datos

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 01 P01 | 7 min | 3 tasks | 20 files |
| Phase 01 P02 | 37 min | 3 tasks | 22 files |
| Phase 01 P03 | 30min | 3 tasks | 13 files |
| Phase 01 P04 | 15min | 2 tasks | 6 files |
| Phase 02 P01 | 3 sesiones | 3 tasks | 17 files |
| Phase 02 P02 | unos 45 min | 4 tasks | 14 files |
| Phase 02 P09 | n/a | 4 tasks | 48 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 4 fases gruesas. Las fases 1 a 3 cierran el sitio local; la fase 4 se ejecuta antes del evento y depende de decisiones externas.
- [Phase 1]: FORM-05 (envío real de prueba) va en la fase 1 para probar el valor central desde el inicio. COPY-02 y A11Y-03 se construyen con los fundamentos, antes de escribir las secciones.
- [Research]: Astro 7.3.3 + Tailwind 4.3.3 estático confirmado como stack. Outfit detrás de `--font-brand` hasta tener licencia web de Hurme.
- [Modo MVP]: cada fase lleva `**Mode:** mvp` y su Goal en formato de historia de usuario. La fase 1 correrá plan-phase en modo Walking Skeleton.
- [Phase 01]: Plan 01-01: Astro 7 lee YAML con file() sin parser propio (la clave es el id de la entrada); yaml queda solo como devDependency de QA — Confirmado con Context7 y un build real
- [Phase 01]: Plan 01-01: preload de fuentes limitado al subset latin (3 archivos) — Menos peso en el primer pintado; latin-ext sigue declarado por unicode-range
- [Phase 01]: Plan 01-01: commits en la rama gsd/phase-01-fundaciones-y-formulario-funcionando porque master es rama protegida — La guarda pre-commit prohibe commitear en la rama por defecto; falta integrar la rama a master
- [Phase 01]: Plan 01-02: los 6 pares prohibidos se miden contra el umbral 3 y un par prohibido declarado en un tono falla con mensaje explícito — Un par prohibido debe fallar incluso como UI; el mensaje nombra el motivo
- [Phase 01]: Plan 01-02: check-copy bloquea solo con PUBLIC_ENV=production (loadEnv, como astro.config); lo estructural falla siempre; --dist corre en postbuild — En prebuild dist es el de la corrida anterior; el contrato de FND-02 no depende del entorno
- [Phase 01]: Plan 01-02: PENDING-COPY.md se genera con walkClaims, sin fecha ni rutas absolutas; --check no se encadena en el build — Salida determinista y editar copy en desarrollo no debe bloquear el build; LNCH-03 puede exigir --check
- [Phase 01]: La rejilla de #agenda vive en .wrap.agenda-grid (dentro de la seccion morada de ancho completo), con minmax(0,5fr)/minmax(0,7fr) desde 1024 px — El contenedor de 72rem con gutter es .wrap; evita duplicar su calculo en la seccion
- [Phase 01]: El enlace de respaldo y el noscript usan la geometria Tabler external-link inline (16 px, aria-hidden), sin sumar libreria de iconos — UI-SPEC pide un SVG en linea; el hueco de dependencias se cierra en Fase 2 si hace falta mas iconografia
- [Phase 01]: Plan 01-04: la reserva del iframe de ClickUp se mide con el scrollHeight de cu-form (fase natural, min-height 0), no con style.height — El formulario usa height 100% y iframe-resizer solo reporta la altura del propio iframe; style.height devuelve el min-height vigente (medicion circular). Tokens: sm 1664px y lg 1536px
- [Phase 01]: Plan 01-04: FORM-05 sigue pendiente; los dos envios reales son humanos (Juan) y ninguna prueba automatica llena ni envia el formulario — Un envio crea una tarea real en la Lista de ClickUp de Ari; los bloques human-check se consolidan en 01-UAT.md
- [Phase 02]: 02-01: collage del hero como SVG en linea (lupa morada con cristal blanco, mango oscuro) con seis piezas nombradas listas para animar en el plan 07
- [Phase 02]: 02-02: --logo-clear = 1 X (BrandBook pag. 7); logo con los colores del vectorial de Ari (#4228d1), pendiente decision de Ari sobre #73187f
- [Phase 02]: 02-02: loop del collage como dos anillos solapados (los concentricos se leian como diana); sprite montado en SiteHeader hasta que 02-07 lo mueva a BaseLayout

- [Phase 02, 2026-09-19]: el morado de marca es #4228D1 (con #6C61DB y crema #F4F3E0), no #73187F. La muestra del BrandBook, el logo y el moodboard usan el azul violeta; solo la etiqueta de texto decía #73187F. Ari confirma después (cambiar el token exige recalcular contraste y re-extraer SVG). Reemplaza la decisión previa de mantener #73187F. Ver `02-BRAND-INVENTORY.md`
- [Phase 02]: logo, imagotipo, emblema e isotipos salen de las 32 mesas oficiales del `.ai` (una versión por fondo); favicon = mesa 18 (ojo con lupa, medido a 16 px). Los dibujos hechos por los agentes en 02-01/02-02 se reemplazaron por el Loopy oficial (02-10)
- [Phase 02]: fotos de stock con licencia comercial en media tinta (Unsplash) para las ranuras hero y whynow; la aprobación de Ari queda pendiente y la puerta `check-photos` bloquea `PUBLIC_ENV=production`
- [Phase 02]: topes de HTML subidos de 61440 a 81920 bytes crudos con máximo 25600 en gzip (autorizado por el orquestador; constantes en `tests/e2e/lib/budgets.mjs`). El tope crudo era un presupuesto propio del UI-SPEC; lo que se descarga es unos 15 KB
- [Phase 02, review]: WR-02 (lang=en en términos en inglés), WR-03 (mailto estricto), WR-05 (puerta de fotos), WR-07 (topes centralizados) corregidos. WR-01 (puertas solo en prebuild/postbuild), WR-04 (sitemap con /privacidad/) y WR-06 (declarar sharp) pasan a fase 3 o a decisión de Juan
- [Repo, 2026-09-20]: repo público https://github.com/Arianna-Lupi/loopsgrowth-landing con git flow: `main` (producción, solo por PR), `develop` (integración, rama por defecto), `feature/*`, `release/*`, `hotfix/*`; merges con `--no-ff`. GSD: `git.phase_branch_template=feature/phase-{phase}-{slug}`, `milestone_branch_template=release/{milestone}-{slug}`, `branching_strategy=phase`
- [Quick 260920]: fotos reales del equipo (aprendoclub.com) en duotono de marca y enlace a juan-tech.com en la tarjeta de Juan; Miguel Pacheco conserva el Loopy (sin foto). Aprobación de Ari y consentimiento de cada persona pendientes (puerta de producción). Ver `.planning/quick/260920-team-photos/`
- [Quick 260920]: hero con el CTA al final de los párrafos y rejilla estática de 12 clientes de ariannalupi.com bajo el CTA (no carrusel: SC 2.2.2). Etiqueta pending para Ari; logos con procedencia y aprobación pendiente. Ver `.planning/quick/260920-hero-clients/`
- [Phase 03, planes]: la auditoría con Lighthouse usa un modo local `--allow-pending` (flag de CLI, no variable de entorno) sobre `dist-audit/` marcado como no desplegable; el build de producción normal sigue fallando mientras haya pendientes. Hallazgo de 03-02: `form_view` usa `min(altura del bloque / 2, altura del viewport)` porque el bloque mide más de 1664 px en móvil
- [Copy, 2026-09-20]: la tarjeta de Juan lleva su nombre completo (Juan Carlos Angulo); `GEO` y `SEO/GEO` se marcan con lang=en; el CTA del hero en móviles cortos se resuelve compactando el ritmo vertical (opción 2)

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1] Ari debe confirmar la duración de la llamada (20 o 30 min) y la terminología (SEO/GEO por defecto). Se cambia en un solo lugar del YAML.
- [Phase 1] El formulario de ClickUp se verifica en la práctica: idioma que ve el visitante, campos ocultos para UTM, auto-resize con carga diferida y plan de ClickUp.
- [Phase 2] Las cifras `[VERIFICAR]` (30% a 50% menos de presupuesto de ads y el split Google vs IA) y cada caso nacen `pending`. Ari debe respaldarlas o suavizarlas.
- [Phase 2] Ari o el diseñador deben aprobar Outfit como sustituta visual de Hurme. Falta confirmar la licencia web y convertir el logo `.ai` a SVG.
- [Phase 2] Faltan confirmar el consentimiento y la credencial del equipo, además de política de privacidad, correo y redes para el footer.
- [Phase 3] Lighthouse SEO 100 exige `PUBLIC_ENV=production` (sin `noindex`), y el build de producción exige cero afirmaciones `pending`. Definir en plan-phase 3 cómo se audita mientras Ari no responda.
- [Phase 3] MEAS-02 necesita que Ari cree campos ocultos `utm_*` en el formulario de ClickUp. Sin ellos queda solo el conteo de tareas más el UTM del QR.
- [Phase 4] Dominio sin resolver: sin URL pública no hay QR. Plan B: subdominio gratuito.
- [Phase 1] FORM-05 pendiente: Juan hace los dos envios reales de prueba (1280 y 390 px), avisa a Ari y borra las dos tareas. El auto-resize de ClickUp no sigue al contenido: Ari verifica Autosize embed height

- [Phase 2, 2026-09-20] 61 textos de Ari siguen pendientes (`PENDING-COPY.md`, `02-ARI-FINDINGS.md`) y las fotos, logos de clientes y fotos del equipo esperan su aprobación: `PUBLIC_ENV=production` no compila hasta entonces (intencional)
- [Phase 3] Decisiones abiertas de 03-03: quién aprueba la excepción del iframe de ClickUp (EXC-001), su vencimiento (propone 2026-12-19) y si se autoriza diferir el script de ClickUp si Lighthouse queda bajo 95 (toca FORM-03)
- [Phase 3] Robots en no productivo: 03-01 usa `Disallow: /` (revierte la decisión de la fase 1); `og:locale` es_LA es suposición; el nodo Organization va sin `logo`
- [Repo] `sharp` se importa en scripts pero no está declarado en `package.json` (03-01 lo declara); el hito no tiene versión asignada (`null`)

## Deferred Verification

| Phase | State | Resume |
|-------|-------|--------|
| 1 | verification_deferred_human | /gsd-verify-work 1 |
| 2 | verification_deferred_human | /gsd-verify-work 2 |

Nota (2026-09-19, fase 2): verificada por codigo sin huecos; los 5 items humanos estan en `02-UAT.md` (61 textos de Ari, eleccion y licencia de fotos, VoiceOver del FAQ, teclado en el iframe real, marca contra el moodboard). Juan decidio diferirlos y seguir con la fase 3.

Nota (2026-09-19): Juan decidio seguir con las fases 2 a 4 y dejar los 6 items humanos de `01-UAT.md` pendientes (FORM-05 con dos envios reales, Autosize en ClickUp, revision de WR-05/WR-08/WR-14, LAN desde otro dispositivo).

## Deferred Items

Items acknowledged and deferred at milestone close, most recent first:

| Category | Item | Status | Deferred At | Milestone |
|----------|------|--------|-------------|-----------|
| *(none)* | | | | |

## Reanudar (2026-09-20)

- Fase 1: ejecutada y verificada en código, verificación humana diferida (`01-UAT.md`, 6 ítems). Integrada en `develop`.
- Fase 2: 11 planes ejecutados (02-01 a 02-11), code review sin Critical (`02-REVIEW.md`, `02-REVIEW-FIX.md`), verificación por código sin huecos (`02-VERIFICATION.md`, `human_needed`); ítems humanos en `02-UAT.md`. Integrada en `develop`.
- Trabajo rápido integrado en `develop`: fotos del equipo y enlace de Juan, hero con CTA al final y clientes.
- Fase 3: `03-01-PLAN.md`, `03-02-PLAN.md` y `03-03-PLAN.md` escritos y validados (commits 5fc52e7, 31e61e6 y 271b982) en la rama `feature/phase-03-seo-medicion-minima-y-qa`. Falta: plan-checker de los tres planes, ejecutarlos (waves 1, 2 y 3), code review, verificación.
- Siguiente paso: sesión nueva, `/clear` y `/gsd-autonomous --from 3` (o `/gsd-execute-phase 3 --no-transition` tras pasar el checker). También pendiente: `CONTRIBUTING.md` con el flujo git flow y definir la versión del hito.
- Reglas de ejecución aprendidas:
  - Forzar aislamiento `none` antes de cada executor (`gsd-tools query dispatch-isolation --raw --phase NN --force-isolation none`) y `workflow.use_worktrees=false` (ya puesto).
  - `astro preview` en segundo plano rompe Playwright dentro de agentes: arrancarlo a mano en el 4322 y detenerlo con `npx astro preview stop`. NUNCA `astro dev stop` desde un agente: apaga el servidor de desarrollo del usuario.
  - Los planners `gsd-planner` se estancan a los 600 s: dividir por plan y, si aun así se estancan, usar un agente general con la misma tarea (funcionó para 03-01, 03-02 y 03-03).
  - Los ejecutores se quedan sin contexto: una tarea por ejecutor, SUMMARY parcial, commits con listas explícitas de archivos (nunca `git add -A`: `brand-inventory/` es confidencial y está excluido por `.git/info/exclude`).
  - `state.advance-plan`, `update-progress` y `roadmap.update-plan-progress` cuentan mal cuando los planes no van en orden numérico: revisar STATE y ROADMAP a mano después de cada plan.
  - Los subagentes no pueden escribir SUMMARY.md con la herramienta Write en las tareas rápidas: devuelven el contenido y lo escribe el orquestador.
  - El servidor de desarrollo puede quedar con el contenido en caché tras muchos cambios de rama o de YAML y dar 500 ("Falta la clave `es`"): reiniciarlo (`npx astro dev stop && npm run dev`). `astro sync` y `astro build` validan el contenido.

## Session Continuity

Last session: 2026-09-20
Stopped at: Fase 3 planificada; falta plan-checker y ejecución
Resume file: .planning/phases/03-seo-medicion-minima-y-qa/03-01-PLAN.md
