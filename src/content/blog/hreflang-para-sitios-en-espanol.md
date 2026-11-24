---
title: "Hreflang para sitios en español: México, Colombia y Venezuela"
description: "Cómo marcar con hreflang el español de México, Colombia o Venezuela, qué códigos son válidos, cómo evitar los errores comunes y cuándo no hace falta."
pubDate: 2027-06-03
author: ari
cluster: L1-tecnico
keyword: "hreflang"
draft: true
related: []
---

> **Respuesta corta:** hreflang es una anotación que le indica a Google qué versión de una página corresponde a cada idioma o región. Para el español de México usas `es-MX`, para Colombia `es-CO` y para Venezuela `es-VE`. Cada versión debe enlazar a todas las demás y a sí misma, y todos los enlaces deben ser de ida y vuelta.

## Qué resuelve hreflang y cuándo necesitas usarlo

Imagina que tienes un sitio con una página para cada país: una para México, otra para Colombia y otra para Venezuela. Gran parte del texto es parecido, porque todas están en español, pero cambian detalles como la moneda de referencia, los datos de contacto, los productos disponibles o el vocabulario. Sin ayuda, Google puede mostrar la versión mexicana a alguien en Bogotá. Hreflang es la forma de decirle cuál corresponde a cada audiencia.

Según la [documentación de Google sobre versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions), estas anotaciones sirven para sitios con contenido en varios idiomas o dirigido a distintas regiones. Si todo tu sitio tiene una única versión en español para toda Latinoamérica y no varía por país, probablemente no necesitas hreflang. La señal importa cuando existen varias URL con contenido similar pensadas para públicos distintos.

Si estás decidiendo cómo organizar un sitio multipaís, empieza por esa pregunta: ¿tengo contenido realmente distinto por país?

## Cómo se escribe: idioma y región

Antes de elegir códigos, define tu estructura de URL. Puedes usar carpetas por país (`/mx/`, `/co/`), subdominios o dominios propios. Hreflang funciona con cualquiera de ellas. Lo importante es que cada versión tenga su propia URL, estable y rastreable, y que el contenido difiera de verdad: moneda de referencia, productos, datos de contacto, normas locales o vocabulario.

El formato de los códigos tiene reglas claras, y aquí nacen muchos errores. Google indica:

- Un **código de idioma** de dos letras (ISO 639-1), opcionalmente seguido de un **código de región** (ISO 3166-1 alfa 2), unidos con un guion.
- Los códigos no distinguen mayúsculas, aunque la convención es escribir la región en mayúsculas.
- **Un código de región solo no es válido.** El ejemplo de Google: `be` es el idioma bielorruso, no Bélgica.
- Códigos como `es-419` (Latinoamérica) no son compatibles.
- Códigos reservados como `UK`, `EU` y `UN` no tienen efecto. Para el Reino Unido se usa `GB`.

Aplicado al español, el patrón da esta tabla:

| Audiencia | Código hreflang |
| --- | --- |
| Español, sin región concreta | `es` |
| México | `es-MX` |
| Colombia | `es-CO` |
| Venezuela | `es-VE` |

La página de Google no incluye un ejemplo con español de México, pero sí ejemplos como `de-CH`, `en-GB` y `fr-BE`. Los códigos para México, Colombia y Venezuela siguen el mismo formato: `es` más el código ISO de dos letras del país.

Cuando una página existe para México y Colombia pero no para Venezuela, no inventes un `es-VE` que apunte a la mexicana. Declara solo las versiones que existen. Para ese público, define una versión general en `es` o una página de reserva con `x-default`.

Un detalle útil: como `es-419` no funciona, no puedes marcar "toda Latinoamérica" con un código regional. Tienes dos caminos. Uno es usar `es` como versión general en español. El otro es crear una versión por país con su código propio.

## Las tres formas de implementarlo

Google las considera equivalentes. Elige una, porque usar varias solo suma mantenimiento sin ventaja.

**1. Etiquetas HTML en el `head`:**

```html
<link rel="alternate" hreflang="es-MX" href="https://www.tudominio.com/mx/" />
<link rel="alternate" hreflang="es-CO" href="https://www.tudominio.com/co/" />
<link rel="alternate" hreflang="es-VE" href="https://www.tudominio.com/ve/" />
<link rel="alternate" hreflang="x-default" href="https://www.tudominio.com/" />
```

