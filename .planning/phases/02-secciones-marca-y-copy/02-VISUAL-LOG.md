# Fase 2: registro visual (impeccable y design-taste-frontend)

Plan 02-01. Regla de Juan: todo trabajo de diseño web pasa por las skills `impeccable` y `design-taste-frontend`, invocadas con la herramienta Skill. Orden de mando (UI-SPEC, Design Method): primero el contrato del UI-SPEC y A11Y.md, luego las skills, que afinan dentro del contrato y no lo rompen.

Protocolo por lote: (1) construir el lote completo desde el contrato; (2) una ronda de capturas en lote con `PHASE2_BATCH=<lote>` (`test-results/phase2/<lote>-<ancho>[-reduce|-nojs].png`, no versionadas), a 320, 390, 768, 1024 y 1280 px con ClickUp bloqueado; (3) `critique` contra el contrato de la sección, la fila de la síntesis de referencias y la lista de "vibra"; (4) corregir todo en un lote, con una ronda de confirmación como máximo; (5) registrar aquí.

## Lote 0, ronda 0

- **Skills invocadas:** `impeccable` (context, luego el verbo `init`) y `design-taste-frontend`.
- **`impeccable context`:** sin PRODUCT.md ni DESIGN.md previos; implementación visual incumbente (Fase 1). Modo: Persuade (landing de captación).
- **`init`:** no hubo entrevista en vivo porque el ejecutor corre sin una persona que responda en esta sesión. Se generó `PRODUCT.md` en la raíz solo con hechos ya aprobados por Juan (`.planning/PROJECT.md`, `02-CONTEXT.md`, `02-UI-SPEC.md`, `.claude/CLAUDE.md`), y el archivo lo declara en su cabecera. No se dejó ninguna decisión visual dentro de PRODUCT.md.
- **Lectura de diseño (design-taste-frontend):** landing de captación B2B para dueños de e-commerce, lenguaje collage pop de marca, con reglas de accesibilidad que mandan sobre la estética. Diales: DESIGN_VARIANCE 7, MOTION_INTENSITY 3, VISUAL_DENSITY 4. Sin degradados, sin vidrio, sin animaciones infinitas.
- **Conflictos resueltos a favor del contrato:** la skill desaconseja SVG dibujados a mano y exige generar imágenes; el UI-SPEC (Collage and Brand Assets Contract) fija el collage como SVG en línea de marca, sin peticiones, así que manda el contrato. La skill pide modo claro y oscuro; el contrato fija cuatro tonos de superficie por sección y A11Y.md, así que no se agrega un tema oscuro del sistema. La skill prohíbe el guion largo: el copy de Ari no se toca (regla del proyecto) y ningún texto propio de este plan lo usa.
- **Capturas:** ninguna (sin UI todavía).

## Lote 0, ronda 1

- **Skills invocadas:** `impeccable` (context, luego `document`, `typeset` y `colorize` aplicados al `tokens.css` real) y `design-taste-frontend` (diales 7, 3 y 4). El contrato del UI-SPEC manda sobre ambas.
- **Construido:** tonos `yellow` y `dark` completos, `--heading`, `--bar`, `--mark`, `--pop-shadow-color` y `--collage-stroke` por tono, escala Title (`--text-title`), `--card-pad`, `--card-gap`, `--radius-card`; `h3`, `.section-title` (barra de 48x8 px) y `section[id]` en `global.css`; `SectionShell` y `CtaLink` con cuatro ubicaciones, prop `href` y sombra por tono. Guarda de contraste con cuatro tonos, 11 pares aprobados y pares por tono (`--heading`, `--bar`, `--collage-stroke`), probada por mutación.
- **Medición** (página temporal `tone-smoke.astro`, borrada antes del commit; script ad hoc de Playwright fuera del repositorio, a 1280 px, ClickUp bloqueado):

