---
title: "Cómo indexar una página en Google: pasos y motivos de fallo"
description: "Cómo indexar una página en Google paso a paso: inspección de URL, sitemap, enlaces internos, por qué a veces no se indexa y qué trucos no sirven."
pubDate: 2027-01-14
author: ari
cluster: L1-tecnico
keyword: "cómo indexar una página en google"
draft: false
reviewedBy: "Juan Angulo (revisión, 2026-11-24)"
related: []
---

> **Respuesta corta:** para indexar una página en Google, comprueba que se pueda rastrear y que no tenga noindex, enlázala desde otras páginas de tu sitio, inclúyela en tu sitemap y, si es importante, solicita la indexación con la herramienta de inspección de URLs de Search Console. Google avisa de que pedir un rastreo no asegura que la página entre en los resultados, ni siquiera a largo plazo.

## Qué significa que una página esté indexada

Google trabaja en tres fases que conviene distinguir: descubre una URL, la rastrea (visita la página) y decide si la guarda en su índice para poder mostrarla. Que una página exista en tu sitio no implica que esté en Google. Y que Google la haya visitado tampoco implica que la haya guardado.

Según la [guía de inicio de SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), los rastreadores exploran la web de forma constante, y la inmensa mayoría de las páginas nuevas que encuentran cada día les llegan a través de enlaces desde páginas ya conocidas. En muchos casos, publicar el sitio es suficiente para que lo descubra. Cuando no ocurre, o cuando necesitas rapidez, tienes los pasos de abajo.

## Cómo indexar una página, paso a paso

Sigue los cinco pasos en orden. Los tres primeros son diagnóstico y arreglos propios de tu sitio. Solo los dos últimos le piden algo a Google, y piden poco si los anteriores están bien.

### Paso 1: comprueba si ya está indexada

Antes de intentar nada, mira el estado real:

1. **Búsqueda con `site:`.** Escribe `site:tudominio.com/ruta-de-la-pagina` en Google. Si ves resultados de tu sitio, la página está en el índice. La propia guía de Google lo usa como comprobación básica.
2. **Herramienta de inspección de URLs en Search Console.** Pega la URL completa en la barra superior. Google te muestra cómo ve esa página y si encontró problemas.
3. **Informe de indexación de páginas** en Search Console. Lista las URL que no están indexadas y el motivo. Lo veremos más abajo.

Si la página ya aparece, no hace falta solicitar nada.

### Paso 2: asegúrate de que Google puede rastrearla

Revisa estos puntos técnicos antes de pedir la indexación:

- **No está bloqueada en robots.txt.** Si el archivo prohíbe la ruta, Google no puede leer la página. Repasa la [guía de robots.txt](/blog/robots-txt-guia/).
- **No lleva noindex.** Según la [documentación de Google sobre la etiqueta robots](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), noindex indica que no se muestre la página en los resultados. Se aplica con una etiqueta meta (`<meta name="robots" content="noindex">`) o con el encabezado HTTP `X-Robots-Tag: noindex`. Busca ambos.
- **Responde con código 200.** Una página que devuelve error 404, un error de servidor o una redirección larga no se indexa.
- **No exige inicio de sesión.** Googlebot no envía credenciales.

Un error clásico: bloquear una página en robots.txt y además ponerle noindex. Google documenta que, si la página está bloqueada, nunca ve la etiqueta noindex y la ignora. Para que noindex funcione, la URL no puede estar bloqueada para el rastreo.

### Paso 3: enlázala desde tu propio sitio

Como la mayoría de los descubrimientos llegan por enlaces, una página sin enlaces internos es una página huérfana. Añade al menos uno o dos enlaces desde páginas que ya estén indexadas y que tengan relación temática, con un texto de enlace que describa el destino. Por ejemplo, un servicio nuevo debería enlazarse desde la página de servicios y desde los artículos que traten el mismo tema.

Esto ayuda por dos razones: Google la descubre más fácil y entiende de qué trata. Para ver cómo organizar esos enlaces, lee sobre [indexación y rastreo](/servicios/indexacion-y-rastreo/).

### Paso 4: inclúyela en tu sitemap

Un sitemap es un archivo que describe las páginas de tu sitio. Según la [documentación de Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), no siempre es necesario: si tus páginas están bien enlazadas, Google suele encontrar la mayor parte del sitio por sí solo. Resulta más útil en sitios grandes o nuevos con pocos enlaces externos. La misma página aclara que un sitemap ayuda a encontrar URL pero no asegura que todas se rastreen e indexen.

Si usas un gestor de contenidos, es probable que genere el sitemap por ti. Comprueba que la URL nueva figure en él y envía el sitemap desde el informe correspondiente de Search Console.

