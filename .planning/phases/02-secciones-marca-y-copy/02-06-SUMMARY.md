---
phase: 02-secciones-marca-y-copy
plan: 06
subsystem: ui
tags: [astro, privacidad, footer, noindex, yaml, playwright, tracer, faq, details, guarda-inversion]
status: partial
plan_head_before: 44cf69fe091d5313d68c72288b6d64aedf4ce050
# commits es el conteo medido del libro (git rev-list --count plan_head_before..HEAD) justo antes de commitear este resumen parcial: cuatro commits: fbdb19d (Tarea 1), b496364 (resumen parcial anterior), b9cdf57 y f2554c8 (Tarea 2). El commit de este resumen no se cuenta. El ejecutor que cierre el plan lo recalcula.
commits: 4
completed: null
actuals:
  tokens: 21000
  tasks: 2
  commits: 4
requirements-completed: []

provides:
  - "Tarea 1 (tracer) completa: /privacidad/ de punta a punta (h1 del YAML, cuerpo FALTA CONFIRMAR pending, noindex en todo entorno, sin canonical, sin JavaScript, sin h2)"
  - "SiteFooter.astro primer corte (nav aria-label con el enlace de privacidad, aria-current en /privacidad), montado por BaseLayout tras main"
  - "BaseLayout con props noindex y path; SiteHeader con CTA a #agenda en / y a /#agenda en otras rutas; SkipLinks con el salto a #agenda solo en /"
  - "Tarea 2 completa: ForWhom.astro (#para-quien, light, dos tarjetas es y no es) y Faq.astro (#faq, yellow, 6 details nativos cerrados, sin name, sin JavaScript), montados en index.astro antes de AgendaSection"
  - "Guarda INVERSION (INVERSION_PATH_PREFIXES, INVERSION_MONTHLY_RE, INVERSION_CURRENCY_RE, findInversion) en scripts/lib/copy-rules.mjs y regla en checkCopy; 8 pruebas por mutación (14a a 14h) al final de tests/guards/copy.test.mjs"
  - "Claves for_whom y faq en el YAML y el esquema estricto (22 afirmaciones pending); PENDING-COPY.md regenerado (59 pendientes: 9 de for_whom y 13 de faq)"

key-files:
  created:
    - src/components/SiteFooter.astro
    - src/pages/privacidad.astro
    - src/components/sections/ForWhom.astro
    - src/components/sections/Faq.astro
    - tests/e2e/closing-sections.spec.ts
  modified:
    - src/content/landing.es.yaml
    - src/content.config.ts
    - src/layouts/BaseLayout.astro
    - src/components/SiteHeader.astro
    - src/components/SkipLinks.astro
    - src/pages/index.astro
    - scripts/lib/copy-rules.mjs
    - tests/guards/copy.test.mjs
    - tests/guards/brand-assets.test.mjs
    - tests/e2e/a11y-base.spec.ts
    - tests/e2e/page-structure.spec.ts
    - tests/e2e/results-cases.spec.ts
    - tests/e2e/team-includes-how.spec.ts
    - PENDING-COPY.md
    - .planning/phases/02-secciones-marca-y-copy/02-VISUAL-LOG.md

key-decisions:
  - "El título de /privacidad se compone como 'Política de privacidad: Loops Growth' (mismo criterio de dos puntos y espacio que meta.title_template)."
  - "SiteFooter pasa aria-current solo cuando la ruta empieza con /privacidad; en / el atributo no se emite."
  - "El sitemap de un build de producción incluye /privacidad/ (aun con noindex): la exclusión es nota de la fase 3, tal como fija el plan."
  - "INVERSION solo mira for_whom.* y faq.* y solo afirmaciones que no están verified; la facturación anual ('USD 200k o más al año', '200k al año') y los plazos ('6-12 meses', '2 veces al mes') no se marcan. Una cifra escrita con letras ('cuatro mil') no se detecta (límite documentado en el encabezado de copy-rules.mjs)."
  - "El FAQ no lleva transición ni animación en el giro plus a minus: la Tarea 2 del plan fija 'sin transición en ninguna propiedad'; el icono cambia al instante (el UI-SPEC dejaba 150 ms opcionales bajo no-preference)."
  - "El anillo de foco del summary usa el token del tono de la tarjeta (morado sobre blanco), con offset negativo de 5 px, para que quede dentro de la tarjeta y separado del borde oscuro."

