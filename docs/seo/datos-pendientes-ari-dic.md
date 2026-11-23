# Datos que faltan de Ari para publicar las landings de diciembre

Fecha: 2026-11-23. Rama `feat/landings-dic`. Todas las páginas nuevas están en `draft: true`: en producción no se generan ni entran al sitemap. Cada YAML trae su lista `pendientes` (no se muestra en la web).

## No encontré en disco

- `demanda_terminos_venezuela.md` (informe del Gerente, 17-nov-2026). Lo necesitan la sección 1 de `/agencia-seo-venezuela/` y la de `/agencia-seo-venezuela/caracas/`.
- Exportación de GSC de aprendoseo.com con país VEN (17-ago a 16-nov-2026 y 17-jul-2025 a 16-nov-2026). Solo tengo las cifras sueltas que cita la hoja.

## Por página

| Página | Qué falta | Quién |
| --- | --- | --- |
| Home | Aprobar meta description y las 2 respuestas nuevas de FAQ ("qué hace una agencia SEO", "Venezuela y LATAM"). Title y H1 van tal cual los aprobó Ari | Ari |
| `/servicios/posicionamiento-en-ia/` | Aprobar la redacción. Confirmar los 6 entregables, el flujo llamada, auditoría, propuesta, ejecución mensual, y la batería mensual de prompts | Ari |
| `/agencia-seo-venezuela/` | 3 hechos del mercado venezolano con fuente https pública (la guarda los exige). Datos de cómo busca el cliente VE. Confirmar videollamada y WhatsApp como modo de trabajo. Si hay clientes de Venezuela que se puedan mencionar | Ari |
| `/agencia-seo-venezuela/caracas/` | Sectores que más compiten en Caracas y clientes o ejemplos de Caracas con permiso (sin esto no se publica: riesgo de doorway). 3 hechos con fuente https | Ari |
| `/nosotros/` | Confirmar el cargo de Miguel Pacheco y que su nombre salga ahí. Si quiere foto del equipo. Si cuenta como pieza de capacidad | Ari |
| `/equipo/arianna-lupi/` | Bio con sus palabras, URL de aprendoclub, foto. Si se publican las cifras de la home ($4M) | Ari |
| `/casos/` y 4 fichas de caso | Ari debe confirmar que existan: su hoja del 17-nov decía no crear páginas de casos y Juan lo pidió el 23-nov. Las fichas solo usan los datos de la home. Falta permiso del cliente para publicar más detalle por caso | Ari |
| `/equipo/juan-carlos-angulo/` | Datos tomados de juan-tech.com. Juan debe confirmar qué publicar. Discrepancia: la home dice +5 años y su sitio dice más de 4. No se publicaron sus precios ni sus clientes | Juan, Ari |
| `/equipo/veronica-romero/` y `/equipo/miguel-pacheco/` | Solo hay datos de la home. Faltan bio, años de experiencia (Miguel), enlaces y fotos aprobadas | Verónica, Miguel, Ari |
| Blog (2 artículos) | Revisión y aprobación escrita (`reviewedBy` y `draft: false`). Revisión técnica de Juan Carlos, que pide la hoja. Verifiqué las afirmaciones sobre OAI-SearchBot y Business Hub contra la documentación de OpenAI del 2026-11-23: conviene revisarlas de nuevo antes de publicar | Ari y Juan Carlos |

## Pendientes de otros

- Redirecciones www a apex y http a https: las gestiona Juan en Cloudflare, no están en el código.
- Enlaces desde ariannalupi.com y aprendoseo.com: requieren aprobación de Ari (no toqué esos sitios).
- Ahrefs: la hoja marca "s/d" en dificultad, pero el CSV de Ahrefs del 2026-11-23 ya trae datos. Falta que alguien los pase a la hoja.
- Línea base de menciones en IA: encargo del Analista, no está en este repo.
