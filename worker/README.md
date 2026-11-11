# Worker de leads (loopsgrowth-leads)

`POST loopsgrowth.com/api/lead` (JSON) crea la tarea en la Lista **Onboarding** de ClickUp (`901327450201`) y envía un email a `hello@loopsgrowth.com` con Resend. Basta con que uno de los dos funcione para responder 200; si fallan ambos responde 502.

Las opciones de los campos (con sus IDs de ClickUp) viven en `src/lib/lead-options.json`, compartido con el formulario de la landing. Si cambian las opciones en ClickUp, actualiza ese archivo.

## Despliegue

```bash
cd worker
npx wrangler login                                        # cuenta de Arianna
npx wrangler secret put CLICKUP_API_TOKEN -c wrangler.jsonc
npx wrangler secret put RESEND_API_KEY -c wrangler.jsonc
npx wrangler deploy -c wrangler.jsonc
```

`-c wrangler.jsonc` es obligatorio: la raíz del repo tiene su propio `wrangler.json`.

Secreto opcional: `TURNSTILE_SECRET` (si existe, el Worker exige `turnstileToken`). Hoy se protege solo con honeypot.

## Logs

`npx wrangler tail loopsgrowth-leads -c wrangler.jsonc --format pretty`
