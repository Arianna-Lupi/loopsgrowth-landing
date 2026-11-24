---
title: "Sitemap XML: qué incluir, qué excluir y cómo enviarlo"
description: "Guía práctica de sitemap XML: qué URL incluir y cuáles dejar fuera, límites de tamaño, cómo usar lastmod y cómo enviarlo en Search Console paso a paso."
pubDate: 2027-03-11
author: ari
cluster: L1-tecnico
keyword: "sitemap xml"
draft: false
reviewedBy: "Juan Angulo (revisión, 2026-11-24)"
related: []
---

> **Respuesta corta:** un sitemap XML es un archivo que lista las URL que quieres que aparezcan en los resultados de búsqueda, para que Google las descubra con más facilidad. Incluye solo URL canónicas que respondan bien, déjalo actualizado y envíalo en Search Console. Enviarlo es una sugerencia para el buscador, no una orden: no asegura que Google rastree todo.

## Qué es un sitemap y para qué sirve

Un sitemap es un archivo donde tú declaras qué páginas importan en tu sitio. Google puede encontrar páginas siguiendo enlaces, pero el mapa le da un atajo, sobre todo en sitios grandes, nuevos o con pocas conexiones internas. La [guía de Google para crear un sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) acepta varios formatos:

- **XML:** el más versátil. Admite extensiones para imágenes, vídeos, noticias y versiones localizadas.
- **RSS 2.0 y Atom 1.0:** Google los acepta. Existe también mRSS para detalles de vídeo.
- **Texto:** un archivo `.txt` con una URL por línea.

Para la mayoría de los sitios, XML es la opción lógica. Muchos sistemas de gestión de contenido generan uno por su cuenta, pero conviene revisar qué URL incluye.

Un sitemap ayuda al descubrimiento, pero no reemplaza lo básico. Si una página no aporta nada o está bloqueada, listarla no la salvará. Para repasar qué más influye, mira nuestra guía de [cómo indexar una página en Google](/blog/como-indexar-una-pagina-en-google/).

## Cómo se ve un sitemap XML

Un archivo mínimo tiene esta forma:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.tudominio.com/</loc>
    <lastmod>2027-02-18</lastmod>
  </url>
  <url>
    <loc>https://www.tudominio.com/servicios/</loc>
    <lastmod>2027-01-30</lastmod>
  </url>
</urlset>
```

Las reglas que fija Google:

- El archivo usa codificación UTF-8.
- Las URL son absolutas y completas, con protocolo. Google las rastrea tal como las escribes.
- Los valores de las etiquetas XML se escapan como entidades. Un `&` en una URL se escribe `&amp;`.
- Un sitemap tiene un límite de 50 MB sin comprimir o 50.000 URL, lo que ocurra primero.
- Si superas ese límite, divides la lista en varios sitemaps y los reúnes en un archivo índice.

## Qué incluir y qué excluir

Google pide incluir las URL que quieres ver en los resultados de búsqueda, es decir, las canónicas. Si el mismo contenido existe en varias URL, lista solo la preferida. Esa regla resuelve casi todas las dudas. Puedes usarla como filtro:

| Incluye | Excluye |
| --- | --- |
| Páginas de servicio, categorías y fichas de producto que quieres posicionar | URL con parámetros de seguimiento o de orden |
| Artículos del blog publicados y actualizados | Páginas con `noindex` |
| La versión canónica de cada página | Duplicados y versiones no canónicas |
| Páginas que responden con código 200 | URL que redirigen o devuelven error |
| Páginas con contenido propio y útil | Resultados de búsqueda interna, carritos, páginas de cuenta |

La contradicción más frecuente es pedirle a Google dos cosas opuestas: listar una página en el sitemap y marcarla con `noindex` o bloquearla en robots.txt. El sitemap dice "esta importa" y la otra señal dice "no entres". Elige una. Si quieres revisar la sintaxis del bloqueo, tenemos una guía sobre [robots.txt](/blog/robots-txt-guia/) que explica esas reglas.

También conviene vigilar que cada URL del mapa cargue bien. Una página lenta o rota no se arregla con el sitemap, y la experiencia de carga tiene su propio capítulo en [Core Web Vitals](/blog/core-web-vitals-que-son/).

## lastmod, priority y changefreq

Aquí hay mucho folclore. Esto dice Google:

- **`lastmod`:** Google lo usa solo si es coherente y verificable, por ejemplo si coincide con la fecha real de la última modificación significativa. Cambios en el contenido principal, en los datos estructurados o en los enlaces cuentan como significativos. Cambiar el año del copyright, no.
- **`priority` y `changefreq`:** Google los ignora. Puedes omitirlos sin perder nada.

La consecuencia práctica: no actualices `lastmod` en todas las URL cada vez que despliegas el sitio. Si la fecha cambia sin que cambie la página, el dato pierde credibilidad y Google deja de fiarse de él. Configura tu CMS para que la fecha solo se mueva cuando editas de verdad.

## Cómo enviarlo y comprobar que funciona

La [documentación de Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) lista estas vías de envío: el informe Sitemaps de Search Console, la API de Search Console, una línea `Sitemap:` en robots.txt y WebSub para feeds RSS o Atom. Para casi todos los sitios, estos pasos bastan:

1. Publica el archivo, de preferencia en la raíz, por ejemplo `https://www.tudominio.com/sitemap.xml`. Google señala que, salvo que lo envíes por Search Console, un sitemap solo afecta a su directorio y a los inferiores.
2. Abre Search Console, entra en el informe **Sitemaps** y pega la URL del archivo.
3. Revisa el estado. El informe te muestra si Google pudo leerlo y qué errores de procesamiento encontró.
4. Agrega la línea `Sitemap: https://www.tudominio.com/sitemap.xml` a tu robots.txt, para que cualquier rastreador lo encuentre.
5. Vuelve al informe cada cierto tiempo, y siempre después de una migración o un cambio de plantilla.