### Paso 5: solicita la indexación

Según la [guía de Google para solicitar un rastreo](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), tienes dos métodos:

- **Herramienta de inspección de URLs:** para pocas URL. Debes ser propietario o usuario con todos los permisos de la propiedad en Search Console. Pega la URL, espera el resultado y solicita la indexación.
- **Sitemap:** para muchas URL.

Tres aclaraciones de esa documentación que evitan frustraciones:

1. Las solicitudes individuales tienen una cuota.
2. El rastreo puede tardar de varios días a varias semanas.
3. Enviar la misma URL varias veces no acelera el proceso.

Y la más importante: pedir un rastreo no asegura que la página aparezca en los resultados de inmediato, ni siquiera que aparezca.

## Por qué a veces no se indexa

Si pasaron semanas y la página sigue fuera, abre el informe de indexación de páginas de Search Console. Los motivos más habituales, según la [ayuda de Google](https://support.google.com/webmasters/answer/7440203), son estos:

| Estado | Qué significa | Qué hacer |
|---|---|---|
| Descubierta, actualmente sin indexar | Google encontró la URL pero aún no la rastreó | Refuerza los enlaces internos y espera. Revisa que el servidor responda bien |
| Rastreada, actualmente sin indexar | Google la visitó y decidió no guardarla | Mejora la utilidad y la originalidad del contenido. Revisa duplicados |
| Excluida por etiqueta noindex | La página pide no ser indexada | Quita noindex si querías indexarla |
| Bloqueada por robots.txt | El archivo impide el rastreo | Ajusta la regla |
| Duplicada sin canónica elegida por el usuario | Google considera que repite otra página y eligió una versión | Declara la canónica o diferencia el contenido |
| No encontrada (404) o error 5xx | La página no existe o el servidor falla | Restablece la página o redirige con 301 |
| Soft 404 | La página parece un error pero devuelve código de éxito | Devuelve el código correcto o añade contenido real |

El caso más frustrante es "Rastreada, actualmente sin indexar". Google indica que es común y que no siempre es un problema, pero que conviene revisar las páginas importantes. Si la página dice lo mismo que otras diez de tu sitio, no esperes que Google la guarde. La solución es de contenido: darle un ángulo propio, ejemplos concretos y una razón para existir.

## Qué no sirve

- **Solicitar la indexación diez veces al día.** Google dice que no acelera nada.
- **Contratar servicios de "indexación rápida".** No encontramos respaldo en la documentación de Google para ellos. Los métodos oficiales son los de arriba.
- **Crear cientos de páginas casi iguales.** Aumenta las URL duplicadas y descartadas.
- **Dar por hecho que el sitemap lo resuelve todo.** Es una ayuda para descubrir, no una orden.
- **Bloquear con robots.txt para "esconder" una página.** La ayuda de Google indica que bloquear no impide por completo la indexación si otras páginas enlazan a ella. Para mantenerla fuera, usa noindex.

## Checklist rápido

1. La URL responde con código 200.
2. No está bloqueada en robots.txt ni lleva noindex.
3. Tiene una canónica coherente.
4. Recibe al menos un enlace interno desde una página indexada.
5. Aparece en el sitemap.
6. Tiene contenido propio y útil.
7. Fue inspeccionada y enviada desde Search Console.
8. Revisaste el informe de indexación pasadas dos o tres semanas.

## Cuándo pedir una revisión técnica

Si tienes decenas de URL sin indexar, si el problema se repite en una plantilla o si no entiendes el motivo que muestra Search Console, conviene una [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/). Un problema de rastreo puede venir de la arquitectura, del servidor o de la velocidad. Esto último lo vemos en [Core Web Vitals: qué son y cómo medirlos](/blog/core-web-vitals-que-son/), y se trabaja también en el servicio de [Core Web Vitals](/servicios/core-web-vitals/). Nadie puede asegurar una indexación, pero sí se puede encontrar el motivo concreto de cada URL.

## Preguntas frecuentes

**¿Cuánto tarda Google en indexar una página nueva?** Google indica que el rastreo puede tardar de varios días a varias semanas desde la solicitud. No hay un plazo fijo y depende del sitio.

**¿Necesito Search Console para indexar mis páginas?** No es obligatorio, porque Google puede descubrir páginas por enlaces. Pero te da el estado real de cada URL y la herramienta de solicitud, así que conviene tenerlo configurado.

**¿Por qué Google indexó una versión distinta de mi URL?** Probablemente detectó duplicados y eligió otra versión como canónica. Revisa el informe de indexación y declara de forma explícita la URL que prefieres.
