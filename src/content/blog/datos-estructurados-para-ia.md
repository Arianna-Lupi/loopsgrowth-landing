---
title: "Schema para IA: datos estructurados que ayudan a entender tu marca"
description: "Qué es el schema para IA, qué dice Google sobre datos estructurados y cómo describir tu empresa con JSON-LD, con ejemplos que puedes copiar y adaptar."
pubDate: 2027-05-11
author: ari
cluster: L2-geo
keyword: "schema para ia"
draft: false
reviewedBy: "Juan Angulo (revisión, 2026-11-24)"
related: []
---

> **Respuesta corta:** no existe un "schema para IA". Los datos estructurados son los mismos de siempre, en formato JSON-LD con vocabulario de Schema.org, y sirven para que una máquina entienda quién eres y qué contiene cada página. Google aclara que no hace falta un marcado especial para aparecer en sus funciones de IA, así que úsalos como orden y claridad, no como atajo.

## Qué son los datos estructurados

Una página escrita para personas dice "Somos un estudio de diseño de Medellín que trabaja con empresas de salud". Una persona entiende la frase al instante. Una máquina tiene que adivinar qué es "estudio", qué es "Medellín" y si "salud" es un sector o un servicio.

Los datos estructurados son un bloque de código que dice lo mismo en un formato explícito: esto es una organización, se llama así, su sitio es este, estos son sus perfiles oficiales. Google lo resume en su [introducción a datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data): el marcado da a Google pistas explícitas sobre el significado de la página y puede habilitar resultados enriquecidos.

Dos precisiones de esa documentación que conviene tener presentes. Primera: Google admite JSON-LD, Microdata y RDFa, y recomienda JSON-LD por ser, en general, el más fácil de implementar y mantener. Segunda: el marcado puede habilitar resultados enriquecidos, no los asegura. Debe incluir las propiedades requeridas y cumplir las directrices para ser elegible.

