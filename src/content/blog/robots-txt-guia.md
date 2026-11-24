---
title: "Robots.txt: sintaxis, ejemplos y errores que bloquean tu sitio"
description: "Aprende qué es robots.txt, cómo escribir sus reglas, qué errores bloquean tu sitio por accidente y cómo tratar a los rastreadores de IA como GPTBot."
pubDate: 2027-03-09
author: ari
cluster: L1-tecnico
keyword: "robots.txt"
draft: true
related: []
---

> **Respuesta corta:** robots.txt es un archivo de texto en la raíz de tu dominio que le dice a los rastreadores qué URL pueden visitar. Sirve para ordenar el rastreo, no para sacar páginas de Google: una URL bloqueada todavía puede aparecer en los resultados si otras páginas la enlazan. Una sola línea mal escrita puede bloquear todo tu sitio, así que conviene revisarlo con calma.

## Qué hace robots.txt y qué no hace

Según la [documentación de Google sobre robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro), el archivo indica a los rastreadores a qué URL pueden acceder en tu sitio. Se usa sobre todo para gestionar el tráfico de rastreo: evitar que el servidor se sature con visitas de bots o que se pierda tiempo en páginas sin valor, como resultados de búsqueda interna o filtros casi idénticos.

Hay tres límites que debes tener claros desde el principio:

- **No oculta páginas de Google.** Si bloqueas una URL y otras páginas la enlazan, Google puede mostrarla en los resultados sin descripción. Para mantener una página fuera del buscador, usa una directiva `noindex` (en una etiqueta meta o en una cabecera de respuesta), protege la página con contraseña o elimínala.
- **No es una medida de seguridad.** Los rastreadores no están obligados a obedecerlo, y cualquiera puede leer tu archivo escribiendo `/robots.txt` en el navegador. Nunca listes ahí rutas que quieras mantener en secreto.
- **No todos los rastreadores interpretan la sintaxis igual.** Algunos ignoran ciertas reglas.

Esa distinción entre rastrear e indexar explica la mayoría de los malentendidos. Si quieres entender qué hace falta para que una página entre al índice, lee [cómo indexar una página en Google](/blog/como-indexar-una-pagina-en-google/). Aquí nos centramos en el archivo.

## Dónde va y cómo se escribe

Las reglas de ubicación que publica Google en su [guía para crear un archivo robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt) son estas:

- El archivo se llama `robots.txt` y vive en la raíz del host, por ejemplo `https://www.tudominio.com/robots.txt`. No funciona dentro de un subdirectorio.
- Hay un solo archivo por sitio.
- Las reglas valen solo para el protocolo, el host y el puerto donde publicas el archivo. Un subdominio puede tener el suyo.
- Debe ser texto en codificación UTF-8.
- Las reglas distinguen mayúsculas de minúsculas: `disallow: /archivo.asp` afecta a `archivo.asp`, pero no a `ARCHIVO.asp`.

Las directivas son cuatro:

| Directiva | Para qué sirve | Detalle |
| --- | --- | --- |
| `user-agent` | Indica a qué rastreador se aplica el grupo de reglas | Obligatoria. El asterisco `*` cubre todos los rastreadores, salvo los de anuncios de Google (AdsBot), que se nombran de forma explícita |
| `disallow` | Bloquea una ruta | La ruta empieza con `/`. Si es un directorio, termina en `/` |
| `allow` | Permite una ruta dentro de un directorio bloqueado | Misma forma de ruta que `disallow` |
| `sitemap` | Señala tu mapa del sitio | Opcional. Debe ser una URL completa |

Cada grupo necesita al menos una línea `disallow` o `allow`. Google admite el comodín `*` en todas las reglas excepto en `sitemap`.

## Un ejemplo completo, línea por línea

Imagina una tienda en línea que no quiere que los rastreadores pierdan tiempo en el carrito, la búsqueda interna ni las páginas de cuenta, pero sí en el resto:

```
User-agent: *
Disallow: /carrito/
Disallow: /buscar/
Disallow: /mi-cuenta/
Allow: /mi-cuenta/ayuda/

Sitemap: https://www.tudominio.com/sitemap.xml
```

La primera línea aplica el grupo a todos los rastreadores. Las tres siguientes bloquean carpetas enteras. La línea `Allow` abre una excepción: dentro de `/mi-cuenta/`, la subcarpeta de ayuda sí se rastrea. La última línea apunta al mapa del sitio con una URL completa.

Fíjate en que no hay una sola regla sobre contenido que el negocio quiere posicionar. Un robots.txt sano suele ser corto. Si el tuyo tiene cientos de líneas y nadie sabe por qué, es una señal para revisarlo.

## Errores que bloquean tu sitio sin que lo notes

Estos son los fallos que más daño hacen, todos fáciles de prevenir:

