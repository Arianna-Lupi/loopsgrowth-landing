# Medición del formulario de ClickUp (FORM-04)

Fecha de la medición: 2026-09-19 (03:01 UTC, 2026-09-18 22:01 hora local).
Navegador: Chromium 153.0.8010.12 (el de `@playwright/test`), alto de ventana de 900 px, contra `astro preview` del build de producción.
Formulario: `https://forms.clickup.com/90131720021/f/2ky49tun-19253/DATFKMESVSMXZY5CO5`.
Spec: `tests/e2e/form-measure.spec.ts` (solo lectura). Evidencia no versionada: `test-results/form-measure.json`.

## Cómo se midió

El formulario de ClickUp usa `height: 100%` y un contenedor interno con scroll (`cu-form`, `overflow: auto`). Por eso el script `forms-embed/v1.js` (iframe-resizer) solo reporta la altura que el iframe ya tiene (su `min-height` o los 150 px por defecto) y nunca la del contenido. Leer `style.height` con la reserva puesta devuelve siempre la propia reserva, así que esa medida es circular (ver "Desviación" más abajo).

La altura real se mide en una fase "natural": la página se abre con el `min-height` del iframe anulado (solo en nuestra página, sin tocar el formulario) y se lee el `scrollHeight` de `cu-form`, que es el alto del contenido completo, incluido el relleno inferior de 80 px que pone ClickUp. Después se abre la página tal como se publica (con los tokens) para medir el CLS, el alto renderizado y si queda scroll interno.

Regla de cálculo de los tokens: `(floor(max / 8) + 1) * 8`, con `max` la mayor altura natural de su rango. `--form-min-h-sm` (menos de 1024 px) cubre 320, 390 y 768 px; `--form-min-h-lg` (desde 1024 px) cubre 1024 y 1280 px.

## Tabla de medición

| Ancho de ventana | Ancho de la tarjeta `.form-embed` | Altura natural del formulario | `min-height` vigente (tokens medidos) | Scroll interno con la reserva | CLS |
|---|---|---|---|---|---|
| 320 px | 288 px | 1659 px | 1664 px (`sm`) | 0 px | 0 |
| 390 px | 358 px | 1555 px | 1664 px (`sm`) | 0 px | 0 |
| 768 px | 707 px | 1534 px | 1664 px (`sm`) | 0 px | 0 |
| 1024 px | 532 px | 1534 px | 1536 px (`lg`) | 0 px | 0 |
| 1280 px | 607 px | 1534 px | 1536 px (`lg`) | 0 px | 0 |

## Tokens elegidos

- `--form-min-h-sm: 1664px` (máximo del rango: 1659 px a 320 px; `floor(1659 / 8) = 207`, `(207 + 1) * 8 = 1664`).
- `--form-min-h-lg: 1536px` (máximo del rango: 1534 px a 1024 y 1280 px; `floor(1534 / 8) = 191`, `(191 + 1) * 8 = 1536`).
- Ninguno se queda en los valores iniciales de 1100 px y 900 px: la medición no los confirma.

Corrida con los valores iniciales (1100 y 900 px), guardada como evidencia de que el spec detecta una reserva mal medida: falló la aserción de reserva (`--form-min-h-sm: a 320 px el formulario (1659) excede la reserva (1100) en más de 8 px`) y no la de auto-resize ni la de campos visibles. Con esa reserva el formulario quedaba con scroll interno de 559 px (320), 455 px (390), 434 px (768) y 634 px (1024 y 1280 px): un visitante habría visto el formulario cortado y una región con scroll dentro del iframe.

## Hueco bajo el botón de enviar

La reserva es la misma en todo el rango, así que en los anchos más cómodos sobra espacio bajo el formulario:

| Ancho | Sobrante bajo el contenido |
|---|---|
| 320 px | 5 px |
| 390 px | 109 px |
| 768 px | 130 px |
| 1024 y 1280 px | 2 px |

A 390 px el sobrante es de 109 px, más los 80 px de relleno que ClickUp deja bajo el botón. El plan pide un solo token por rango (máximo del rango), y una reserva por debajo de 1659 px dejaría scroll interno a 320 px, que es peor que un hueco. Si Juan quiere pulirlo, la opción es agregar un token intermedio (por ejemplo desde 480 px) medido a 390 y 768 px; queda como decisión de Juan y no se aplica aquí porque cambiaría la estructura de tokens que pidió el plan.

## Hallazgos para Ari

1. **El auto-resize de ClickUp no ajusta la altura al contenido con este formulario.** El script `forms-embed/v1.js` sí se engancha al iframe aun con `loading="lazy"` (deja un `style.height` en línea en los cinco anchos y se ve el mensaje `[iFrameResizerChild]Ready`), pero el formulario solo reporta la altura del propio iframe (150 px sin reserva, 4000 px si se le da 4000 px). El contenido real es de 1534 a 1659 px según el ancho. Por eso la landing reserva la altura medida (sin ella el formulario se queda con scroll interno). En la configuración para compartir el formulario en ClickUp existe la opción "Autosize embed height" (según la ayuda de ClickUp, activa por defecto): conviene que Ari verifique que esté activada. Si lo está, este comportamiento es del propio formulario y la reserva medida es la solución de la landing. Si ClickUp cambia el formulario, hay que volver a correr `npx playwright test tests/e2e/form-measure.spec.ts` y ajustar los dos tokens.
2. **Idioma.** El formulario declara `lang="en-US"` en su documento, pero las etiquetas visibles están en español (título "Servicios de SEO/AIO", "Nombre", "Correo electrónico", "Nombre de la compañía", "Sitio web", "País"). Quedan textos de ClickUp en inglés: el texto de ayuda "Apply with your full legal name." bajo el campo Nombre y el selector "Select". Esto no se corrige desde la landing (es contenido de ClickUp); Ari puede traducir el texto de ayuda en el editor del formulario. El lector de pantalla puede leer el formulario con la pronunciación en inglés por el `lang` del documento (registrar en `EXCEPTIONS.md` de la Fase 3).
3. **Terminología.** El título del formulario dice "Servicios de SEO/AIO" y la landing usa SEO/GEO por defecto: Ari decide cuál se muestra (ya está pendiente la confirmación de terminología del Bloqueo de la Fase 1).
4. **Campos ocultos `utm_*` (MEAS-02).** No se ven en el formulario y los crea Ari en ClickUp. Sin ellos, la medición se limita al conteo de tareas y al UTM del QR.
5. **Campos visibles.** 5 campos (`input`, `textarea` o `select`) visibles a todos los anchos medidos. La lista completa está en "Campos visibles del formulario".

## Desviación respecto al plan

El plan pedía medir la altura con el `style.height` que fija el script. Con este formulario esa lectura es circular (devuelve el `min-height` vigente: 1100/900 px al inicio, 1664/1536 px al final), así que no mide el formulario. Se corrigió midiendo el `scrollHeight` de `cu-form` con el iframe sin reserva y se agregó una aserción de que la reserva publicada no deja scroll interno. La aserción del plan de que el script fija un `style.height` no vacío se conserva (prueba que el script se engancha con carga diferida). Sobre la nota "el auto-resize funciona": se registra que el script se engancha pero que no sigue al contenido (hallazgo 1).
