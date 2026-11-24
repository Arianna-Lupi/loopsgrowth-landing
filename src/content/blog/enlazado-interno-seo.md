---
title: "Enlazado interno SEO: reglas prácticas de anclas y páginas huérfanas"
description: "Enlazado interno SEO sin teoría de sobra: cómo escribir anclas, qué páginas enlazar primero, cómo detectar páginas huérfanas y una revisión que haces hoy."
pubDate: 2027-03-18
author: ari
cluster: L3-contenido
keyword: "enlazado interno seo"
draft: true
related: []
---

> **Respuesta corta:** el enlazado interno son los enlaces que conectan unas páginas de tu sitio con otras. Hazlo con anclas que describan el destino, enlaza desde el contenido donde el lector lo necesite y asegúrate de que ninguna página importante quede sin al menos un enlace que apunte a ella. Con eso resuelves lo esencial, y casi siempre se puede revisar en una tarde.

## Para qué sirve el enlazado interno

Un enlace interno hace dos cosas a la vez. Para la persona que lee, es una invitación a seguir con el tema. Para el buscador, es una vía de descubrimiento: la guía de Google para empezar con SEO explica que [la mayoría de las páginas nuevas que encuentra llegan a través de enlaces desde páginas que ya conoce](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). Si tu página nueva no recibe ningún enlace, descansa sobre otros mecanismos, como el mapa del sitio, y pierde el contexto que da estar conectada con el resto.

Un enlace también transmite información sobre el destino. El texto visible del enlace, llamado ancla, le cuenta a usuarios y a Google algo sobre la página enlazada. De ahí vienen las reglas que siguen.

Este artículo no repite la teoría de cómo agrupar temas. Si quieres ese planteamiento, lee antes sobre [topic clusters](/blog/que-es-un-topic-cluster/). Aquí vamos a lo práctico: anclas, prioridades, profundidad y huérfanas.

## Regla 1: escribe anclas que se entiendan solas

