---
title: "Qué es Google Search Console y cómo usarlo bien"
description: "Qué es Google Search Console, cómo verificar tu sitio, qué informes importan, cómo leerlos y los errores de interpretación más comunes al revisar tus datos."
pubDate: 2027-02-08
author: ari
cluster: L6-fundamentos
keyword: "qué es google search console"
draft: true
related: ["que-es-seo-y-como-funciona", "cuanto-tarda-el-seo"]
---

> **Respuesta corta:** Google Search Console es un servicio gratuito de Google que te ayuda a monitorear, mantener y resolver problemas de la presencia de tu sitio en la Búsqueda de Google. Te muestra qué páginas indexó Google, con qué búsquedas aparece tu sitio y cuántos clics recibes. Es la fuente de datos más directa que tienes sobre tu SEO, siempre que sepas leerla.

## Qué es y qué no es

Search Console es una herramienta web, gratuita, que funciona desde el navegador y requiere una cuenta de Google. Según su [página de ayuda oficial](https://support.google.com/webmasters/answer/9128668), sirve para confirmar que Google puede encontrar y rastrear tu sitio, corregir problemas de indexación y pedir que se vuelvan a indexar contenidos nuevos o actualizados, ver con qué frecuencia aparece tu sitio y con qué consultas, y recibir alertas cuando Google detecta problemas.

Lo que no es: no es un programa para "posicionar" ni un lugar donde pagas por subir. No necesitas Search Console para aparecer en Google, pero sin ella trabajas casi a ciegas. No sustituye a tu herramienta de analítica del sitio: Search Console habla de lo que pasa en Google antes de que la persona entre a tu página, y la analítica habla de lo que hace después de entrar.

Si todavía no tienes claro cómo funciona el recorrido que ella te muestra, lee antes [qué es SEO y cómo funciona](/blog/que-es-seo-y-como-funciona/).

## Paso 1: crear y verificar tu propiedad

Una propiedad es el sitio que quieres monitorear. Antes de ver datos, tienes que demostrar que el sitio es tuyo. Google ofrece dos tipos de propiedad y varios métodos de verificación, según su [guía de verificación](https://support.google.com/webmasters/answer/9008080).

**Propiedad de dominio** (por ejemplo `ejemplo.com`): reúne los datos de todas las variantes de protocolo (http y https) y de todos los subdominios. Solo se verifica con un registro DNS.

**Propiedad de prefijo de URL** (por ejemplo `https://ejemplo.com`): solo cubre esa URL exacta. Se puede verificar subiendo un archivo HTML, colocando una etiqueta `<meta>` en la página principal, o con Google Analytics o Google Tag Manager si ya los usas.

Reglas prácticas para no perder el acceso:

- No borres el archivo, la etiqueta ni el registro DNS de verificación después de verificar. Google advierte que quitar el archivo te hace perder la verificación, y que debes mantener el registro DNS aunque la verificación ya haya funcionado.
- Varias personas pueden verificar la misma propiedad. Si todos los propietarios verificados pierden el acceso, todos los usuarios pierden acceso a la propiedad.
- La propiedad debe quedar a nombre de tu empresa, no de una agencia ni de un freelance. Si quien te presta el servicio se va, tú conservas tus datos.

## Paso 2: los informes que sí importan

Search Console tiene muchos informes. Para empezar, concéntrate en cuatro.

### Rendimiento en los resultados de búsqueda

Es el informe que más se consulta. Según la [ayuda del informe de rendimiento](https://support.google.com/webmasters/answer/7576553), mide cuatro cosas:

- **Clics:** cuántas veces alguien entró a tu sitio desde los resultados de Google.
- **Impresiones:** cuántas veces apareció tu sitio en los resultados.
- **CTR:** los clics divididos entre las impresiones.
- **Posición media:** la posición media del resultado más alto de tu sitio.

Puedes agrupar los datos por consulta, página, país o tipo de dispositivo. Para empezar, usa dos vistas: la de **consultas** (qué buscan las personas cuando te ven) y la de **páginas** (cuáles de tus páginas aparecen).

### Indexación de páginas

Muestra cuántas URL de tu sitio rastreó e indexó Google y por qué no indexó las demás, según la [ayuda de este informe](https://support.google.com/webmasters/answer/7440203). Cada URL está indexada o no, y tener URL sin indexar no siempre es un problema.

Dos estados se malinterpretan con frecuencia:

- **Rastreada, actualmente sin indexar:** Google descargó la página y no la añadió al índice. El informe la describe como común y no necesariamente un problema.
- **Detectada, actualmente sin indexar:** Google conoce la URL y todavía no la rastreó.

Mira este informe cada mes. Lo que te importa es que tus páginas de servicio, tus artículos y tus páginas de contacto estén en la lista de indexadas.

### Sitemaps

En este informe envías el mapa del sitio, revisas el historial de envíos y ves los errores que Google encontró al leerlo. Según la [ayuda del informe](https://support.google.com/webmasters/answer/7451001), no se sube el archivo a Google: Google lo descarga desde la URL que indicas. Los estados posibles son correcto, con errores y no se pudo recuperar. Si borras un mapa del informe, Google no olvida el mapa ni las URL que lista.

### Experiencia de la página: Core Web Vitals

Este informe usa datos de uso real, separados por móvil y escritorio, y agrupa las URL por estado (deficiente, necesita mejorar, bueno) y por métrica (LCP, INP y CLS). Según la [ayuda del informe](https://support.google.com/webmasters/answer/9205520), solo incluye URL indexadas y muestra una muestra, no una lista completa. Los datos vienen del informe CrUX, que recoge tiempos anónimos de usuarios reales. El estado de un grupo lo marca su métrica más débil.

## Paso 3: inspeccionar una URL concreta

La herramienta de inspección de URL te dice cómo ve Google una página específica. Según la [documentación de Google](https://support.google.com/webmasters/answer/9012289):

- Ofrece información sobre la versión indexada de esa página y puede probar si una URL podría indexarse.
- Si necesitas ver la versión actual, usa la prueba en vivo.
- Puedes pedir la indexación de una URL inspeccionada, pero hay un límite diario de solicitudes por propiedad.
- Pedir la indexación no asegura que la página aparezca en el índice. Google indica que normalmente tarda un día más o menos, aunque en algunos casos puede tardar mucho más.
- No puedes pedir la indexación de una página que la prueba en vivo marca como no indexable.

La consecuencia práctica: usa esta herramienta para páginas nuevas o recién corregidas que sean importantes, no para enviar tu sitio entero de golpe.

## Cómo leer los datos sin engañarte

Aquí fallan casi todos los reportes. Estos son los errores típicos de interpretación.

**Error 1: juzgar con datos del último día.** Google explica que los datos más recientes pueden ser preliminares y cambiar en las horas siguientes. Compara semanas o meses completos.

**Error 2: asumir que impresiones altas son malas si no hay clics.** Una impresión significa que tu sitio apareció en los resultados. Una página con muchas impresiones y pocos clics suele indicar que Google la considera para esa búsqueda, pero que el título, la descripción o la posición no convencen. Es una oportunidad, no un fracaso.

**Error 3: obsesionarte con la posición media.** La posición media de la gráfica se calcula sobre todo el sitio, y en la tabla se calcula por fila (por URL o por la agrupación que elijas). Mezcla búsquedas muy distintas. Una posición media que baja puede deberse a que empezaste a aparecer en búsquedas nuevas, más difíciles, y no a que perdiste lugares. Mira la posición por consulta y por página, no el promedio general.

**Error 4: sumar impresiones de dos vistas.** Google aclara que, si dos resultados de un mismo sitio aparecen para una búsqueda, cuentan como una sola impresión en el total de la gráfica. Las cifras de la gráfica y las de la tabla pueden no coincidir, y no es un error.

**Error 5: creer que "Rastreada, sin indexar" significa que algo se rompió.** El informe misma lo describe como algo común. Antes de alarmarte, pregúntate si esa página aporta algo propio y útil.

**Error 6: creer que "la URL está en Google" equivale a "aparece en las búsquedas".** Google advierte que ese estado no asegura que la página aparezca en los resultados.

**Error 7: esperar cambios inmediatos.** Google sugiere esperar unas semanas antes de evaluar si un cambio funcionó, y algunos cambios tardan meses en notarse. Más sobre esto en [cuánto tarda el SEO en dar resultados](/blog/cuanto-tarda-el-seo/).

## Rutina mensual de 30 minutos

Esta rutina funciona para un sitio pequeño o mediano.

1. **Rendimiento:** compara el último mes completo con el anterior. Anota clics, impresiones y las cinco consultas con más impresiones.
2. **Consultas con impresiones y pocos clics:** elige dos y revisa el título y la descripción de la página que aparece.
3. **Indexación:** confirma que tus páginas clave siguen indexadas y revisa si aparecieron estados nuevos.
4. **Sitemaps:** comprueba que el estado sea correcto y que el mapa incluya las páginas nuevas.
5. **Core Web Vitals:** mira si algún grupo de URL pasó a deficiente.
6. **Inspección de URL:** revisa las páginas nuevas más importantes del mes.
7. **Bitácora:** escribe qué cambiaste y cuándo, para poder explicar los movimientos del mes siguiente.

## Qué hacer con lo que descubres

Los datos solo valen si cambian una decisión. Algunos ejemplos concretos:

- Una consulta con muchas impresiones que apunta a una página débil es una señal para reescribir esa página.
- Varias consultas relacionadas que no tienen página propia señalan contenido por crear. Ahí entra la [investigación de palabras clave](/servicios/investigacion-de-palabras-clave/).
- Páginas importantes sin indexar o con errores del mapa del sitio piden una revisión técnica. Una [auditoría SEO técnica](/servicios/auditoria-seo-tecnica/) ordena esos hallazgos y los prioriza.

Search Console te dice qué pasa en Google, y el criterio sobre qué hacer con eso lo pones tú.

## Preguntas frecuentes

**¿Search Console tiene algún pago?** No. Google la describe como un servicio gratuito.

**¿Cuánto tarda en aparecer información después de verificar mi sitio?** Google no da un plazo único en las páginas que revisamos para esta guía. Verifica tu propiedad cuanto antes, porque así empiezas a acumular datos desde el principio, y revisa los informes con paciencia durante las primeras semanas.

**¿Puedo ver los datos sin ser propietario?** Google distingue entre propietarios verificados, con el nivel más alto de permisos, y otros usuarios. Los permisos de cada rol se gestionan desde la propia herramienta, así que asigna acceso a tu agencia como usuario y conserva tú la propiedad.
