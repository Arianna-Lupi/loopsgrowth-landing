# Páginas por país (`/agencia-seo/<pais>/`): plantilla y datos que faltan

Estado: BORRADOR para Ari. La plantilla está implementada y no genera ninguna página, porque hoy no existe contenido único y verdadero para ningún país.
Fecha: 2026-11-16.

## Cómo funciona

- Un archivo `src/content/paises/<pais>.yaml` por país. Sin archivo no hay página, y sin país publicado tampoco hay hub `/agencia-seo/`.
- Campos obligatorios: `nombre`, `title`, `description`, `h1`, `intro` (250 caracteres o más), `secciones` (mínimo 3, de 350 caracteres o más cada una) y `hechos` (mínimo 3, cada uno con fuente https).
- `draft` nace en `true`. Para publicar hace falta `draft: false` y `reviewedBy` con la aprobación de Ari.
- El texto compartido entre países vive en `src/lib/pais-template.json` y se mantiene corto (tres frases).
- Autocanonical y breadcrumbs en cada página. Schema: BreadcrumbList y Service con `areaServed` del país. Nunca LocalBusiness ni dirección.
- Sitemap: solo páginas publicadas. Un país en borrador sale `noindex` y no entra en producción.

## Guarda `npm run check:programmatic` (corre en `prebuild`)

Bloquea una página publicable si:

- Tiene menos de 30 % de contenido único (avisa bajo 40 %), medido por frases de 5 palabras contra las otras páginas y contra el texto de plantilla.
- Tiene menos de 300 palabras, menos de 3 secciones o menos de 3 hechos.
- Menciona precios, garantía, oficina, dirección, reseñas, testimonios o "casos de éxito", o trae rayas o marcas de faltante.
- Una fuente no es https, no tiene `reviewedBy` o hay más de 14 páginas.

Un borrador solo avisa, excepto por precios, oficina, reseñas, rayas y fuentes inválidas, que bloquean siempre.

## Lo que sale de Ari por cada país

Sin esto no se escribe la página. Ninguna fila se rellena por inferencia.

| Dato | Para qué | Estado |
| --- | --- | --- |
| Si Loops atiende negocios de ese país y desde dónde (se trabaja de forma remota) | Frase de servicio de la plantilla | Pendiente. Ari dijo "sin presencia en ningún país" |
| Sectores o tipos de negocio de ese país que ya atendió | Secciones propias | Pendiente |
| Particularidades del mercado que ella conozca (cómo busca la gente, plataformas, pagos, regulación) con fuente | Hechos con fuente | Pendiente |
| Si hay un caso real y permiso para citarlo | Sección de ejemplo | Pendiente. Hasta entonces, ninguno |

Lote 1 (decidido por Juan, 2026-11-16): hub, Venezuela (ancla), Colombia, Chile y México. Argentina y Perú quedan fuera. No se genera ninguna página hasta que Ari entregue los datos de cada país.

## Pendiente de decisión

- La frase compartida "Loops Growth ofrece SEO y GEO para negocios de {pais}" necesita aprobación de Ari.
- Decidido: la URL de Venezuela es `/agencia-seo/venezuela/` y México entra al lote 1.
- La etiqueta "Blog" del pie la confirmó Ari por mensaje relayado. En `landing.es.yaml` sigue `pending` hasta que ella la apruebe en el doc, para no marcar `verified` sin fuente directa.