Google resume el criterio con una frase concreta: [una buena ancla es descriptiva, razonablemente concisa y relevante para la página donde está](https://developers.google.com/search/docs/crawling-indexing/links-crawlable). La prueba que sugiere la propia documentación sirve en la práctica: lee solo el texto del enlace, sin la frase que lo rodea, y pregúntate si sabrías adónde lleva.

Compara tres versiones del mismo enlace:

| Ancla | ¿Funciona? | Motivo |
| --- | --- | --- |
| "Haz clic aquí" | No | No dice nada del destino |
| "Más información" | No | Igual de genérica |
| "cómo hacer una investigación de palabras clave" | Sí | Describe la página y se lee natural |

Cuatro ajustes que mejoran casi cualquier ancla:

- **Usa la idea de la página, no una frase pegada al azar.** Si el destino trata de keyword research, el ancla menciona keyword research o una variante natural.
- **Acórtala.** La documentación de Google recomienda evitar anclas demasiado largas. Un ejemplo que ofrece es poner el enlace en una frase corta y dejar el resto del detalle fuera del enlace.
- **No repitas la misma ancla exacta en todos los enlaces.** Varía entre la keyword y sus variantes, igual que lo haría una persona al escribir. Google además advierte contra rellenar las anclas de palabras clave.
- **Cuida los enlaces con imagen.** Si el enlace es una imagen, el texto alternativo hace de ancla. Un enlace sin texto ni alternativa no dice nada.

Y una condición técnica que a veces se olvida: Google indica que normalmente solo puede rastrear un enlace si es un elemento `<a>` con un atributo `href`. Los enlaces construidos solo con eventos de clic o con otras etiquetas pueden no seguirse. Si tu menú o tus botones de "ver más" se programan así, revísalo con quien mantiene tu web.

Un ejemplo antes y después, tomado de un artículo hipotético sobre costura industrial:

Antes: "Si quieres saber cómo elegir una máquina, [haz clic aquí](#)."

Después: "Antes de comprar, revisa los criterios para [elegir una máquina de coser industrial](#) según el tipo de tela."

La segunda versión funciona incluso si alguien lee solo los enlaces de la página.

## Regla 2: enlaza desde el contenido, donde el lector lo necesita

Un enlace dentro del cuerpo de un artículo, en el párrafo donde se menciona el tema, es más útil que una lista de "artículos relacionados" pegada al final. Dentro del texto, el lector llega con la duda abierta y el enlace la resuelve. Google lo expresa en términos similares: enlazar recursos relacionados en contexto.

Cuando escribas un artículo nuevo, haz este ejercicio en dos sentidos:

1. **Hacia fuera.** Marca cada concepto del artículo que ya tiene su propia página en tu sitio y enlázalo en la primera mención natural.
2. **Hacia dentro.** Busca entre tus páginas existentes las que mencionan el tema del artículo nuevo y añádeles un enlace hacia él. Es la parte que casi todos olvidan: un artículo nuevo que nadie enlaza arranca aislado.

Un buen punto de partida es enlazar desde tus páginas más visitadas hacia las páginas que quieres impulsar. Search Console te ayuda a identificarlas con el informe de rendimiento. En el mismo producto, el informe de enlaces muestra qué páginas de tu sitio reciben más enlaces internos y quién enlaza a cada una. Úsalo como una muestra orientativa, no como un inventario completo: la propia ayuda de Google aclara que [ese informe no es una lista exhaustiva de todos los enlaces del sitio](https://support.google.com/webmasters/answer/9049606), puede omitir URLs y limita las tablas a 1.000 filas.

No existe una cantidad ideal de enlaces por página. Google no fija un número, aunque avisa de que si una página parece tener demasiados, probablemente los tiene. Aplica el criterio editorial: cada enlace debe ayudar al lector a seguir.

## Regla 3: cuida la profundidad

Por profundidad entendemos cuántos clics necesita una persona para llegar a una página partiendo de la página de inicio. Esto es una regla de trabajo nuestra, no una norma publicada por Google: cuanto más cerca de la portada o del menú esté una página importante, más fácil es que la encuentren personas y rastreadores.

En la práctica:

- Tus servicios principales deben colgar del menú o de la portada, no estar a cinco clics enterrados.
- Los artículos de apoyo se enlazan desde la página del servicio al que ayudan.
- Si una página importante solo se alcanza a través de listados paginados o buscadores internos, añade enlaces directos desde páginas fuertes.

Para ordenar la estructura de un sitio grande, la ayuda de Google sugiere que agrupar temas similares en directorios puede ayudar a entender con qué frecuencia cambia cada sección. Pero la misma guía aclara que no hace falta reorganizar un sitio de golpe solo por esto, porque los buscadores pueden entenderlo tal como está. Reorganiza solo si hay un problema real, y hazlo con un plan de redirecciones.

## Regla 4: encuentra y arregla las páginas huérfanas

Una página huérfana es la que no recibe ningún enlace interno desde otra página de tu sitio. Google no emplea ese término en su guía, pero sí indica algo que lo explica: cada página que quieras que se indexe [debería recibir un enlace desde al menos otra página de tu sitio](https://developers.google.com/search/docs/crawling-indexing/links-crawlable). Una página huérfana incumple esa pauta.

Cómo detectarlas con herramientas que ya tienes:

1. **Lista todas tus URLs.** Exporta las páginas de tu gestor de contenidos o de tu mapa del sitio.
2. **Lista las páginas que reciben enlaces.** Usa el informe de enlaces de Search Console o un rastreador gratuito que siga los enlaces internos desde la portada.
3. **Compara las dos listas.** Las URLs que aparecen en la primera y no en la segunda son candidatas a huérfanas. Recuerda que el informe de Search Console es una muestra, así que confirma cada caso abriendo la página y buscando enlaces a ella desde otras.
4. **Decide qué hacer con cada una.** Si la página tiene valor, enlázala desde un artículo o servicio relacionado. Si ya no sirve, redirígela a la página más cercana o retírala. Si es una página que no debe indexarse, déjala fuera del mapa del sitio.

Después de enlazar una huérfana importante, comprueba en Search Console que se indexa. El mapa del sitio ayuda al descubrimiento, y Google lo describe como un archivo opcional con las URLs que te importan, pero no reemplaza un buen enlace interno.

## Una revisión que puedes hacer hoy

Reserva una tarde y recorre esta lista con tu sitio abierto:

- [ ] Cada servicio principal tiene un enlace desde el menú o la portada.
- [ ] Cada artículo enlaza al servicio o tema del que depende.
- [ ] Ninguna ancla dice "haz clic aquí" ni "ver más".
- [ ] Las páginas que más quieres posicionar reciben enlaces desde tus páginas más visitadas.
- [ ] Revisaste las páginas huérfanas y decidiste qué hacer con cada una.
- [ ] Los enlaces importantes usan etiquetas `<a href>` y no solo eventos de clic.

Si el sitio es grande y esta tarea se acumula, forma parte del trabajo que hacemos al planear tu [estrategia de contenidos](/servicios/estrategia-de-contenidos/). El enlazado se decide mejor cuando ya sabes qué temas atacas, algo que sale de una buena [investigación de palabras clave](/servicios/investigacion-de-palabras-clave/) y se refleja en cada pieza de [redacción de artículos SEO](/servicios/redaccion-de-articulos-seo/). Si todavía estás en esa fase previa, empieza con nuestra guía sobre [cómo hacer keyword research](/blog/como-hacer-keyword-research/).

## Preguntas frecuentes

**¿Cuántos enlaces internos debe tener un artículo?** No hay un número correcto. Google no fija una cifra. Enlaza cada concepto que tenga su propia página donde el lector lo necesite y deja de enlazar cuando un enlace no ayude a seguir leyendo.

**¿Debo marcar los enlaces internos como nofollow?** Para tus propias páginas, la [documentación de Google sobre atributos de enlace](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) remite a la regla `disallow` de robots.txt como vía para impedir el rastreo, y reserva `nofollow` para enlaces que no encajan en otras categorías. En el enlazado interno normal no hace falta.

**¿Puedo repetir el mismo enlace varias veces en un artículo?** Sí, si el lector lo necesita en otro punto. Pero un solo enlace en la primera mención natural suele bastar. Más enlaces al mismo destino no mejoran nada y estorban la lectura.
