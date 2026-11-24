---
title: "llms.txt: qué es, qué dicen las plataformas y si vale la pena"
description: "llms.txt es una propuesta de archivo para guiar a los modelos de IA. Qué es, qué dice Google al respecto y por qué no es una prioridad para tu sitio."
pubDate: 2027-05-04
author: ari
cluster: L2-geo
keyword: "llms.txt"
draft: false
reviewedBy: "Juan Angulo (revisión, 2026-11-24)"
related: []
---

> **Respuesta corta:** llms.txt es una propuesta de archivo Markdown, ubicado en la raíz de tu sitio, que resume tu contenido para modelos de lenguaje. Google dice en su documentación que no necesitas archivos de texto para IA para aparecer en sus funciones de búsqueda con IA. Si tu sitio ya está bien construido, crear uno no será tu prioridad.

## Qué es llms.txt

La propuesta la publicó Jeremy Howard en septiembre de 2024. En su [sitio oficial](https://llmstxt.org/) la describe como un archivo Markdown que entrega a agentes y modelos de lenguaje una guía breve y curada de tu web. El problema que intenta resolver es práctico: una página normal trae menús, anuncios y scripts, y los modelos tienen una ventana de contexto limitada. Un resumen con enlaces a lo importante les ahorraría trabajo.

Ojo con el nombre: no se parece a `robots.txt`. Un archivo `robots.txt` da instrucciones de acceso a los rastreadores. llms.txt no bloquea ni permite nada. Es un índice legible, pensado para que un agente lo consulte cuando lo necesita.

## Cómo es un archivo llms.txt

Según la especificación de llmstxt.org, el archivo se llama `llms.txt`, vive en la raíz del sitio (`/llms.txt`) o en una subruta, y es Markdown con esta estructura:

1. Un título `#` con el nombre del sitio. Es la única parte obligatoria.
2. Un bloque de cita con un resumen corto.
3. Opcionalmente, párrafos o listas con más detalle, sin encabezados.
4. Secciones `##` con listas de enlaces, cada uno con formato `[nombre](url)` y, si quieres, una nota después de dos puntos.
5. Una sección llamada "Optional" para enlaces secundarios que un agente puede saltarse si necesita menos contexto.

Un ejemplo con una empresa ficticia, solo para ilustrar el formato:

```markdown
# Estudio Contable Ejemplo

> Estudio contable para pymes de Colombia. Explicamos impuestos, nómina y facturación electrónica en lenguaje claro.

## Servicios

- [Contabilidad mensual](https://ejemplo.com/servicios/contabilidad/): qué incluye y cómo trabajamos
- [Declaración de renta](https://ejemplo.com/servicios/renta/): para personas y empresas

## Guías

- [Factura electrónica paso a paso](https://ejemplo.com/blog/factura-electronica/)

## Optional

- [Quiénes somos](https://ejemplo.com/nosotros/)
```

La propia propuesta sugiere, además, ofrecer versiones limpias en Markdown de las páginas importantes. Si tu sitio es estático o usa un generador moderno, eso puede salir casi gratis. En un gestor de contenidos tradicional puede requerir desarrollo.

## Qué dicen las plataformas

Aquí está la parte que más importa. La propuesta existe, pero eso no significa que los buscadores la usen.

Google responde de forma directa en su [guía sobre funciones de IA en Search](https://developers.google.com/search/docs/appearance/ai-features): para aparecer en AI Overviews y AI Mode no necesitas crear "nuevos archivos legibles por máquinas, archivos de texto para IA o marcado" y tampoco hay un schema.org especial que debas añadir. Lo que sí pide es que la página esté indexada y sea elegible para mostrarse en Google con un fragmento, que cumpla los requisitos técnicos normales de Search y que siga las políticas con contenido útil y pensado para personas. Y añade que cumplir todo eso no asegura que Google rastree, indexe o muestre tu contenido.

Sobre OpenAI, Perplexity y otras plataformas: buscamos en su documentación pública para esta guía y no encontramos una instrucción oficial que diga que usan llms.txt para decidir qué citar. Que no lo mencionen no prueba que lo ignoren, pero tampoco hay base para afirmar lo contrario. Si lees un artículo que promete mejores menciones en IA por añadir este archivo, pide la fuente oficial. Si no existe, trata la afirmación como una hipótesis.

Lo que sí documenta OpenAI es cómo gestionar sus rastreadores desde `robots.txt`, en su [página de bots](https://developers.openai.com/api/docs/bots). Ese control es más concreto que un llms.txt, y lo explicamos en la [guía para aparecer en ChatGPT](/blog/como-aparecer-en-chatgpt/).

## Entonces, ¿sirve para algo?

Sirve, con expectativas ajustadas. Hay tres usos razonables:

- **Documentación técnica.** Si tienes una API o una base de conocimiento extensa, un índice en Markdown ayuda a quien use agentes de programación para consultar tu documentación. La propuesta nació en ese mundo.
- **Orden interno.** Escribir el archivo te obliga a decidir cuáles son las diez páginas que mejor explican tu negocio. Ese ejercicio es útil aunque nadie lo lea.
- **Experimento barato.** Si ya tienes el contenido bien organizado, publicarlo toma una hora. Hazlo si te interesa, anota la fecha y no esperes un cambio medible.

Lo que no conviene es poner llms.txt por delante de lo básico.

## Qué hacer antes y después de llms.txt

La decisión sobre este archivo es menor comparada con las bases del sitio. Primero lo esencial, luego, si quieres, el archivo. Esta es la secuencia que seguiríamos, y el motivo de cada paso: un asistente o un buscador solo puede usar lo que puede alcanzar y entender, y ningún índice resuelve una página que no se puede leer, que no explica nada o que contradice a tus perfiles.

### Primero, lo básico

Antes de crear ese archivo, revisa estas cinco cosas, en este orden:

1. **Tus páginas se pueden rastrear e indexar.** Si Google no puede indexar una página, no la mostrará en ninguna función. Repasa [cómo indexar una página en Google](/blog/como-indexar-una-pagina-en-google/) si tienes dudas.
2. **Cada servicio tiene una página clara.** Qué ofreces, para quién, dónde y cómo contactarte, escrito en lenguaje directo.
3. **Tus datos de empresa son coherentes** en tu web, tus perfiles y los directorios del sector.
4. **Tu contenido responde preguntas reales** con la respuesta al principio y la autoría visible.
5. **Otras fuentes confiables hablan de ti.** Las menciones externas pesan más que cualquier archivo propio.

Cuando eso funciona, entonces sí: añade llms.txt si quieres. Para el marco general, puedes leer [qué es AEO](/blog/que-es-aeo/) y [qué es GEO](/blog/que-es-geo-optimizacion-para-motores-generativos/).

### Cómo publicar un llms.txt en cuatro pasos

Si decides hacerlo:

1. Elige entre 10 y 20 páginas que expliquen bien tu negocio: servicios, guías principales, contacto.
2. Escribe el archivo con la estructura de arriba, con una descripción corta y concreta de cada enlace.
3. Súbelo a la raíz de tu sitio para que responda en `https://tudominio.com/llms.txt`, y abre la URL en el navegador para confirmar que se ve como texto.
4. Actualízalo cuando agregues o elimines páginas importantes. Un índice con enlaces rotos es peor que no tener índice.

### Dónde encaja en un trabajo de posicionamiento en IA

En el trabajo real de [posicionamiento en IA](/servicios/posicionamiento-en-ia/), llms.txt sería una tarea menor, al final de la lista. Lo que mueve la aguja, hasta donde se puede saber, es lo que describen los servicios de [optimización para AI Overviews](/servicios/optimizacion-para-ai-overviews/) y de [optimización para ChatGPT y Perplexity](/servicios/optimizacion-para-chatgpt-y-perplexity/): acceso de rastreadores, contenido claro, entidades coherentes y menciones externas. Ninguna de esas tareas asegura resultados, pero todas tienen fuentes oficiales detrás.

## Preguntas frecuentes

**¿Puede llms.txt perjudicar mi sitio?** No hay documentación oficial de Google que indique un efecto negativo. Es un archivo de texto público. El único riesgo es de mantenimiento: si lo dejas desactualizado, publicas información vieja.

**¿Reemplaza a robots.txt o al sitemap?** No. robots.txt controla qué rastreadores pueden entrar, y el sitemap ayuda a descubrir tus URL. llms.txt es un índice adicional y opcional.

**¿Debo crearlo si uso WordPress?** Puedes, subiendo el archivo a la raíz del dominio o con un plugin. Antes de instalar un plugin solo para esto, pregúntate si aporta algo que tu sitemap y tus páginas ya no cubran.