requirements: [CONT-10, CONT-11, CONT-12, CONT-13, COPY-01, DSGN-04]
---

# Phase 2 Plan 06: Para quién es, FAQ, CTA final, footer y privacidad (PARCIAL: tareas 1 y 2 de 3)

Estado: **PARCIAL**. Las Tareas 1 (tracer) y 2 (Para quién es, FAQ e INVERSION) están hechas y commiteadas. Falta la Tarea 3, que corre en un ejecutor nuevo. Este resumen lo reescribe el ejecutor que cierre el plan.

## Hecho

### Tarea 1: tracer de /privacidad y primer corte del footer (commit fbdb19d)

- YAML y esquema: `footer.nav_label` y `footer.privacy_link` (verified), `privacy.title` (verified) y `privacy.body` (una afirmación pending 'FALTA CONFIRMAR', `confirm_by: Ari`, `reason` que dice que Ari entrega el texto legal). Los nombres de bloque `contact_label` y `social_label` y las ranuras `email` y `social` los suma la Tarea 3.
- `SiteFooter.astro`: `<footer class="site-footer" data-tone="light">` con borde superior 3 px y `--section-y`; `<nav class="footer-nav" aria-label>` con un `a.footer-link` a `/privacidad/`, 44 px de alto, subrayado permanente que engrosa a 3 px en hover. Sin encabezados ni JS.
- `BaseLayout.astro`: props `noindex?` y `path?`; robots `noindex` con `!isProduction || noindex`; canonical solo con `isProduction && !noindex`; `<SiteFooter />` tras `</main>`.
- `privacidad.astro`: `section#privacidad` con un h1 (`--text-heading`) y un `<p>` por elemento de `privacy.body`; nota de fase 3 sobre sitemap y `noindex` en el frontmatter.
- `SiteHeader.astro` (`ctaHref`) y `SkipLinks.astro` (`hasAgenda`) deciden por ruta.
- Skills invocadas con la herramienta Skill: `impeccable` y `design-taste-frontend` (diales 7, 3 y 4). El pie y la página son del lote E (verbos layout, colorize y harden); esa iteración visual se hace en la Tarea 3.
- Resultados: RED confirmado (8 pruebas fallaban) y luego 60 pasadas con ClickUp bloqueado; build de producción con `/privacidad` con `noindex` y sin canonical.

### Tarea 2: Para quién es, FAQ y guarda INVERSION (commits b9cdf57 rojo y f2554c8 verde)

