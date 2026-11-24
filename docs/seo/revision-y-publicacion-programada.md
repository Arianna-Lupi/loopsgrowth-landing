# Revisión y publicación programada

Fecha: 2026-11-24. Todo el contenido nuevo (19 servicios, 38 artículos, 5 páginas país, de las cuales Venezuela ya estaba) está en `draft: true`.

## Cómo sale una pieza
1. Juan la lee. Con `npm run dev` los borradores se ven con `noindex`.
2. Juan la aprueba: `npm run aprobar -- --por "Juan Angulo" <id>`. Ejemplos de id: `link-building`, `seo-en-mexico`, `aeo-mexico`. Para todo el lote con fecha: `npm run aprobar -- --por "Juan Angulo" --todo`. `npm run aprobar -- --lista` muestra los pendientes con su fecha.
3. Se hace commit y push a `main`.
4. El cron diario (11:15 UTC) reconstruye el sitio. La pieza sale el día de su `publishAt` o `pubDate`. Si la fecha ya pasó, sale en el siguiente deploy.

Un borrador nunca sale. Una pieza aprobada con fecha futura espera su día.

## Qué revisar en cada pieza
- El campo `pendientes` de servicios y páginas país lista lo que no se pudo verificar. Léelo antes de aprobar.
- Cifras mensuales de StatCounter (páginas país y artículos de mercado): relee la fuente la semana de salida.
- Porcentajes de DANE y cifras de la Cámara Colombiana de Comercio Electrónico: revisa la fuente (hoy vienen vía PDF y prensa).
- Servicios: confirma que Loops presta cada uno. Los 19 salieron de una propuesta.
- Artículos: firman como Ari. Cambia el autor si Ari prefiere otra firma.

## Enlaces entre piezas
Cada pieza enlaza a otras del plan. Si el destino aún no sale, el sitio quita el enlace y lo restaura cuando el destino se publica.

## Dependencias de la automatización
- El cron vive en `.github/workflows/deploy-site.yml`. GitHub desactiva los cron de un repositorio sin actividad durante 60 días: un commit lo reactiva.
- Si un deploy falla (guardas), el cron sigue intentando cada día. Revisa la pestaña Actions.
- El orden, las fechas y los enlaces salen de `docs/seo/plan-contenido.json`, generado por `scripts/plan-contenido.py`.
