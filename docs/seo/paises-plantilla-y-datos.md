# Páginas por país (`/agencia-seo/<pais>/`): plantilla y datos que faltan

Estado: BORRADOR para Ari. La plantilla está implementada y no genera ninguna página, porque hoy no existe contenido único y verdadero para ningún país.
Fecha: 2026-11-16.

## Cómo funciona (actualizado el 2026-11-23, estrategia de Ari)

- URLs: país plano `/agencia-seo-<pais>/` y ciudad anidada `/agencia-seo-<pais>/<ciudad>/`. Sin hub `/agencia-seo/`.
- Un archivo `src/content/paises/<pais>.yaml` por país (`tipo: pais`) y `<pais>-<ciudad>.yaml` por ciudad (`tipo: ciudad`, `pais`, `ciudad`). Sin archivo no hay página. Una ciudad sin su país publicado no se genera ni se publica (regla HUERFANA).
- Campos: `nombre`, `title`, `description`, `h1`, `intro` (250 caracteres o más), `secciones` (mínimo 3, 350 caracteres o más cada una), `hechos` (cada uno con fuente https; la guarda exige 3 para publicar, los borradores pueden traer cero), `faq` y `pendientes` (nunca se muestra).
- `draft` nace en `true`. Para publicar hace falta `draft: false` y `reviewedBy` con la aprobación de Ari. En producción un borrador no se genera.
- Texto compartido entre páginas: `src/lib/pais-template.json`, tres frases.
- Schema: BreadcrumbList, Organization (areaServed VE y LATAM, sin address), Service con `areaServed` (Country o City) y FAQPage. Nunca LocalBusiness, dirección, mapa ni Google Business.
- Actualización 2026-11-24: Ari pidió Venezuela, México y Colombia (SEO) y México y Colombia en versión AEO. Se retira la condición de caso real para Colombia y se adelanta México. Siguen fuera Chile y cualquier otro país. Las páginas AEO viven en `/agencia-aeo-<pais>/` (archivo `aeo-<pais>.yaml`, `familia: aeo`) y no pueden repetir texto de su página SEO hermana.
- Publicación programada: cada página lleva `publishAt`; sale solo cuando `draft: false`, hay `reviewedBy` y la fecha llegó (cron diario). Calendario: `docs/seo/plan-contenido.md`.

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

Lote de diciembre: Venezuela (ancla) y Caracas. El resto, según la condición de arriba.
