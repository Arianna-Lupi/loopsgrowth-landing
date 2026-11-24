---
title: "Core Web Vitals: qué son, umbrales de Google y cómo medirlos"
description: "Core Web Vitals explicados: LCP, INP y CLS con los umbrales oficiales de Google, causas comunes de mala puntuación y cómo medirlos paso a paso."
pubDate: 2027-01-13
author: ari
cluster: L1-tecnico
keyword: "core web vitals qué son"
draft: false
reviewedBy: "Juan Angulo (revisión, 2026-11-24)"
related: []
---

> **Respuesta corta:** los Core Web Vitals son tres métricas de experiencia de página que Google recomienda cuidar: LCP (velocidad de carga del contenido principal), INP (respuesta a las interacciones) y CLS (estabilidad visual). Una página se considera buena cuando cumple los tres umbrales en el percentil 75 de las visitas reales: LCP de 2,5 segundos o menos, INP de 200 milisegundos o menos y CLS de 0,1 o menos.

## Qué son y por qué importan

Los Core Web Vitals miden cómo se siente usar una página, no cuánto pesa su código. Cargar rápido, responder cuando tocas un botón y no mover el contenido mientras lees son tres cosas que cualquier visitante nota, aunque no sepa ponerles nombre.

Google lo plantea así en su [documentación de Search sobre Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals): recomienda con firmeza que los sitios tengan buenos valores para tener éxito en Search, y señala que estas métricas coinciden con lo que sus sistemas de clasificación principales buscan premiar. Esa misma página no dice que un buen puntaje asegure una posición. Úsalos como una mejora de experiencia que además suma a tu SEO, no como un interruptor para subir en los resultados. Una página con contenido pobre no mejora por tener un LCP perfecto.