Enviar el sitemap es una sugerencia, no una certeza de rastreo. Si tras enviarlo ves URL importantes sin indexar, el problema suele estar en otro sitio: calidad del contenido, enlaces internos o bloqueos técnicos. Ese diagnóstico forma parte del servicio de [indexación y rastreo](/servicios/indexacion-y-rastreo/) y de una [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/).

## Errores comunes que conviene revisar

Una revisión útil toma menos de una hora. Descarga el sitemap, pásalo por un rastreador y filtra por código de respuesta. Todo lo que no sea 200 sobra. Después compara el número de URL del mapa con el número de páginas que realmente quieres posicionar. Si el mapa tiene el triple, está cargando filtros, etiquetas o archivos de fecha que diluyen la señal.

- **Listar URL redirigidas o con error.** Si una URL del mapa redirige, lista el destino final.
- **Incluir versiones http y https, o con y sin www, a la vez.** Deja solo la versión canónica.
- **Un sitemap generado a mano y abandonado.** Si lo mantienes manualmente, acaba desactualizado. Automatízalo.
- **Mezclar URL de varios dominios en un mismo archivo.** Cada sitemap debe contener URL de su propio sitio.
- **Rutas relativas.** Google pide URL completas.

Si tu sitio es grande, divide los sitemaps por tipo de contenido (servicios, blog, categorías). Así, el informe de Search Console te muestra qué sección tiene problemas sin tener que buscar entre miles de URL.

Hay un patrón detrás de todos: el sitemap debe reflejar tu decisión actual sobre qué páginas valen la pena, no un inventario histórico de todo lo que alguna vez existió.

**Un hábito de mantenimiento.** Trata el sitemap como parte de cada lanzamiento. Cuando publicas un artículo, la URL debe entrar sola al archivo. Cuando retiras una página, debe salir. Cuando cambias una URL, el mapa debe listar la nueva. Anota estos tres eventos en tu lista de verificación de publicación y revisa el informe de Sitemaps en Search Console una vez al mes. Si el número de URL descubiertas no coincide con lo que esperas, investiga antes de seguir publicando.

## Preguntas frecuentes

### ¿Es obligatorio tener un sitemap?

No. Google puede descubrir páginas siguiendo enlaces. Pero en sitios nuevos, grandes o con pocas conexiones internas, un sitemap acelera y ordena ese descubrimiento. Por eso casi siempre vale la pena tenerlo.

### ¿Cuántas URL puede tener un sitemap?

Hasta 50.000 URL o 50 MB sin comprimir, lo que se alcance primero. Si tu sitio es más grande, divide la lista en varios archivos y reúnelos en un archivo índice de sitemaps.

### ¿Enviar el sitemap asegura que Google indexe mis páginas?

No. Es una sugerencia que facilita el descubrimiento. Google decide qué rastrear y qué indexar según la calidad de cada página y otras señales.
