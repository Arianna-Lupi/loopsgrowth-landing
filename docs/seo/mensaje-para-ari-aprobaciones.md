# Mensaje para Ari: qué aprobar y qué datos faltan

Fecha: 2026-11-23. Rama `feat/landings-dic` (commits locales, sin push). Todas las páginas nuevas están en borrador: no se generan en producción hasta que tú las apruebes por escrito.

Hola Ari,

Ya está lista la estructura de diciembre. Para publicar necesito tres cosas de ti: tu aprobación, algunos datos y tu opinión sobre tres decisiones que se salen de tu hoja del 17-nov.

## 1. Qué aprobar (revisar texto y confirmar por escrito)

| Página | Qué revisar |
| --- | --- |
| Home | Meta description y 2 respuestas nuevas del FAQ ("qué hace una agencia SEO", "Venezuela y LATAM"). El title y el H1 van tal como los aprobaste |
| `/servicios/posicionamiento-en-ia/` | Redacción completa, los 6 entregables, el flujo de trabajo y la batería mensual de prompts |
| `/nosotros/` | Cargo de Miguel Pacheco y que su nombre salga ahí |
| `/equipo/arianna-lupi/` | Bio, cifras ($4M, +8 años) y foto |
| 2 artículos del blog | `agencia-seo-vs-especialista-seo` y `como-aparecer-en-chatgpt`. Juan Carlos revisa lo técnico |
| Fotos del equipo | Foto de Juan (con su consentimiento) y la tuya sin editar para la firma del blog |

Se pueden publicar primero estas páginas, sin esperar a Venezuela.

## 2. Datos que me faltan

- **Venezuela:** 3 hechos del mercado con fuente pública (enlace https), cómo busca el cliente venezolano, y si podemos mencionar clientes de Venezuela. No encontré `demanda_terminos_venezuela.md` ni la exportación de GSC con país VEN.
- **Caracas:** sectores que más compiten, y clientes o ejemplos de Caracas con permiso. Sin esto no la publico: sería una página puerta de entrada (doorway).
- **Verónica y Miguel:** bio, enlaces y foto aprobada. De Miguel, además, años de experiencia.
- **Ahrefs:** los datos del CSV del 2026-11-23 ya llegaron, falta pasarlos a la hoja (hoy dice "s/d" en dificultad).
- **Línea base de menciones en IA:** la tiene el Analista.

## 3. Tres decisiones donde me salí de tu hoja

1. **Páginas de casos.** Se quitaron por decisión de Juan el 2026-11-23. `#casos` de la home queda como único lugar y el menú "Resultados" apunta a `/#casos`.
2. **Resultados dentro de las landings.** Cada landing muestra resultados reales de la home. Confirma que los datos se pueden repetir ahí.
3. **Menú "Resultados".** El header y el pie llevan un enlace "Resultados" a `/#casos`.

## 4. Lo que hace Juan

- Redirecciones www a apex y http a https en Cloudflare.
- Enviar el sitemap a Search Console después de publicar.
- Enlaces desde ariannalupi.com y aprendoseo.com, cuando tú los apruebes.

## Qué pasa cuando apruebas

Cambio `draft: false` y registro tu nombre en `reviewedBy` página por página, hago el merge y Juan publica. Sin tu aprobación escrita, el build de producción bloquea la página.
