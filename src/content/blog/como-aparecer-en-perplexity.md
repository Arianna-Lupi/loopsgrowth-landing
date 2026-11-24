---
title: "Cómo aparecer en Perplexity: qué puedes preparar en tu sitio"
description: "Cómo aparecer en Perplexity: qué hace PerplexityBot, cómo cita fuentes, qué revisar en robots.txt y en tu firewall y cómo medir si te citan."
pubDate: 2027-04-27
author: ari
cluster: L2-geo
keyword: "cómo aparecer en perplexity"
draft: false
reviewedBy: "Juan Angulo (revisión, 2026-11-24)"
related: ["que-es-aeo", "que-es-geo-optimizacion-para-motores-generativos"]
---

> **Respuesta corta:** Perplexity busca en la web en tiempo real, resume lo que encuentra y enlaza sus fuentes con citas numeradas. Para que tu sitio pueda ser una de esas fuentes, permite a PerplexityBot en tu `robots.txt` y en tu firewall, y publica páginas que respondan con claridad. Nadie controla qué fuentes elige Perplexity en cada respuesta, y esta guía no promete lo contrario.

## Cómo funciona Perplexity al citar fuentes

Según la [ayuda de Perplexity](https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work), cuando haces una pregunta el sistema busca en internet en tiempo real, interpreta la consulta, reúne lo más útil en una respuesta conversacional y la acompaña de citas numeradas que enlazan a las fuentes originales. También recuerda el contexto de las preguntas anteriores dentro de una conversación.

Dos consecuencias para quien tiene un sitio web:

- **La búsqueda es en vivo.** Perplexity no depende solo de lo que sabía en el momento de su entrenamiento. Una página nueva puede entrar en una respuesta si el sistema logra encontrarla y leerla.
- **La cita es un enlace.** Cada fuente se muestra con un número que lleva a tu página. Eso convierte la presencia en Perplexity en una posible fuente de visitas con intención, y no solo en una mención de marca.

Lo que la ayuda no explica es cómo decide Perplexity qué fuentes mostrar. Por eso no encontrarás aquí una lista de factores de ranking: no existe documentación oficial que la respalde.

## Los dos agentes que debes conocer

