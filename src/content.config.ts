import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Una afirmación del copy. `status` no tiene valor por defecto: si falta,
 * o si trae otro valor que `verified` o `pending`, el build falla.
 * `confirm_by` y `reason` son metadatos para la lista de pendientes
 * (Plan 02) y nunca se renderizan. Ninguna otra clave está permitida.
 */
const claim = z.strictObject({
  text: z.string().min(1),
  status: z.enum(['verified', 'pending']),
  confirm_by: z.string().min(1).optional(),
  reason: z.string().min(1).optional(),
});

/**
 * URL https cuyo host es exactamente `host`. `form_script_src` se emite como `<script src>` y el
 * YAML lo edita el equipo (incluso desde la web de GitHub): `z.url()` solo aceptaría también
 * `javascript:`, `data:` o `http:`. Origen fijo por 01-UI-SPEC (ClickUp); si cambia de proveedor,
 * se actualiza aquí a propósito.
 */
const httpsUrlFrom = (host: string) =>
  // Zod valida protocolo y host dentro del propio `z.url()`: si el valor no es una URL ("nota url",
  // vacío), falla con un error de Zod que trae la ruta del campo. Un `.refine()` con `new URL()`
  // lanzaría `TypeError: Invalid URL` sin campo, porque en Zod 4 el refine también corre tras un fallo.
  z.url({
    protocol: /^https$/,
    hostname: new RegExp(`^${host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
    error: `debe ser una URL https://${host}/...`,
  });

const landing = defineCollection({
  // El `file()` de Astro 7 detecta YAML por la extensión. La clave superior
  // `es` es el id de la entrada (formato de objeto con id como clave).
  loader: file('src/content/landing.es.yaml'),
  schema: z.strictObject({
    brand: z.strictObject({ name: claim, term: claim }),
    call: z.strictObject({ duration: claim }),
    cta: z.strictObject({ label_template: claim }),
    skip: z.strictObject({ nav_label: claim, content: claim, form: claim }),
    meta: z.strictObject({
      title_template: claim,
      description: claim.optional(),
    }),
    hero: z.strictObject({
      h1: claim,
      subtitle: claim,
      description: z.array(claim).min(1),
      // Clientes del hero (quick 260920-hero-clients): 12 exactos. Cada logo sale
      // de src/assets/clients/<id>.webp y su procedencia de src/assets/clients/PROVENANCE.md.
      clients: z.strictObject({ label: claim, items: z.array(claim).length(12) }),
    }),
    // Las cantidades fijas las impone el esquema: 3 dolores y 4 pilares. `why_now.items` admite 1 o más.
    problem: z.strictObject({
      title: claim,
      subtitle: claim.optional(),
      items: z.array(claim).length(3),
      closing: claim,
    }),
    why_now: z.strictObject({ title: claim, items: z.array(claim).min(1) }),
    solution: z.strictObject({
      title: claim,
      lead: claim,
      items: z
        .array(z.strictObject({ title: claim, body: claim, list: z.array(claim).min(1).optional() }))
        .length(4),
    }),
    // Cuatro resultados exactos: el layout 2x2 depende del conteo.
    results: z.strictObject({
      title: claim,
      items: z.array(z.strictObject({ lead: claim, body: claim })).length(4),
    }),
    // Cinco casos exactos: la rejilla de 3 columnas con la quinta ancha depende del conteo. `detail` es
    // opcional porque el caso de Meta Ads no trae línea de detalle en el doc.
    cases: z.strictObject({
      title: claim,
      labels: z.strictObject({ sector: claim, period: claim, channel: claim.optional() }),
      items: z
        .array(
          z.strictObject({
            figure: claim,
            metric: claim,
            detail: claim.optional(),
            sector: claim,
            period: claim,
            channel: claim.optional(),
            pill: claim.optional(),
          }),
        )
        .length(4),
    }),
    // Cuatro integrantes exactos: la rejilla de 1, 2 y 4 columnas depende del conteo. La introducción presenta al
    // equipo. Las tarjetas con `link` son enlaces completos, con URL https y un complemento solo para lectores.
    team: z.strictObject({
      title: claim,
      intro: claim,
      members: z
        .array(
          z.strictObject({
            name: claim,
            role: claim,
            insights: z.array(claim).optional(),
            link: z
              .strictObject({
                url: claim.extend({ text: z.url({ protocol: /^https$/, error: 'debe ser una URL https://...' }) }),
                label: claim,
                hint: claim,
              })
              .optional(),
          }),

        )
        .length(4),
    }),
    // Seis entregables y cuatro fases exactos: las rejillas de 1, 2 y 3 columnas y la lista de fases dependen del conteo.
    includes: z.strictObject({
      title: claim,
      items: z.array(z.strictObject({ title: claim, description: claim })).length(6),
    }),
    how_it_works: z.strictObject({
      title: claim,
      steps: z.array(z.strictObject({ title: claim, description: claim, timeframe: claim })).length(4),
    }),
    // Para quién es (plan 02-06): dos columnas de al menos una afirmación. El doc de Ari no trae la sección: los
    // textos salen pending. La guarda INVERSION (scripts/lib/copy-rules.mjs) vigila las cifras de inversión.
    for_whom: z.strictObject({
      title: claim,
      is_for: z.strictObject({ title: claim, items: z.array(claim).min(1) }),
      is_not_for: z.strictObject({ title: claim, items: z.array(claim).min(1) }),
    }),
    // FAQ (plan 02-06): preguntas con su respuesta, en `<details>` nativos.
    faq: z.strictObject({
      title: claim,
      items: z.array(z.strictObject({ question: claim, answer: claim })).min(5).max(10),
    }),
    agenda: z.strictObject({
      title: claim,
      intro: claim,
      fallback_lead: claim,
      fallback_link: claim,
      noscript: claim,
      form: z.strictObject({
        required_note: claim,
        select_placeholder: claim,
        submit: claim,
        next: claim,
        back: claim,
        step_word: claim,
        step_of: claim,
        step_contact: claim,
        step_business: claim,
        sending: claim,
        error_required: claim,
        error_email: claim,
        error_summary: claim,
        error_send: claim,
        success_title: claim,
        success_body: claim,
        labels: z.strictObject({
          name: claim, email: claim, company: claim, website: claim, sector: claim,
          country: claim, structure: claim, revenue: claim, doingSeo: claim, budget: claim, source: claim,
        }),
      }),
    }),
    // Pie de página y política de privacidad (plan 02-06). El cuerpo de la política es una lista de
    // afirmaciones: un `<p>` por elemento. Correo y redes del pie son pendientes de Ari.
    footer: z.strictObject({
      nav_label: claim,
      privacy_link: claim,
      blog_link: claim,
      contact_label: claim,
      email: claim,
      social_label: claim,
      social: claim,
    }),
    privacy: z.strictObject({ title: claim, body: z.array(claim).min(1) }),
    config: z.strictObject({
      form_url: httpsUrlFrom('forms.clickup.com'),
    }),
  }),
});

/**
 * Blog (milestone SEO). Los artículos viven en `src/content/blog/*.md`. Reglas duras de Ari:
 * sin precios ni garantía, sin casos ni reseñas inventados, firma y revisa Ari.
 * `draft` nace en `true`: un borrador no se publica en producción (ni ruta, ni sitemap, ni lista).
 * `reviewedBy` queda vacío hasta que Ari apruebe por escrito; sin eso `draft` no puede pasar a `false`.
 * `cluster` y `intent` salen de `clusters.md` y fijan la regla "una frase, una página".
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/blog' }),
  schema: z
    .strictObject({
      title: z.string().min(10).max(70),
      description: z.string().min(70).max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.enum(['ari']).default('ari'),
      cluster: z.enum(['L2-geo', 'L4-eleccion', 'L6-fundamentos']),
      keyword: z.string().min(3),
      draft: z.boolean().default(true),
      reviewedBy: z.string().min(1).optional(),
      related: z.array(z.string()).max(3).default([]),
    })
    .refine((d) => d.draft || d.reviewedBy, {
      message: 'Un artículo con draft: false necesita reviewedBy (aprobación escrita de Ari).',
      path: ['reviewedBy'],
    }),
});

/**
 * Páginas de país (SEO programático, `/agencia-seo/<pais>/`). Un archivo YAML por país en
 * `src/content/paises/`. Sin archivo no hay página: solo se genera un país con contenido único y verdadero.
 * Cada `hecho` lleva su fuente https; no se admiten precios, direcciones, oficinas ni reseñas
 * (los vigila `scripts/check-programmatic.mjs`, que corre en `prebuild`).
 */
const pais = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/paises' }),
  schema: z
    .strictObject({
      nombre: z.string().min(3),
      draft: z.boolean().default(true),
      reviewedBy: z.string().min(1).optional(),
      title: z.string().min(10).max(70),
      description: z.string().min(70).max(160),
      h1: z.string().min(10),
      intro: z.string().min(250),
      secciones: z.array(z.strictObject({ titulo: z.string().min(5), cuerpo: z.string().min(350) })).min(3),
      hechos: z.array(z.strictObject({ dato: z.string().min(20), fuente: z.url({ protocol: /^https$/ }) })).min(3),
    })
    .refine((d) => d.draft || d.reviewedBy, { message: 'Publicar un país requiere reviewedBy (Ari).', path: ['reviewedBy'] }),
});

export const collections = { landing, blog, pais };