- **RED primero (b9cdf57):** 8 pruebas por mutación al final de `tests/guards/copy.test.mjs` (14a a 14h; solo líneas agregadas, ninguna existente editada, la 9b y la 10 intactas). Cinco fallaban antes de la guarda (14a, 14b, 14f, 14g, 14h); 14c, 14d y 14e (no marcar) pasaban de forma trivial. Se importa `copy-rules.mjs` como espacio de nombres para que un export ausente no rompa la carga del archivo.
- **Guarda (`scripts/lib/copy-rules.mjs`):** `INVERSION_PATH_PREFIXES = ['for_whom.', 'faq.']`, `INVERSION_MONTHLY_RE` (monto con miles, decimales o sufijo k o mil, con un primer monto opcional unido por a, -, y o hasta, moneda opcional y `al mes`, `por mes`, `mensual(es)` o `/mes`), `INVERSION_CURRENCY_RE` (USD, US$ o $ con monto, salvo `al año` o `anual`, con `o más` opcional) y `findInversion(text)`. En `checkCopy`, cada afirmación de esas rutas que no esté `verified` suma una violación `INVERSION` al arreglo `content` (con el texto limpio). Marca '4 a 5k al mes', '4-5k al mes', '1.5k al mes', '+1500 al mes', 'USD 1500' y 'desde $2,000'; no marca esas cadenas `verified`, en `cases.*`, ni 'USD 200k o más al año', 'facturación de 200k al año', '6-12 meses', '2 veces al mes'. El encabezado documenta el motivo (hallazgo 6, CONTEXT) y el alcance, sin dar por hecho que Ari aprobó nada.
- **YAML y esquema:** `for_whom` (`title`, `is_for` e `is_not_for` de `title` e `items` de 3) y `faq` (`title` e `items` de 6 `{question, answer}`), todo 'FALTA CONFIRMAR' `pending` con `confirm_by: Ari` y `reason` que nombra la ranura (el primer ítem de `is_for` pide el perfil de USD 200k o más al año; ítems y respuesta de inversión piden no publicar rangos ni cifras sin aprobación; las seis preguntas por tema: qué es GEO, duración de la llamada, qué preparar, inversión, tiempos de resultados y si aplica a mi negocio). Los dos nombres de columna ('Para quién es' y 'Para quién no es') son `pending` con el `reason` de CONTEXT. El esquema exige 5 a 6 preguntas.
- **`ForWhom.astro`:** `SectionShell` (`para-quien`, light) con dos tarjetas (`fw-is-for` amarilla, borde sólido de 3 px y sombra pop; `fw-is-not-for` blanca, borde discontinuo de 3 px, sin sombra), h3 con id, `ul role="list" aria-labelledby`, icono SVG 24 px por ítem (check y x), sin CTA, enlaces, hover ni transición. Una columna bajo 40em y dos desde 40em con gap de 24 px y alturas iguales.
- **`Faq.astro`:** `section#faq` (yellow) con h2 `.section-title` y un `<details class="faq-item">` por pregunta (sin `name`, sin `open`), `summary` flex de 44 px o más con icono de disco y plus o minus (la barra `faq-icon-v` se oculta abierto), respuesta separada por regla de 3 px. Desde 64em, columnas 5fr y 7fr con gap de 48 px. Anillo de foco de 3 px con offset negativo dentro de la tarjeta. Ganchos para el plan 07: `faq-item`, `faq-summary`, `faq-answer`, `faq-icon`, `faq-icon-v`. Sin JavaScript.
- **Página:** `index.astro` monta `ForWhom` y `Faq` justo antes de `AgendaSection`.
- **Pruebas del navegador:** bloques de Para quién es y FAQ en `closing-sections.spec.ts` (derivados del YAML) y el bloque `recorte` (solo con `PHASE2_BATCH`, `D06-{para-quien,faq}-{390,1280}.png`). `a11y-base.spec.ts`: tipo `faq` del YAML, `SUMMARIES` derivado de `faq.items.length`, `tabUntilIframe` con máximo 24 y parada `SUMMARY` nombrada `summary`, en los casos (a) de 1280 y 390 px.
- **Skills y ciclo visual:** `impeccable` (shape, layout, clarify, adapt) y `design-taste-frontend` (diales 7, 3 y 4) con la herramienta Skill; entradas "Lote D (parte 06: Para quién es y FAQ)" rondas 0 y 1 en `02-VISUAL-LOG.md`, contra `moodboard.png` y `ai_a.png`. La crítica no encontró defecto que corregir (una ronda, sin ronda de confirmación). Comprobación de endurecimiento aparte con textos largos y una URL sin espacios a 320 y 1280 px: sin desborde, icono íntegro, hover del disco amarillo.

### Resultados (Tarea 2)