| Tono | h2 | Barra (48x8 px) | Anillo de foco (3 px, sólido) | CTA (relleno / sombra) |
|------|----|-----------------|-------------------------------|------------------------|
| `light` | `rgb(115, 24, 127)` | `rgb(115, 24, 127)` | `rgb(115, 24, 127)` | naranja / oscuro |
| `yellow` | `rgb(115, 24, 127)` | `rgb(33, 33, 33)` | `rgb(33, 33, 33)` | naranja / oscuro |
| `dark` | `rgb(255, 255, 255)` | `rgb(253, 105, 56)` | `rgb(255, 198, 2)` | amarillo / naranja |
| `purple` | `rgb(255, 255, 255)` | `rgb(255, 198, 2)` | `rgb(255, 198, 2)` | amarillo / oscuro |

  Padding vertical de las cuatro secciones a 1280 px: 96 px arriba y abajo. Alto del CTA: 50.7 px (mínimo 48 px).
- **Capturas:** `test-results/phase2/0-390.png` y `test-results/phase2/0-1280.png` (no versionadas). Se miraron ambas.
- **Hallazgos (critique del lote contra el contrato):** ninguno que rompa el contrato. Se anota como observación que sobre `dark` la sombra naranja del CTA amarillo es sutil; el UI-SPEC la fija como decorativa (el relleno amarillo sobre oscuro mide 10.22 y define la forma), así que no se cambia. La tarjeta blanca sobre `dark` se distingue por relleno (16.10), sin borde, como manda el contrato.
- **Correcciones:** ninguna; no hizo falta segunda ronda.
- **Conflictos resueltos a favor del contrato:** la skill de gusto pide un tema único de página (Page Theme Lock) y `impeccable` desaconseja la sombra dura fuera de un mundo neobrutalista. El brandbook y el UI-SPEC fijan cuatro tonos alternados y la sombra dura de 4 px como rasgo de marca (ya presente en la Fase 1), y Juan aprobó ambos. Se mantienen.
- **`document`:** sin entrevista en vivo (mismo motivo que `init`). `DESIGN.md` describe lo extraído de los tokens y las decisiones ya aprobadas; no se generó el archivo lateral de tokens. Si Juan quiere afinar el lenguaje cualitativo, se corre `/impeccable document` de nuevo.

## Lote A, ronda 1

- **Skills invocadas:** `impeccable` (context y `critique` del lote; verbos del lote `shape`, `layout`, `typeset`, `colorize` y `adapt`, sin `animate`: el plan 07 anima la entrada) y `design-taste-frontend` (lectura de diseño: landing de captación B2B para dueños de e-commerce, collage pop de marca, accesibilidad por encima de la estética; diales 7, 3 y 4; sin degradados, sin vidrio, sin animaciones infinitas). El contrato del UI-SPEC manda sobre ambas.
- **Construido desde el contrato:** `Hero.astro` en rejilla (`minmax(0, 7fr) minmax(0, 5fr)` desde 64em, una columna antes; collage de 240 px de alto en A y 320 px en B) y `src/components/collage/HeroCollage.astro` (SVG en línea, seis piezas `loops`, `lupa`, `ojos`, `clic-a`, `clic-b`, `destellos` con `--i`, `--r` y `--r-from`, solo tokens de color, sin texto ni `title`). Sin movimiento: `document.getAnimations().length` es 0 y la opacidad del h1, el subtítulo y el CTA es 1 con `reduce` y con `no-preference`.
- **Capturas:** `PHASE2_BATCH=A`, 15 archivos en `test-results/phase2/A-{320,390,768,1024,1280}[-reduce|-nojs].png` (no versionadas), ClickUp bloqueado. Se miraron 390 y 1280 px; 320 (nota abajo), 768 y 1024 px se comprobaron con las mediciones del spec (sin desborde, `.hero-art` sin cruce con `.hero-copy`).
- **Hallazgos del `critique` (ronda de captura 1):**
  1. La lupa se leía como un huevo frito o una diana: tres aros concéntricos alrededor de la lente, disco amarillo dentro y el mango escondido bajo los aros. Rasgo 7 (un foco claro): incumplido.
  2. Ojos, clics y destellos quedaban pequeños frente al conjunto: la composición ocupaba menos de dos tercios del `viewBox`.
  3. El parche de puntos terminaba con un corte a mitad de punto en el borde.
  4. Sin hallazgos de estructura: h1 morado a 64 px y peso 700, CTA y collage completos en el primer pantallazo a 1280x800, collage a la derecha del texto, sin desborde en los cinco anchos.