El vocabulario viene de [Schema.org](https://schema.org/docs/gs.html), que describe cómo usar sus tipos y propiedades con Microdata, RDFa o JSON-LD.

## Qué dice Google sobre schema e IA

Esta es la parte que desmonta el mito. En su [guía sobre funciones de IA en Search](https://developers.google.com/search/docs/appearance/ai-features), Google afirma que no hay un schema.org especial que debas añadir para aparecer en AI Overviews y AI Mode, y que tampoco necesitas nuevos archivos legibles por máquinas ni archivos de texto para IA. Lo que pide es que la página esté indexada y sea elegible para mostrarse con un fragmento, y que siga las buenas prácticas de Search.

Así que cuando alguien venda "schema para ChatGPT" o "marcado exclusivo para IA", pregunta por la fuente. Para OpenAI y Perplexity no encontramos en su documentación pública una instrucción sobre datos estructurados, así que no afirmamos que los usen.

Entonces, ¿para qué sirve? Para reducir ambigüedad. Si tu nombre es común, si tu empresa tiene varios perfiles o si tu sitio describe servicios parecidos a los de otras, un marcado correcto ayuda a que Google distinga quién eres. Es un trabajo de higiene técnica con beneficios probables y ninguna promesa.

### Entidades: la idea de fondo

Una entidad es una cosa identificable: una empresa, una persona, un producto, un lugar. Los sistemas de búsqueda y los asistentes trabajan mejor cuando pueden conectar tu marca con una entidad clara y comprobar que varias fuentes dicen lo mismo de ella.

Tú no controlas todas esas fuentes, pero sí controlas tres cosas:

- **Tu sitio:** qué dices de ti y con qué marcado.
- **Tus perfiles:** redes, directorios y fichas de empresa, con el mismo nombre y los mismos datos.
- **El vínculo entre ambos:** la propiedad `sameAs`, que enlaza tu sitio con esos perfiles.

## Tres ejemplos de JSON-LD

Los tres bloques siguientes usan datos ficticios. Cámbialos por los tuyos, pega cada bloque en la página que corresponde y valida el resultado antes de publicar. Si un dato no aparece de forma visible en la página, no lo incluyas en el marcado.

### Ejemplo 1: Organization en tu página de inicio

Según la [documentación de Google sobre datos estructurados de organización](https://developers.google.com/search/docs/appearance/structured-data/organization), el marcado Organization ayuda a Google a entender los datos administrativos de tu organización y a distinguirla de otras. No tiene propiedades obligatorias, y conviene añadir todas las recomendadas que apliquen. Entre ellas están `name`, `url`, `logo`, `sameAs` y `contactPoint`.

Un ejemplo con datos ficticios que puedes adaptar:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Estudio Ejemplo",
  "url": "https://www.ejemplo.com",
  "logo": "https://www.ejemplo.com/img/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/estudio-ejemplo",
    "https://www.instagram.com/estudioejemplo"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hola@ejemplo.com",
    "contactType": "customer service"
  }
}
</script>
```

Google recomienda poner este marcado en la página de inicio o en una sola página como "Quiénes somos", no en todas. También pide usar el subtipo más específico que corresponda: `OnlineStore` para un comercio electrónico, o un subtipo de `LocalBusiness` si tienes un lugar físico.

### Ejemplo 2: Article con autoría visible

Si publicas artículos, marcar quién los escribe ayuda a conectar el contenido con una persona real:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cómo elegir un proveedor de contabilidad",
  "datePublished": "2027-02-10",
  "author": {
    "@type": "Person",
    "name": "Nombre Apellido",
    "url": "https://www.ejemplo.com/equipo/nombre-apellido/"
  }
}
</script>
```

El marcado solo funciona si refleja lo que se ve en la página. Si el JSON dice que el autor es una persona y la página no muestra ningún autor, estás marcando algo que no existe. Haz coincidir ambos.

### Ejemplo 3: FAQPage, un caso para no marcar por inercia

Durante años se recomendó marcar las preguntas frecuentes con `FAQPage` para ganar un resultado enriquecido. Según la [documentación de Google sobre FAQ](https://developers.google.com/search/docs/appearance/structured-data/faqpage), esa función dejó de mostrarse en los resultados de Google Search. Si tu sitio ya tiene ese marcado, no estorba, pero tampoco esperes un efecto visible por él. Es un buen recordatorio de que el marcado depende de lo que cada función soporte en cada momento, así que revisa la documentación vigente antes de invertir tiempo en un tipo concreto.

## Cómo implementarlo, paso a paso

1. **Haz un inventario de entidades.** Anota tu organización, tus servicios principales, tus autores y, si aplica, tus productos o ubicaciones.
2. **Elige el tipo más específico** de Schema.org para cada una.
3. **Escribe el JSON-LD** con los datos exactos que ya aparecen en tu sitio.
4. **Valida con la Prueba de resultados enriquecidos** que Google menciona en su documentación. Después de publicar, usa los informes de estado de resultados enriquecidos para vigilar que sigan siendo válidos.
5. **Comprueba el rastreo** con la herramienta de inspección de URLs de Search Console, para confirmar que Google puede leer la página.
6. **Revisa cada trimestre.** Si cambias de nombre, logo, redes o servicios, actualiza el marcado.

## Errores frecuentes

- **Marcar contenido que no está visible.** Es la forma más rápida de generar problemas.
- **Datos distintos en cada sitio.** Si tu web dice "Estudio Ejemplo SAS", LinkedIn dice "Ejemplo Studio" y un directorio dice otra cosa, el marcado no arregla esa incoherencia.
- **Copiar el JSON-LD de otra empresa** y olvidar cambiar algún dato.
- **Esperar efecto inmediato.** Los cambios de marcado tardan en procesarse, y el impacto en menciones en IA no tiene una medición oficial.
- **Marcar todo.** Un `Organization` en cada página no aporta. Marca lo que corresponde donde corresponde.

## Dónde encaja en tu estrategia de IA

Los datos estructurados son una pieza de un trabajo mayor. Para ver el mapa completo, lee [qué es AEO](/blog/que-es-aeo/) y [qué es GEO](/blog/que-es-geo-optimizacion-para-motores-generativos/). Si prefieres que alguien lo implemente, el [posicionamiento en IA](/servicios/posicionamiento-en-ia/) incluye revisión de entidades y marcado, y los servicios de [optimización para AI Overviews](/servicios/optimizacion-para-ai-overviews/) y de [optimización para ChatGPT y Perplexity](/servicios/optimizacion-para-chatgpt-y-perplexity/) abordan cada plataforma por separado. Nadie puede asegurar que un asistente te mencione, pero un sitio bien descrito tiene más posibilidades de ser entendido.

## Preguntas frecuentes

**¿Necesito programar para añadir JSON-LD?** No necesariamente. Puedes pegar el bloque en el código de tu plantilla, o usar un plugin de SEO si trabajas con un gestor de contenidos. Lo importante es validar el resultado después.

**¿JSON-LD es mejor que Microdata?** Google admite ambos y dice que son igual de válidos si el marcado es correcto, aunque recomienda JSON-LD por su facilidad de mantenimiento.

**¿Los datos estructurados aseguran que aparezca en AI Overviews?** No. Google indica que no hay marcado especial para esas funciones y que cumplir los requisitos tampoco asegura que muestre tu contenido.