- `node --test tests/guards/*.test.mjs`: 176 pass, 0 fail (incluye 14a a 14h, la 9b y la 10 de 02-03, que pasan). `npm run pending` (59 pendientes) y `--check` OK; `grep -c "^| for_whom\." PENDING-COPY.md` = 9 y `"^| faq\."` = 13. `node scripts/check-contrast.mjs`: 14 de 14. `npm run build`: verde (0 estructurales).
- Comprobación de producción JSON: 0 violaciones estructurales, ninguna INVERSION en todo el YAML y las 42 rutas de `for_whom` y `faq` solo con PENDING y MISSING.
- `grep -o "<details" dist/index.html | wc -l` = 6; `grep -c "<details[^>]* name=" dist/index.html` = 0.
- Playwright con ClickUp bloqueado, suite completa del proyecto `chromium`: 414 pasadas, 89 omitidas, **2 fallidas** (ver más abajo). `closing-sections.spec.ts`: 44 pasadas (4 omitidas: `recorte`). Orden de tabulación con seis resúmenes (14 paradas) verde.
- Capturas del lote D06: 19 archivos en `test-results/phase2/` (15 de página completa y 4 recortes; no versionados). El preview de 4322 quedó detenido; el `astro dev` del usuario no se tocó.
- Compuerta de higiene sobre `ForWhom.astro`, `Faq.astro` e `index.astro`: 0 coincidencias. `git diff` sobre `copy.test.mjs`: 0 líneas eliminadas; sobre `a11y-base.spec.ts`: 0 menciones de `FALTA CONFIRMAR` o `checkTexts`. Ninguna eliminación en el commit.

## Pendiente exacto (para el ejecutor siguiente)

### Tarea 3: `#agenda`, footer completo y `/privacidad` endurecida (28k estimados)

Titular `agenda.title` = '¿Listo para que te encuentren cuando te estan buscando?' (errata 'estan' tal cual), clase `.section-title`, `AgendaCollage` (raíz `div[data-collage="agenda"]`) en `.agenda-copy` tras `.agenda-fallback` con contenedor `aria-hidden` visible solo desde 64em, sin `CtaLink` en `#agenda`; footer con `<Logo name href tone="light" variant="horizontal">` (sin `href` en `/`), bloques de contacto y redes (`footer.contact_label`, `social_label`, `email`, `social`, pending), correo con `mailto:` solo si pasa una expresión estricta (prueba con valor inyectado en una copia temporal del YAML), rejilla de 1, 2 y 3 columnas; cierre del orden de tabulación (enlace de privacidad tras el iframe), lote E06 en `02-VISUAL-LOG.md` (`impeccable` layout, colorize, harden) y nota manual del `<summary>` con VoiceOver ya anotada en el lote D06 (repetirla en el cierre si sigue pendiente). Después: estado final (advance-plan, update-progress, roadmap 02, requirements.mark-complete con CONT-10 a CONT-13, COPY-01, DSGN-04), verificación manual de ROADMAP.md y STATE.md (02-06 `[x]`, tabla 9/11, `Plan:` en 02-07, `stopped_at` y `Resume file` en 02-07-PLAN.md). Recalcular `commits` con `git rev-list --count 44cf69fe091d5313d68c72288b6d64aedf4ce050..HEAD` y pasar el `status` a `complete`.

Al cerrar, la orden del orquestador sigue vigente: si la Tarea 3 agrega texto, el HTML pasa por los topes nuevos (81920 crudos y 25600 con gzip); si los pusiera en riesgo, detenerse y reportar.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Bloqueo, autorizado por el orquestador] Tope de HTML de 61440 a 81920 bytes crudos con 25600 con gzip**
- **Found during:** Tarea 2, `npm run build` tras montar Para quién es y FAQ.
- **Issue:** `dist/index.html` pasó de 58565 a **65581 bytes crudos** (por encima de 61440) con el contenido de Ari sin recortar; medido con `gzip -9`: **12493 bytes**. El tope de 61440 es un presupuesto propio sin comprimir; el peso transferido es de 12.5 KB.
- **Fix:** subir las guardas que lo afirman a 81920 bytes crudos con la condición dura adicional de 25600 bytes con gzip nivel 9 (medición con `node:zlib`, equivalente a `gzip -9 -c dist/index.html | wc -c`). No se tocó ningún otro tope (el del sprite de 10240 y el de 20480 caracteres de texto siguen igual).
- **Guardas tocadas (4):** `tests/guards/brand-assets.test.mjs` (`dist/index.html trae un solo sprite, pesa menos de 80 KB (25 KB con gzip)...`, cambió el nombre y la cifra), `tests/e2e/page-structure.spec.ts` (`el HTML de / pesa menos de 80 KB sin comprimir y 25 KB con gzip`, 80 * 1024 = 81920), `tests/e2e/results-cases.spec.ts` (prueba (o)) y `tests/e2e/team-includes-how.spec.ts` (aserto final de la prueba de tope de texto). `page-structure.spec.ts` está en la lista de "no tocar" del criterio de aceptación de la tarea; se editó solo por esta autorización explícita.
- **Files modified:** los cuatro anteriores.
- **Commit:** f2554c8.
- **Aviso para Juan:** los topes 61440 crudos del UI-SPEC y de 02-CONTEXT quedan superados por decisión del orquestador; el peso con gzip es la métrica que importa para el rendimiento real.

