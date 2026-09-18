# Phase 2: Secciones, marca y copy - Context

**Gathered:** 2026-09-18
**Status:** Ready for planning

<domain>
## Phase Boundary

La landing completa con las secciones del Copy v2 (Hero, El problema, Por qué ahora, La solución, Lo que logramos juntos, Casos de éxito, Quiénes somos, Qué incluye, Cómo funciona, Para quién es, FAQ, CTA final con formulario, Footer), con la identidad de marca aplicada (collage pop en SVG estático, logo e isotipo en SVG, paleta con guarda de contraste) y todo el texto en español neutro con la voz de marca, sin voseo ni guiones largos. Funciona de 320 px a 1280 px sin scroll horizontal y sin movimiento con `prefers-reduced-motion: reduce`. SEO, medición y QA final son de la fase 3.

</domain>

<decisions>
## Implementation Decisions

### Hero, header y orden de la página
- H1 con fórmula categoría + público + resultado, tomado tal cual del Copy v2 de Ari (sin humanizar ni reescribir).
- Header con logo SVG a la izquierda y un botón CTA a la derecha, sin menú y no fijo (evita tapar el foco, SC 2.4.11).
- Orden: Hero, El problema, Por qué ahora, La solución, Lo que logramos juntos, Casos de éxito, Quiénes somos, Qué incluye, Cómo funciona, Para quién es, FAQ, CTA final con formulario, Footer.
- Mismo texto de CTA "Agenda tu llamada de 30 minutos" en hero, tras La solución, tras Casos de éxito y en el CTA final, todos con `href="#agenda"`.

### Prueba social
- Las cifras `[VERIFICAR]` (rango 30% a 50% menos de presupuesto de ads, split Google vs IA en reportes) no se publican: se suavizan a texto cualitativo y quedan `pending` en el YAML hasta que Ari las respalde. El build de producción las bloquea (COPY-02).
- Casos de éxito como tarjetas de métrica (cifra grande, sector anonimizado, plazo y canal), sin logos ni fotos. El caso de Meta Ads (+500% tráfico, marca personal) va en su propia tarjeta.
- Equipo con avatar ilustrado SVG estático en estilo collage, nombre y cargo en texto real: Arianna Lupi (fundadora), Verónica Romero (directora de proyectos), Juan Angulo (director técnico), Miguel Pacheco (especialista SEO). Avatar con `aria-hidden="true"`.
- Si falta sector o plazo de un caso, se marca `pending`: en local se muestra con etiqueta visible de borrador y en producción no se muestra hasta que Ari confirme.

### Estilo visual, collage y movimiento
- Las referencias de Ari (m8l.com, skale.so, rankingonai.com) aportan ritmo de secciones y jerarquía de conversión; la identidad es la de Loops Growth. No se copian layouts.
- Fondos alternados blanco, amarillo `#ffc602` y oscuro `#212121`. Morado `#73187F` en títulos y texto sobre blanco o amarillo. Botón naranja `#fd6938` con texto oscuro. Se respeta la tabla de contraste (sin morado sobre oscuro, sin blanco sobre naranja, sin amarillo como texto sobre claro).
- Lupas, ojos y clics como SVG estático en línea con `aria-hidden="true"` y `focusable="false"`. Sin animación por defecto.
- Logo e isotipo en SVG con su área de salvado, tomados del Drive de Ari. Si falta el vectorial, se redibuja el isotipo Loopy y se marca para aprobación de Ari.

### Secciones informativas
- "Para quién es / para quién no": dos columnas. Comunica el perfil de USD 200k o más al año sin publicar rangos de inversión mensual que Ari no haya aprobado.
- "Cómo funciona": cuatro fases en lista ordenada `<ol>`, cada una con plazo. Plazos `pending` hasta que Ari confirme.
- FAQ de 5 a 6 preguntas con `<details>` nativo: qué es GEO, duración de la llamada, qué preparar, inversión, tiempos de resultados y si aplica a mi negocio. Preguntas y respuestas tomadas tal cual del doc de Ari; si el doc no trae alguna, se pide a Ari en vez de redactarla. Sin pregunta de garantía.
- Footer con contacto, redes y enlace a "Política de privacidad", que apunta a una página simple con texto de plantilla marcado `pending` para revisión de Ari.

### Claude's Discretion
Estructura de componentes, nombres de archivos, esquema exacto de las secciones en `landing.es.yaml`, composición de cada collage y detalles de espaciado y tipografía dentro de los tokens. Reglas de proyecto que aplican: diseño web por `impeccable` y `design-taste-frontend`; todo el texto sale tal cual del doc de Ari (fuente de verdad, sin humanizar ni reescribir; si falta un texto se pide a Ari, no se inventa); A11Y.md estricto.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Ninguno todavía: la fase 1 crea el scaffold Astro, `tokens.css`, `landing.es.yaml`, `check-copy.mjs`, `check-contrast.mjs` y el bloque del formulario en `#agenda`. Esta fase los reutiliza.

### Established Patterns
- Astro 7 + Tailwind 4 sin islas, contenido visible sin JS, copy en YAML con `{text, status}`, fuente tras `--font-brand`, foco `:focus-visible` de 2 px (decisiones de la fase 1).

### Integration Points
- El copy de las secciones se agrega a `landing.es.yaml` por sección y lo valida `check-copy.mjs`.
- Todos los CTA enlazan a `#agenda`, donde vive el formulario de ClickUp de la fase 1.

</code_context>

<specifics>
## Specific Ideas

**Regla de copy (cambio de Juan, 2026-09-18):** todos los textos ya están en el doc de Ari (https://docs.google.com/document/d/1QK61DPEQ3UbBQcCBnepwoaBesyZE1ZvZ6VfLgPrgtI0/edit?tab=t.nvl47nvdgyma). No se pasa nada por `humanizer` ni se reescribe. El guardián `check-copy.mjs` sigue corriendo: si el doc trae voseo, guion largo, `[VERIFICAR]` o "AEO", se reporta a Ari en lugar de editar el texto en silencio.

Referencias de diseño de Ari: m8l.com, skale.so y rankingonai.com. Fuentes del copy: Doc de proceso y copy https://docs.google.com/document/d/1QK61DPEQ3UbBQcCBnepwoaBesyZE1ZvZ6VfLgPrgtI0 y assets de marca en Drive https://drive.google.com/drive/folders/1byOfW_MgbJ5YrX8UY2uwgek2EyZsKlhe. Pendientes de Ari: duración de llamada (30 vs 20 min), unificar "SEO/GEO" vs "AEO", cifras `[VERIFICAR]`, sector y plazo de casos, plazos de las 4 fases y política de privacidad.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