La [documentación de bots de Perplexity](https://docs.perplexity.ai/guides/bots) distingue dos agentes con funciones diferentes:

| Agente | Para qué sirve | Qué dice la documentación |
| --- | --- | --- |
| **PerplexityBot** | Mostrar y enlazar sitios en los resultados de Perplexity | No se usa para rastrear contenido destinado a modelos de fundación de IA |
| **Perplexity-User** | Acciones iniciadas por una persona: al hacer una pregunta, Perplexity puede abrir una página para responder y enlazarla | Generalmente ignora las reglas de `robots.txt`, porque lo dispara un usuario |

Tres cosas se desprenden de esa tabla. Primero, si quieres que Perplexity pueda mostrar tu sitio en sus resultados, la documentación recomienda permitir a PerplexityBot. Segundo, bloquearlo es una decisión legítima si prefieres no aparecer, pero entonces conviene hacerlo a conciencia. Tercero, tu `robots.txt` no controla del todo a Perplexity-User, así que si necesitas restringir esas visitas, tendrás que mirar otras capas, como las reglas de tu servidor o tu firewall.

La documentación aclara que cada ajuste es independiente y que los cambios pueden tardar hasta 24 horas en reflejarse en sus sistemas.

## Cómo permitir a PerplexityBot en tu sitio

### Paso 1: revisa tu `robots.txt`

Abre `tutienda.com/robots.txt` y busca reglas que mencionen a PerplexityBot, o reglas generales que prohíban a todos los agentes que no estén en una lista. Si ves algo así sin que nadie lo haya decidido, es una causa frecuente de ausencia.

Un ejemplo de regla que lo permite de forma explícita:

```txt
User-agent: PerplexityBot
Allow: /
```

Ajusta la ruta si hay secciones privadas que no quieras abrir, por ejemplo un panel de cliente.

### Paso 2: revisa tu firewall y tu CDN

Un `robots.txt` abierto no basta si el firewall rechaza las visitas antes de que lleguen. La documentación de Perplexity explica cómo permitirlas en dos plataformas habituales:

- **Cloudflare:** crea una regla personalizada que combine el User-Agent de cada bot con sus propios rangos de IP, usa la acción de omitir las funciones de seguridad que correspondan y colócala por encima de las reglas que bloquean. La documentación advierte que el modo Bot Fight Mode no se puede omitir con reglas personalizadas de WAF.
- **AWS WAF:** crea conjuntos de IP separados para cada bot y reglas de permitir que combinen la coincidencia de IP con la del User-Agent, con prioridad numérica menor que tus reglas de bloqueo.

Un punto delicado: la propia documentación indica usar siempre los rangos de IP vigentes de sus endpoints JSON oficiales y automatizar su actualización, porque cambian. Si copias una lista una vez y la olvidas, tu regla se queda desactualizada.

### Paso 3: confirma que tus páginas se leen como texto

Perplexity necesita leer la página para resumirla. Comprueba que lo importante esté en HTML y no escondido detrás de un inicio de sesión, de una ventana emergente obligatoria o de contenido que solo se pinta tras una interacción. Abre la página en una ventana privada y mira lo que aparece sin hacer nada más.

## Qué preparar en el contenido

Perplexity responde preguntas, así que tu página compite en ser una fuente buena para una pregunta concreta. Lo que puedes preparar, sin pretender que sea una fórmula:

1. **Una pregunta clara por página o por sección**, con un subtítulo que use las palabras del cliente.
2. **La respuesta al inicio**, en dos o tres frases que se entiendan por sí solas.
3. **Detalle útil debajo**: pasos, condiciones, excepciones, ejemplos concretos de tu sector.
4. **Autoría visible**: quién lo escribe y qué experiencia tiene.
5. **Datos de tu negocio coherentes** en tu web, tus perfiles y tus directorios.
6. **Afirmaciones sobre terceros enlazadas a su fuente oficial**, para que un lector pueda verificarlas.

Es la misma lógica de [qué es AEO](/blog/que-es-aeo/): respuesta primero, desarrollo después. Y encaja en el marco más amplio que explicamos en [qué es GEO](/blog/que-es-geo-optimizacion-para-motores-generativos/).

## Cómo comprobar si Perplexity te cita

La medición aquí es manual y se hace con constancia, no con una herramienta mágica.

1. Redacta una lista fija de diez a quince preguntas que haría un cliente antes de comprarte. Incluye algunas con el nombre de tu marca y otras sin él.
2. Una vez al mes, hazlas en Perplexity y anota tres cosas: si aparece tu marca en el texto, si tu página aparece entre las fuentes numeradas y qué otras fuentes ocupan ese lugar.
3. Compara mes contra mes. Una sola respuesta no dice mucho, porque las respuestas generadas cambian entre consultas.
4. Mira las fuentes que se repiten. Si una publicación del sector aparece una y otra vez, es una pista de dónde conviene que tu negocio también tenga presencia.
5. Revisa los registros de tu servidor o tu analítica para ver si PerplexityBot visita tus páginas. Si no ves ninguna visita después de abrir los permisos, repasa el firewall, que suele ser el bloqueo escondido.

Anota también el tráfico de referencia desde Perplexity en tu analítica, si tu herramienta lo identifica, y compáralo con las conversiones. El volumen puede ser bajo y aun así traer consultas bien orientadas.

## Lo que no puedes hacer

- **No puedes comprar un lugar** en las respuestas orgánicas. Si alguien te lo ofrece, pide documentación oficial que lo respalde.
- **No puedes forzar a Perplexity-User** con `robots.txt`: según su documentación, generalmente lo ignora.
- **No puedes prometerle a nadie** que aparecerá. Puedes preparar condiciones y medir.
- **No puedes saltarte el SEO.** Una página que ningún buscador entiende también es difícil de encontrar para otros sistemas. Revisa tu base técnica y de contenido con el servicio de [posicionamiento en IA](/servicios/posicionamiento-en-ia/).

Si quieres que alguien lo configure y lo mida contigo, mira la [optimización para ChatGPT y Perplexity](/servicios/optimizacion-para-chatgpt-y-perplexity/). Para Google, la guía equivalente está en [optimización para AI Overviews](/servicios/optimizacion-para-ai-overviews/).

## Preguntas frecuentes

**¿PerplexityBot se usa para entrenar modelos?** Según la documentación de Perplexity, PerplexityBot no se usa para rastrear contenido para modelos de fundación de IA: su función es mostrar y enlazar sitios en los resultados de Perplexity.

**¿Qué pasa si bloqueo PerplexityBot?** La documentación recomienda permitirlo para que tu sitio pueda aparecer en los resultados. Si lo bloqueas, estás optando por no aparecer ahí. Es una decisión válida, pero hay que tomarla a propósito.

**¿Cuánto tarda en reflejarse un cambio en `robots.txt`?** Perplexity indica que sus sistemas pueden tardar hasta 24 horas en reflejar los cambios. Qué ocurre después en las respuestas depende de factores que Perplexity no publica.
