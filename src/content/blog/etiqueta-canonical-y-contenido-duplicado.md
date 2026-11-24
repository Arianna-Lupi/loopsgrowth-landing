---
title: "Etiqueta canonical: cuándo usarla y cómo evitar duplicados"
description: "Qué es la etiqueta canonical, cuándo usarla, qué casos generan contenido duplicado y los errores frecuentes que confunden a Google. Con ejemplos de código."
pubDate: 2027-05-20
author: ari
cluster: L1-tecnico
keyword: "etiqueta canonical"
draft: true
related: []
---

> **Respuesta corta:** la etiqueta canonical le dice a Google cuál de varias URL con el mismo contenido prefieres que aparezca en los resultados. Es una señal fuerte, pero no una orden: Google puede elegir otra. Úsala en páginas casi idénticas, escríbela con URL absoluta y ponla también en la página canónica como autorreferencia.

## Qué es el contenido duplicado y por qué importa

Google no publica una definición formal, pero su [guía para consolidar URL duplicadas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) habla de "páginas duplicadas o muy similares". El ejemplo típico es un producto accesible desde varias URL, incluidas algunas con parámetros de seguimiento.

El problema no es un castigo. El problema es que varias URL compiten por lo mismo: se reparten los enlaces entrantes, el rastreador gasta visitas en copias y Google puede mostrar una versión que tú no elegirías. Si no indicas nada, el buscador escoge por su cuenta la versión que considera mejor.

Estos son los casos que más aparecen en sitios reales:

- **Parámetros de URL:** `/zapatos/?utm_source=boletin` y `/zapatos/` muestran lo mismo.
- **Filtros y ordenación en categorías:** `/zapatos/?orden=nuevos` repite el listado.
- **Variantes de producto** con descripciones casi iguales (color, talla).
- **Versiones con y sin barra final**, o con http y https, o con y sin www.
- **Contenido sindicado:** un mismo artículo publicado en tu blog y en otro sitio.
- **Páginas de impresión o versiones móviles** en URL distintas.

## Cómo se escribe una etiqueta canonical

Google acepta dos formas. En páginas HTML, un elemento `link` dentro del `head`:

```html
<link rel="canonical" href="https://www.tudominio.com/zapatos/deportivos/" />
```

Para archivos que no son HTML, como un PDF, una cabecera HTTP:

```
Link: <https://www.tudominio.com/descargas/guia.pdf>; rel="canonical"
```

Los detalles que más se rompen en la práctica:

- **Usa URL absolutas.** Google admite rutas relativas, pero no las recomienda: pueden dar problemas con el tiempo, por ejemplo cuando un sitio de pruebas se rastrea por accidente.
- **Una sola forma por página.** Elige HTML o cabecera, no ambas, para no enviar señales en conflicto.
- **Un solo canonical por página.** No des canonicals distintos para la misma página con métodos distintos.
- **Nunca uses un fragmento (`#`) como canonical.**
- **En sitios con JavaScript**, pon el canonical en el HTML de origen siempre que puedas.

## Cuándo usar canonical y cuándo otra herramienta

Antes de tocar nada, haz una pregunta: ¿las dos URL necesitan existir para una persona? Si la respuesta es sí, el canonical es la herramienta. Si es no, sobra una de las dos y conviene retirarla. Mucha gente pone canonicals por reflejo en páginas que deberían desaparecer, y deja un sitio lleno de copias que nadie visita.

La misma guía de Google ordena los métodos por fuerza:

| Método | Fuerza de la señal | Cuándo usarlo |
| --- | --- | --- |
| Redirección permanente | Fuerte | Cuando la página duplicada ya no debe existir |
| `rel="canonical"` | Fuerte | Cuando ambas URL deben seguir accesibles para el usuario |
| Incluir la URL en el sitemap | Débil | Como refuerzo, nunca como único método |

Un ejemplo concreto. Una tienda tiene `/camisetas/?color=azul` y `/camisetas/`. Los visitantes necesitan el filtro, así que la URL con `color=azul` debe seguir viva. Ahí encaja el canonical: la página filtrada apunta a `/camisetas/`. En cambio, si migraste `/camisetas-hombre/` a `/camisetas/` y la primera ya sobra, lo correcto es una [redirección 301](/blog/redirecciones-301-guia/).

