---
title: "Redirección 301: guía de 301 vs 302 y migraciones"
description: "Cuándo usar una redirección 301 y cuándo una 302, cómo evitar cadenas de redirecciones y cómo planear una migración SEO paso a paso, con ejemplos."
pubDate: 2027-05-27
author: ari
cluster: L1-tecnico
keyword: "redirección 301"
draft: false
reviewedBy: "Juan Angulo (revisión, 2026-11-24)"
related: []
---

> **Respuesta corta:** una redirección 301 le dice a Google que una página se movió de forma permanente y que el destino debe ser la URL canónica. Una 302 indica un cambio temporal. Usa 301 cuando estés seguro de que no volverás atrás, apunta cada URL vieja directo a su destino final y evita las cadenas de saltos.

## Permanente o temporal: lo que cambia para Google

Una redirección envía a quien pide una URL hacia otra. Para las personas, casi no hay diferencia entre un tipo y otro. Para Google sí la hay. Su [guía de redirecciones](https://developers.google.com/search/docs/crawling-indexing/301-redirects) distingue dos grupos:

- **Permanentes (301 y 308):** Google trata el destino como la URL canónica, y ese destino es el que aparece en los resultados. La recomendación literal es usarlas cuando estás seguro de que la redirección no se revertirá.
- **Temporales (302, 303 y 307):** Google sigue la redirección, pero no considera canónico el destino. La página de origen se queda en los resultados.

Google conserva ambas URL un tiempo. Una se vuelve la canónica según el tipo de redirección, y la otra queda como alias que puede seguir apareciendo. Con el tiempo, ese alias se desvanece.

| Código | Significado | Cómo lo trata Google |
| --- | --- | --- |
| 301 | Movida permanentemente | Permanente |
| 308 | Movida permanentemente | Permanente |
| 302 | Encontrada (temporal) | Temporal |
| 303 | Ver otra | Temporal |
| 307 | Redirección temporal | Temporal |

## 301 frente a 302: cuál elegir

La regla es simple: pregúntate si la página vieja volverá a ser la protagonista.

**Usa 301 (o 308) cuando:**
- Cambias el dominio, o pasas de http a https.
- Reorganizas la estructura de URL y la antigua desaparece.
- Fusionas dos páginas en una.
- Eliminas una página y existe un sustituto claramente relevante.

**Usa 302 (o 307) cuando:**
- Haces una prueba A/B y los visitantes van a otra URL por unos días.
- Una página queda en mantenimiento y volverá.
- Redirigir es una medida provisoria, como una promoción de temporada.

El error clásico es dejar una 302 donde corresponde una 301. Si pasaste de `/servicios-seo/` a `/servicios/seo/` y configuraste un salto temporal, le pides a Google que mantenga la URL vieja como protagonista. Revisa los códigos reales de tus redirecciones en lugar de confiar en el plugin o en la configuración que alguien dejó hace años.

## Cómo implementarlas bien

Google ordena los métodos del más al menos fiable:

1. **En el servidor (preferido).** Con archivos de configuración como `.htaccess` de Apache o la configuración de NGINX, o con scripts como `header()` en PHP. Google pide usar una redirección permanente de servidor "siempre que sea posible".
2. **Meta refresh.** Una etiqueta en el `head` o una cabecera `Refresh`. Si el tiempo es cero segundos, Google la trata como permanente; si es mayor, como temporal.
3. **JavaScript** con `window.location.href`. Solo si lo anterior es imposible, porque el renderizado puede fallar y Google quizá nunca vea la redirección.

Un ejemplo de regla en Apache para una página movida:

```
Redirect 301 /servicios-seo/ https://www.tudominio.com/servicios/seo/
```

Y un equivalente en NGINX:

```
location = /servicios-seo/ {
  return 301 https://www.tudominio.com/servicios/seo/;
}
```

Después de configurar, prueba. Abre la URL vieja en el navegador y confirma a dónde llegas. En Search Console, la herramienta de inspección de URL te permite comprobar cómo la ve Google.

## Cadenas de redirecciones: por qué conviene evitarlas

Una cadena ocurre cuando A redirige a B y B redirige a C. Cada salto añade una petición extra y más ocasiones de que algo falle. En su [guía para mover un sitio con cambios de URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), Google pide redirigir directamente al destino final y evitar cadenas; si hay alguna, que sea corta, idealmente de tres saltos o menos.

Las cadenas nacen por acumulación: una migración en 2024, un rediseño en 2025 y otro cambio de URL en 2027 dejan tres capas de reglas apiladas. Para limpiarlas:

1. Exporta un rastreo de tu sitio con todas las URL que responden con 301 o 302.
2. Agrupa por destino final.
3. Reescribe cada regla para que apunte al último destino, sin pasos intermedios.
4. Actualiza también los enlaces internos para que apunten a la URL final. Una redirección sirve para visitas externas y enlaces antiguos, no para tu propia navegación.
5. Comprueba que ningún destino devuelva error ni redirija a otra parte.

La velocidad de carga también se resiente con los saltos, un tema que conecta con los [Core Web Vitals](/blog/core-web-vitals-que-son/) y con el [servicio de Core Web Vitals](/servicios/core-web-vitals/).

## Cómo planear una migración

Esta es la lista de pasos que Google da en su guía de migraciones, adaptada a un plan de trabajo:

1. **Cambia una cosa a la vez.** No combines cambio de dominio, de CMS y de diseño en el mismo lanzamiento.
2. **Elige un momento de poco tráfico.** Si el sitio es grande, considera mover por secciones.
3. **Reúne todas las URL antiguas.** Fuentes: sitemaps, registros del servidor, analítica, el CMS y el informe de enlaces de Search Console. Incluye imágenes, vídeos, CSS y JavaScript.
4. **Haz un mapa URL por URL.** Cada URL vieja se asigna a su equivalente más cercano. En un cambio simple de dominio, puede bastar una regla comodín.
5. **Evita destinos irrelevantes.** No mandes cientos de páginas distintas a la portada. Consolidar contenido similar en una página nueva sí es válido.
6. **Prepara el sitio nuevo.** Canonicals autorreferentes, anotaciones hreflang actualizadas y enlaces internos hacia las URL nuevas. Para el contenido que no migras, devuelve un 404 o un 410.
7. **Guarda un sitemap nuevo** y envíalo en Search Console. Retira el viejo.
8. **Verifica todas las variantes** (www, sin www, http, https) en Search Console, y envía el cambio de dominio (Change of Address) solo si cambias de dominio o subdominio.
9. **Monitorea.** Las URL viejas deberían bajar y las nuevas subir. Google advierte que habrá fluctuaciones temporales y que el nuevo rastreo puede tardar semanas en sitios medianos y más en los grandes.

Sobre el tiempo de vida de las reglas, Google indica que debes mantener las redirecciones al menos un año, y que puedes considerar conservarlas de forma indefinida. También afirma que las redirecciones permanentes no provocan pérdida de PageRank.

Una migración mal hecha rara vez falla por una sola causa. Falla por falta de inventario, destinos mal asignados o nadie que revise el resultado. Si tu proyecto tiene riesgo, una [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/) antes del lanzamiento y el seguimiento de [indexación y rastreo](/servicios/indexacion-y-rastreo/) después reducen sorpresas. También puedes empezar por entender [cómo indexar una página en Google](/blog/como-indexar-una-pagina-en-google/).

## Preguntas frecuentes

### ¿Una redirección 301 pasa todo el valor de la página vieja a la nueva?

Google afirma que las redirecciones permanentes no provocan pérdida de PageRank en una migración. Aun así, nadie puede prometer qué posición tendrá la página nueva: depende del contenido, del destino y de lo bien que se mapee cada URL.

### ¿Cuánto tiempo debo mantener una redirección 301?

Google recomienda mantenerla al menos un año y considerar conservarla de forma indefinida. Retirarla pronto deja sin destino a enlaces externos y marcadores antiguos.

### ¿Puedo usar JavaScript o meta refresh en lugar de una 301?

Solo como último recurso. La opción preferida es la redirección permanente en el servidor. Con JavaScript, el renderizado puede fallar y Google quizá no vea nunca la redirección.