- **Correcciones (un solo lote):** aros desplazados hacia arriba a la derecha y detrás de la lente; lente en dos capas (aro morado y cristal blanco con un brillo en arco) sin el disco amarillo; mango oscuro largo que sale de los aros; ojos a 1,4 de escala, sobre la lente; clics a 1,5 de escala apuntando al cristal, uno morado y otro blanco; destellos de 28 px; parche de puntos alineado a la cuadrícula del patrón (`x`, `y`, ancho y alto múltiplos de 18).
- **Ronda de confirmación (1 de 1):** 91 pruebas de Playwright pasan (`page-structure`, `a11y-base`, `cta-focus`) y las 15 capturas se regeneraron. Se miraron 1280 y 390 px otra vez: la lupa se lee como lupa, los ojos miran hacia el CTA y todo cabe en el primer pantallazo.
- **Lista de vibra:** rasgo 1 cumplido en el hero (titular enorme en negrita, un solo pill dominante y collage a la derecha, todo visible en 1280x800). Rasgo 7 cumplido para el hero (un foco claro y un collage propio, no se lee como plantilla). Los demás rasgos corresponden a secciones de planes posteriores.
- **Nota de 320 px (comprobación de respaldo):** se revisó `A-320.png`. El collage queda a 240 px de alto centrado bajo la descripción, sin desborde ni cruce con el texto. Con 320 px el texto del CTA se parte en dos líneas dentro del pill (reflujo permitido por A11Y.md, sin altura fija ni recorte). Es el CTA de la fase 1 y no se tocó.
- **Conflicto resuelto a favor del contrato:** `design-taste-frontend` desaconseja SVG dibujados a mano y pide generar imágenes; el UI-SPEC fija el collage como SVG en línea de marca sin peticiones ni raster. Manda el contrato. La skill también pide evitar el morado de IA; aquí el morado es el color de marca.

## Lote B, ronda 0

- **Plan 02-03.** Secciones El problema (dark), Por qué ahora (yellow) y La solución (light).
- **Skills invocadas:** `impeccable` (context y verbo `shape`; no se repiten `init` ni `document`, son del plan 01) y `design-taste-frontend`. El contrato del UI-SPEC y A11Y.md mandan sobre ambas.
- **Lectura de diseño (design-taste-frontend):** landing de captación B2B para dueños de e-commerce, lenguaje collage pop de marca, con reglas de accesibilidad que mandan sobre la estética. Diales: DESIGN_VARIANCE 7, MOTION_INTENSITY 3, VISUAL_DENSITY 4. Sin degradados, sin vidrio, sin sombras difusas, sin animaciones infinitas.
- **Brief de `shape` (foco de cada sección):** El problema es reconocerse (tres dolores en tarjetas blancas sobre fondo oscuro, con la frase de cierre debajo); Por qué ahora es el cambio de la búsqueda (frases cortas con reglas de 3 px y un collage compacto de lupa y ojos); La solución es qué hace el equipo (cuatro pilares con chip propio y el CTA al final).
- **Verbos usados hasta aquí:** `shape`. Esta ronda es el tracer: las tres secciones con el copy completo, esquema, guardas y CTA, sin tarjetas ni collage (tareas 2 y 3).
- **Conflictos resueltos a favor del contrato:** la skill de gusto desaconseja tres tarjetas iguales y el UI-SPEC fija tres dolores en tres columnas iguales; se varía por pegatina y numeral. La skill prohíbe el guion largo y el copy de Ari no se edita (regla del proyecto).
- **Capturas:** ninguna todavía.