Los umbrales y las definiciones de esta guía salen de [web.dev](https://web.dev/articles/vitals), el sitio de Google para desarrolladores web.

## Las tres métricas y sus umbrales oficiales

| Métrica | Qué mide | Bueno | Necesita mejorar | Malo |
|---|---|---|---|---|
| LCP | Carga del contenido principal | 2,5 s o menos | de 2,5 s a 4 s | más de 4 s |
| INP | Respuesta a las interacciones | 200 ms o menos | de 200 ms a 500 ms | más de 500 ms |
| CLS | Estabilidad visual | 0,1 o menos | de 0,1 a 0,25 | más de 0,25 |

Cada una se explica abajo. Google evalúa cada métrica en el percentil 75 de las cargas de página, por separado para móvil y escritorio. Si en el 75 % de las visitas se cumple el umbral, la métrica pasa. Para que la página pase la evaluación, deben pasar las tres.

### LCP: cuánto tarda en aparecer lo importante

LCP (Largest Contentful Paint) registra cuándo termina de dibujarse el elemento más grande visible en la pantalla inicial. Según [web.dev](https://web.dev/articles/lcp), cuenta imágenes, el póster de un video, elementos con imagen de fondo mediante `url()` y bloques de texto. En una página de servicios, suele ser la imagen de portada o el titular principal.

Causas habituales de un LCP lento, según esa misma documentación:

- Respuesta lenta del servidor, redirecciones o tiempos de conexión.
- Una imagen grande que se carga tarde, porque las imágenes no cuentan hasta que terminan de cargar.
- Fuentes web que bloquean el texto hasta que descargan.
- Retrasos entre que el recurso llega y el navegador lo dibuja.

Qué revisar primero: identifica cuál es tu elemento LCP (más abajo te digo cómo), mira si es una imagen y comprueba si pesa más de lo necesario, si carga con retraso o si está detrás de una redirección.

### INP: si la página responde cuando interactúas

INP (Interaction to Next Paint) observa la latencia de los clics, toques y pulsaciones de teclado durante toda la visita y reporta, en esencia, la peor interacción sin contar los valores atípicos. Según [web.dev](https://web.dev/articles/inp), reemplaza a First Input Delay (FID), que solo miraba la primera interacción.

La latencia se compone de tres partes:

1. **Retraso de entrada:** el tiempo antes de que empiecen a ejecutarse los manejadores del evento, a menudo porque el hilo principal está ocupado.
2. **Duración del procesamiento:** el tiempo que tardan en ejecutarse esos manejadores.
3. **Retraso de presentación:** el tiempo hasta que se dibuja el siguiente fotograma.

La causa más mencionada en la documentación son las tareas largas en el hilo principal, es decir, JavaScript que bloquea la página. En la práctica, esto suele venir de demasiados scripts de terceros, de menús o filtros programados de forma pesada o de formularios que hacen mucho trabajo al hacer clic.

### CLS: que nada se mueva mientras lees

CLS (Cumulative Layout Shift) puntúa los cambios de diseño inesperados. Según [web.dev](https://web.dev/articles/cls), toma la mayor ráfaga de cambios durante la vida de la página, y cada cambio se calcula multiplicando la fracción de impacto por la fracción de distancia. No necesitas hacer la cuenta: basta saber que cuanto más contenido se mueve y más lejos, peor.

Causas comunes que lista la documentación:

- Imágenes o videos sin dimensiones definidas.
- Fuentes que se ven más grandes o más pequeñas que la de reserva y desplazan el texto.
- Anuncios o widgets de terceros que cambian de tamaño al cargar.
- Contenido insertado dinámicamente por encima del que ya estaba.

La corrección más común es reservar el espacio: define ancho y alto en las imágenes y contenedores para anuncios y avisos antes de que carguen. Para animaciones, la documentación recomienda usar `transform` (`scale()` o `translate()`) en lugar de cambiar `width`, `height`, `top` o `left`.

## Datos de campo y datos de laboratorio

Hay dos formas de medir, y confundirlas es uno de los errores más comunes.

- **Datos de campo:** mediciones de visitantes reales. Son los que cuentan para evaluar tus Core Web Vitals. Incluyen el informe Chrome UX Report (CrUX), PageSpeed Insights, el informe de Core Web Vitals en Search Console y la biblioteca JavaScript `web-vitals` si quieres medir en tu propia analítica.
- **Datos de laboratorio:** pruebas simuladas en condiciones controladas, como Lighthouse o Chrome DevTools. Sirven para encontrar problemas y verificar arreglos. web.dev advierte que Lighthouse no puede medir INP y usa Total Blocking Time (TBT) como aproximación.

Por eso puedes ver una puntuación alta en Lighthouse y aun así fallar en campo: la prueba de laboratorio simula un entorno y tus visitantes usan dispositivos y conexiones muy variados. Verifícalo con tus propios datos de campo.

## Cómo medirlos paso a paso

1. **Abre el informe de Core Web Vitals en Search Console.** Agrupa tus URL por estado (bueno, necesita mejorar, malo) con datos reales, por móvil y escritorio. Empieza aquí para saber qué grupo de páginas falla.
2. **Pega una URL problemática en PageSpeed Insights.** Verás datos de campo cuando existan y un diagnóstico de laboratorio con oportunidades concretas.
3. **Abre Chrome DevTools** en la página y graba una carga en la pestaña de rendimiento. Ahí identificas el elemento LCP, los cambios de diseño y las tareas largas.
4. **Prueba en un teléfono real** o con el límite de CPU activado en DevTools. Si solo pruebas en tu equipo potente, subestimas el problema.
5. **Anota los valores** en una hoja con fecha y URL. Después de cada cambio, compara contra los datos de campo y no te quedes con una sola medición de laboratorio. Mira la tendencia durante varias semanas antes de decidir si funcionó.

## Un orden de trabajo razonable

Prioriza por impacto y no por orden alfabético:

1. Corrige primero lo que afecte a más páginas: una plantilla, un script global o el tema del sitio.
2. Resuelve LCP y CLS en las páginas que traen visitas o que convierten, como tus páginas de servicio.
3. Trata INP cuando tengas evidencia de interacciones lentas, normalmente ligadas a scripts de terceros, formularios o menús.
4. Revisa que la página sea indexable. De nada sirve afinar métricas de una página que Google no puede indexar, tema que explicamos en [cómo indexar una página en Google](/blog/como-indexar-una-pagina-en-google/).

Las métricas se cruzan con otras decisiones técnicas, como qué rastrea Google. Si tu sitio bloquea recursos importantes, lee la [guía de robots.txt](/blog/robots-txt-guia/).

## Cuándo conviene pedir ayuda

Los arreglos de imágenes, fuentes y espacio reservado suelen ser acotados. Cuando el problema viene del tema, de un constructor visual o de decenas de scripts de terceros, es un trabajo más amplio. Para ese caso existen el servicio de [Core Web Vitals](/servicios/core-web-vitals/), la [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/) y el trabajo de [indexación y rastreo](/servicios/indexacion-y-rastreo/). En todos ellos se mide antes y después, y no se prometen posiciones.

## Preguntas frecuentes

**¿Los Core Web Vitals afectan al posicionamiento?** Google dice que sus sistemas de clasificación buscan premiar una buena experiencia de página y recomienda cuidar estas métricas, pero no afirma que un buen puntaje asegure una posición. El contenido y la relevancia siguen pesando.

**¿Qué pasó con First Input Delay?** INP lo reemplazó. FID solo medía el retraso de la primera interacción, mientras que INP observa todas las interacciones de la visita.

**¿Por qué mi puntaje de PageSpeed cambia cada vez que lo ejecuto?** Las pruebas de laboratorio dependen de las condiciones del momento, como la red y la carga del servidor. Fíjate en los datos de campo y en las tendencias, no en una sola ejecución.