El conjunto es idéntico en todas las versiones.

**2. Cabecera HTTP `Link`:** útil para archivos que no son HTML, como los PDF.

**3. Sitemap XML:** cada entrada `<url>` lleva su `<loc>` y un `<xhtml:link>` por cada variante, incluida ella misma. El sitemap necesita declarar el espacio de nombres `xhtml`. Si quieres repasar la base, tenemos una guía sobre [sitemap XML](/blog/sitemap-xml-guia/).

La opción de sitemap suele ser la más cómoda cuando hay muchas páginas, porque no ensucia el HTML. La de etiquetas es la más sencilla de revisar a simple vista.

## Reglas que Google exige: enlaces de ida y vuelta y autorreferencia

Dos reglas concentran la mayoría de los fallos:

- **Enlaces de retorno.** Si la página X apunta a la página Y, la Y debe apuntar de vuelta a la X. Si falta, Google puede ignorar las anotaciones.
- **Autorreferencia.** Cada versión incluye una etiqueta que apunta a sí misma, además de las que apuntan a las otras.

El valor `x-default` marca la página de reserva para usuarios cuyo idioma no coincide con ninguna versión, por ejemplo un selector de país o una portada que redirige. No lleva código de idioma.

Hay otra pieza que se olvida: el canonical. La guía de Google sobre duplicados indica que, en grupos hreflang, el canonical debe ser de un mismo idioma. Si quieres entender cómo se combinan, lee nuestra guía de la [etiqueta canonical](/blog/etiqueta-canonical-y-contenido-duplicado/).

## Errores comunes y cómo revisarlos

Google enumera estos fallos habituales:

- Faltan los enlaces de retorno entre versiones.
- Se usan códigos de idioma no válidos, como una región sola o un código ISO equivocado.
- Se usan códigos de región incorrectos, como `UK` en lugar de `GB`.
- Las etiquetas HTML quedan fuera de un `head` bien formado.
- Se mezcla hreflang con otros atributos, como `media`, en la misma etiqueta `link`.
- Se usan URL relativas, en lugar de URL completas con protocolo.
- En el sitemap, las entradas omiten la propia URL o alguna de las otras variantes.
- El sitemap lista URL fuera del directorio donde está alojado.

Para revisar un sitio, sigue esta lista:

1. Haz un inventario de las URL por país y de su código.
2. Comprueba que cada URL declara a todas las demás y a sí misma.
3. Verifica que las URL son absolutas y que responden con código 200, sin redirigir.
4. Confirma que cada código es válido: idioma de dos letras, región de dos letras, nada de `es-LATAM` ni `es-419`.
5. Revisa que el canonical de cada versión apunta a esa misma versión, no a otro país.
6. Revisa si has combinado más de un método. Deja uno.
7. Después de un cambio de URL, vuelve a validar. Una migración sin redirecciones bien planeadas rompe los enlaces de ida y vuelta; tenemos una guía sobre [redirecciones 301](/blog/redirecciones-301-guia/) para ese caso.

En un trabajo multipaís, estos controles se repiten por cada mercado. Dentro de [indexación y rastreo](/servicios/indexacion-y-rastreo/) revisamos que cada versión se pueda descubrir y rastrear, y en una [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/) validamos las anotaciones. Antes de eso, vale la pena entender [cómo indexar una página en Google](/blog/como-indexar-una-pagina-en-google/). Y si tus páginas por país comparten plantilla, la experiencia de carga de cada una también cuenta, como explica el artículo sobre [Core Web Vitals](/blog/core-web-vitals-que-son/) y el [servicio dedicado](/servicios/core-web-vitals/).

## Preguntas frecuentes

### ¿Puedo usar `es-LATAM` o `es-419` para toda Latinoamérica?

No. Google indica que códigos como `es-419` no son compatibles. Usa `es` como versión general en español o crea una versión por país con su código propio, como `es-MX` o `es-CO`.

### ¿Hreflang mejora mi posición en Google?

No es un factor para subir posiciones. Su función es ayudar a que Google muestre la versión adecuada a cada audiencia. Nadie puede prometerte una posición concreta por implementarlo.

### ¿Necesito hreflang si solo tengo una página en español para todos los países?

Normalmente no. Hreflang tiene sentido cuando existen varias URL con contenido similar pensadas para idiomas o regiones distintas. Si hay una sola versión, no hay nada que diferenciar.