**2. [Rule 1 - Bug de prueba de otro plan, reportado y no editado] `textos de Ari visibles (k)` de 02-03 falla por las respuestas del FAQ cerradas**
- **Found during:** Tarea 2, suite completa de Playwright.
- **Issue:** las dos pruebas `(k) con JavaScript activado` y `(k) sin JavaScript ... los tres textos se ven tal cual` de `tests/e2e/a11y-base.spec.ts` (`checkTexts`, líneas 468 a 470) esperan 33 apariciones de 'FALTA CONFIRMAR' en `document.body.innerText` y reciben 27. La diferencia de 6 son las respuestas de `faq.items[*].answer`: viven dentro de `<details>` cerrados y `innerText` no incluye el contenido de un `<details>` cerrado. El aserto deriva de `VISIBLE_MARKS`, que cuenta todas las reclamaciones con la marca fuera de `privacy.`.
- **Decisión:** el plan prohíbe editar ese bloque (es de 02-03); no se tocó. Es el aserto que el plan pide anotar para el coordinador.
- **Arreglo propuesto (para el coordinador o 02-03):** excluir de `VISIBLE_MARKS` las rutas `faq.items[N].answer` (por ejemplo `&& !/^faq\.items\[\d+\]\.answer$/.test(n.path)`), o abrir los `<details>` antes de leer `innerText`. Son 2 pruebas, no hay otro fallo en la suite.

Ninguna otra desviación: el resto de la Tarea 2 se ejecutó como estaba escrita (el máximo de `tabUntilIframe` es 24, como pide el plan).

## Auth gates

Ninguno.

## Known Stubs

Todos los textos de `for_whom`, `faq` y `privacy.body` son 'FALTA CONFIRMAR' `pending` por diseño (COPY-01: el doc de Ari no trae esas secciones); están en `PENDING-COPY.md` y los resuelve Ari, no un plan futuro. Son marcas visibles, no datos simulados.

## Threat Flags

Ninguno: no se agregaron endpoints, rutas de autenticación ni acceso a archivos. La guarda INVERSION es una mitigación del hallazgo 6 (no publicar cifras de inversión sin aprobación).

## Notas para Ari (acumuladas)

- Erratas del doc (se reportan, no se corrigen): 'estan' en el titular del CTA final (Tarea 3).
- Afirmaciones nuevas pending: `privacy.body[0]` (texto legal de la política de privacidad); `for_whom.title`, los dos nombres de columna (tomados de CONTEXT), seis ítems (el primero de la columna "es" debe comunicar el perfil de USD 200k o más al año) y `faq.title` con seis preguntas y seis respuestas (temas: qué es GEO, duración de la llamada, qué preparar, inversión, tiempos de resultados y si aplica a mi negocio).
- Por favor no incluir rangos ni cifras de inversión mensual (4 a 5k al mes, 1.5k al mes, +1500 al mes) en esos textos sin aprobarlos por escrito: la guarda INVERSION bloquea el build de producción mientras estén `pending`. Si Ari decide publicarlos, pasan a `verified` y la guarda deja de marcarlos.
- La respuesta sobre la duración de la llamada debe coincidir con `call.duration` (hoy `pending`, con la contradicción de 20 y 30 minutos ya anotada).

## Notas para la fase 3

- Excluir `/privacidad/` del sitemap mientras siga `noindex` (`sitemap({ filter })` en `astro.config.mjs`): el build de producción de la Tarea 1 lo incluye en `sitemap-0.xml`.
- Quitar `noindex` de `privacidad.astro` cuando exista el texto legal.
- Prueba manual pendiente del `<summary>` del FAQ con VoiceOver (Safari) y NVDA o TalkBack.