Puedes combinar métodos para reforzar la señal, siempre que apunten a la misma URL. Para el resto de la mecánica de descubrimiento e indexación, repasa [cómo indexar una página en Google](/blog/como-indexar-una-pagina-en-google/).

## Buenas prácticas con ejemplos

1. **Pon un canonical autorreferente.** La página canónica también declara su propia URL como canonical. Google lo recomienda de forma expresa.
2. **Enlaza internamente a la URL canónica**, no a las copias. Si tus menús apuntan a las versiones con parámetros, contradices tu propia señal.
3. **En grupos hreflang, elige un canonical del mismo idioma.** No apuntes tu versión en español a la página en inglés.
4. **Mantén la coherencia entre señales.** Si el canonical apunta a A, el sitemap debe listar A, y no B.
5. **Revisa el resultado, no solo la intención.** Como el canonical es una sugerencia, comprueba en Search Console qué URL eligió Google como canónica antes de dar el trabajo por terminado.

Un caso que genera dudas es el contenido sindicado. Si publicas un artículo en tu blog y otro sitio lo reproduce, ese sitio es quien debe decidir si apunta un canonical hacia tu versión. Tú no controlas su código, así que acuerda ese punto antes de ceder el texto. Y en tu propio sitio, si dos artículos tuyos responden a la misma pregunta, no los resuelvas con canonical: fusiónalos en uno mejor y redirige el sobrante.

Tabla rápida de decisión:

| Situación | Acción |
| --- | --- |
| Misma página con parámetros de seguimiento | Canonical a la versión limpia |
| Dos páginas que ya no necesitan convivir | Redirección permanente |
| Artículo republicado en otro sitio | Pide que ese sitio use un canonical hacia el tuyo |
| Página que no quieres en el buscador | `noindex`, no canonical |

## Errores frecuentes que confunden a Google

Google nombra tres cosas que no debes hacer para canonicalizar:

- **No uses robots.txt.** Una URL bloqueada puede indexarse igual, sin su contenido. Tampoco podrá leer el canonical que pusiste en ella. Si quieres entender esta trampa, revisa nuestra guía de [robots.txt](/blog/robots-txt-guia/).
- **No uses `noindex` para canonicalizar dentro de tu sitio.** Bloquea la página por completo en Search, y para esto se prefiere `rel="canonical"`.
- **No uses la herramienta de eliminación de URL.** Oculta todas las versiones de esa URL en Search.

Otros fallos que vemos con frecuencia al revisar sitios:

- Canonicals que apuntan a una URL que redirige, da error o está bloqueada.
- Canonical de todas las páginas de una paginación hacia la primera, lo que descarta contenido distinto.
- Plantillas que generan el mismo canonical para todo el sitio, por ejemplo la portada.
- Mezclar canonical en el HTML con otro distinto en la cabecera HTTP.

Detectar estos patrones a escala exige rastrear el sitio y comparar la URL declarada con la que Google eligió. Es parte del trabajo de una [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/) y del servicio de [indexación y rastreo](/servicios/indexacion-y-rastreo/). Si el rendimiento de tus plantillas también te preocupa, mira cómo se conecta con los [Core Web Vitals](/servicios/core-web-vitals/).

## Una revisión de diez minutos

Elige tres páginas de tu sitio: una de servicio, una de categoría y un artículo. Abre el código fuente de cada una y busca `rel="canonical"`. Comprueba que existe, que la URL es absoluta, que apunta a la propia página y que esa URL responde sin redirigir. Después abre la misma página con un parámetro inventado, como `?prueba=1`, y verifica que el canonical sigue apuntando a la versión limpia. Si algo falla en estas tres, el patrón se repite en cientos de páginas, y vale la pena corregir la plantilla.

## Preguntas frecuentes

### ¿Google siempre respeta mi etiqueta canonical?

No. Google la trata como una señal o preferencia, no como una orden. Si tus señales se contradicen, por ejemplo por enlaces internos que apuntan a otra versión, puede elegir una URL distinta. Por eso conviene mantener coherentes el canonical, los enlaces internos y el sitemap.

### ¿Cada página necesita una etiqueta canonical?

Es una buena práctica que cada página indexable declare su propia URL como canonical. Google recomienda incluir ese autorreferente en la página canónica.

### ¿Qué pasa si no pongo ninguna etiqueta canonical?

Google elige la versión que considera mejor entre las URL duplicadas. Puede acertar o no. Declarar tu preferencia reduce el margen de error, aunque no lo elimina.
