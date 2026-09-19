import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
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
  z.url().refine(
    (value) => {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === host;
    },
    { message: `debe ser una URL https://${host}/...` },
  );

const landing = defineCollection({
  // El `file()` de Astro 7 detecta YAML por la extensión. La clave superior
  // `es` es el id de la entrada (formato de objeto con id como clave).
  loader: file('src/content/landing.es.yaml'),
  schema: z.strictObject({
    brand: z.strictObject({ name: claim, term: claim }),
    call: z.strictObject({ duration: claim }),
    cta: z.strictObject({ label_template: claim }),
    skip: z.strictObject({ nav_label: claim, content: claim, form: claim }),
    meta: z.strictObject({ title_template: claim }),
    hero: z.strictObject({ h1: claim, subtitle: claim }),
    agenda: z.strictObject({
      title: claim,
      intro: claim,
      fallback_lead: claim,
      fallback_link: claim,
      iframe_title: claim,
      noscript: claim,
    }),
    config: z.strictObject({
      form_url: httpsUrlFrom('forms.clickup.com'),
      form_script_src: httpsUrlFrom('app-cdn.clickup.com'),
    }),
  }),
});

export const collections = { landing };
