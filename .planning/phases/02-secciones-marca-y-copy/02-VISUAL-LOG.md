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