1. **`Disallow: /` en producción.** Esa línea bloquea el sitio completo. Es común que llegue desde el entorno de pruebas, donde se puso a propósito, y que nadie la quite al publicar. Después de cada lanzamiento, abre `/robots.txt` y míralo.
2. **Bloquear scripts y estilos.** Google advierte que no debes bloquear los archivos de recursos que la página necesita para que se entienda. Si bloqueas tus carpetas de JavaScript o CSS, el buscador puede ver una versión rota de tu página. Esto importa también para medir la experiencia de uso, como explica nuestra guía sobre [Core Web Vitals](/blog/core-web-vitals-que-son/).
3. **Usarlo para eliminar páginas del índice.** Ya vimos que no funciona. Peor aún: si bloqueas una URL que tiene `noindex`, el rastreador no la visita y nunca ve esa directiva. Google lo resume así: combinar reglas de rastreo y de indexación puede hacer que se anulen entre sí.
4. **Ignorar las mayúsculas.** Si tu servidor responde en `/Blog/` y tú bloqueaste `/blog/`, la regla no afecta a esa ruta.
5. **Olvidar el archivo del subdominio.** Un robots.txt de `www.tudominio.com` no gobierna `blog.tudominio.com`.
6. **Editarlo a ciegas en un CMS.** Si usas Wix, Blogger u otras plataformas, puede que no puedas editar el archivo directamente. En ese caso, revisa los ajustes de búsqueda de la plataforma.

Si sospechas que algo de esto te pasa, empieza por una revisión de rastreo e indexación. En Loops Growth trabajamos ese frente dentro del servicio de [indexación y rastreo](/servicios/indexacion-y-rastreo/), y forma parte de cualquier [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/).

## Rastreadores de IA: cómo tratarlos en robots.txt

Aquí sí conviene distinguir entre rastreadores con funciones distintas. OpenAI documenta tres en su [página de bots](https://developers.openai.com/api/docs/bots):

- **OAI-SearchBot** sirve para mostrar sitios en las funciones de búsqueda de ChatGPT. Si lo bloqueas, tu sitio no aparece en las respuestas de búsqueda de ChatGPT, aunque puede salir como enlace de navegación.
- **GPTBot** rastrea contenido que puede servir para entrenar los modelos fundacionales de OpenAI. Si lo bloqueas, indicas que tu contenido no debe usarse para ese entrenamiento.
- **ChatGPT-User** actúa cuando una persona pide una acción dentro de ChatGPT. Como la inicia un usuario, las reglas de robots.txt pueden no aplicarse.

Cada ajuste es independiente. Un sitio puede permitir la búsqueda y rechazar el entrenamiento:

```
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /
```

OpenAI indica que los sistemas de búsqueda pueden tardar unas 24 horas en adaptarse tras una actualización de tu archivo.

Google ofrece algo parecido con el token **Google-Extended**. Según su [documentación de rastreadores comunes](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), controla si el contenido que Google rastrea puede usarse para entrenar futuras generaciones de Gemini y para fundamentar respuestas con contenido del índice. Google aclara que no afecta a la inclusión en Google Search ni funciona como señal de posicionamiento. Ese token no tiene un agente de usuario propio: se usa solo en robots.txt.

La decisión de permitir o no a estos rastreadores es de negocio, no técnica. Si quieres que los asistentes de IA puedan citarte, bloquear sus rastreadores de búsqueda te saca de esa conversación. Si te preocupa el entrenamiento, puedes cerrar solo ese acceso. Ninguna de las dos opciones asegura que una IA te mencione, y nadie puede prometerte lo contrario.

## Cómo probar tu robots.txt hoy

Dedica diez minutos a esta lista:

1. Abre `https://tudominio.com/robots.txt` y comprueba que existe, que carga como texto y que está en la raíz.
2. Busca `Disallow: /` sin nada más. Si aparece bajo `User-agent: *`, tu sitio está cerrado.
3. Revisa que ninguna regla bloquee carpetas de scripts, estilos o imágenes que tus páginas necesitan.
4. Confirma que la línea `Sitemap` usa una URL completa y que esa URL responde.
5. Elige a qué rastreadores de IA das acceso y escribe esa decisión en el archivo.
6. Repite todo después de cada migración, rediseño o cambio de plataforma.
7. Anota en un documento por qué existe cada regla. Quien herede el sitio te lo agradecerá.

## Preguntas frecuentes

### ¿Robots.txt sirve para quitar una página de Google?

No. Una URL bloqueada puede seguir apareciendo sin descripción si otras páginas la enlazan. Para mantenerla fuera de los resultados, usa `noindex`, una contraseña o elimina la página. Y recuerda que `noindex` solo funciona si el rastreador puede visitar la URL.

### ¿Necesito un robots.txt si quiero que todo se rastree?

No es obligatorio para que el sitio se rastree. Aun así, tenerlo es útil para declarar tu mapa del sitio con la línea `Sitemap` y para dejar claro que no bloqueas nada por error.

### ¿Bloquear GPTBot me saca de ChatGPT?

No necesariamente. Según OpenAI, GPTBot se relaciona con el entrenamiento de sus modelos, mientras que OAI-SearchBot controla la aparición en las funciones de búsqueda de ChatGPT. Son ajustes independientes, así que puedes tratarlos de forma distinta.
