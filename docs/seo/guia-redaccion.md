# Guía de redacción para servicios, artículos y páginas país

Lee esto completo antes de escribir. Repo: `/Users/juan/Documents/Codigo/Arianna/loopsgrowth`. Plan maestro (fechas, ángulo, keyword y enlaces de cada pieza): `docs/seo/plan-contenido.json`. Esquemas exactos: `src/content.config.ts`. Ejemplos aprobados: `src/content/blog/como-aparecer-en-chatgpt.md`, `src/content/blog/agencia-seo-vs-especialista-seo.md`, `src/content/paginas/posicionamiento-en-ia.yaml`.

## Quién habla
Loops Growth: equipo de Arianna Lupi que ejecuta SEO y posicionamiento en IA en español para empresas de LATAM, trabajo remoto. Español neutro, trato de tú, sin voseo. Voz directa, práctica, honesta. Frases de largo variado, voz activa, sin muletillas de IA ("es importante destacar", "en el panorama actual", "no solo... sino también", listas de tres por reflejo). Nada de rayas largas (— o –): usa coma, punto o dos puntos.

## Reglas duras (una violación bloquea la publicación)
1. Prohibido en el texto visible: precio(s), tarifa(s), costo(s), cuesta(n), presupuesto, garantía, garantizado, USD, $ con cifra, oficina, sede, dirección, visítanos, reseñas, testimonios, estrellas, "hemos ayudado", "casos de éxito", rayas largas, "falta confirmar". Si el tema pide hablar de dinero, usa "inversión" sin cifra o "valor". Si hablas de datos de contacto de un negocio, escribe "datos de contacto" o "ubicación", nunca "dirección".
2. Cero datos inventados: ninguna cifra, porcentaje, estudio, nombre de cliente, caso, plazo prometido ni "según estudios". Toda afirmación sobre Google, OpenAI, Perplexity, Bing, Schema.org u otro tercero se verifica abriendo su documentación oficial con WebFetch y se enlaza (https). Si no puedes verificarla, no la escribas.
3. Sin promesas: nunca "primer lugar", "resultados en X días", "aparecerás". Nadie garantiza posición ni menciones en IA.
4. Loops no tiene oficina ni clientes citables en este texto. No afirmes ubicación física, número de clientes ni resultados propios.
5. Voz activa siempre. Sin voseo (vos, tenés, querés, hacé).
6. Cada pieza debe pasar la prueba "valdría publicarse aunque no existieran las demás": un ángulo propio (campo `angulo` del plan), ejemplos concretos, algo que el lector pueda hacer hoy. Nada de relleno ni de repetir el mismo texto con otra palabra clave.
7. No pises el ángulo ni la keyword de otra pieza del plan. Lee los `keyword` y `angulo` de las demás.

## Enlaces internos (hub-and-spoke)
Cada pieza enlaza, dentro del cuerpo y con ancla natural (la keyword o una variante, nunca "haz clic aquí"), a todas las rutas de su campo `enlaces` del plan: mínimo 3. Usa rutas relativas como `/servicios/link-building/` o `/blog/seo-vs-sem/`. Si la ruta aún no existe, igual se escribe: el sitio quita el enlace hasta que la página salga y lo activa solo después. Además incluye 2 o más enlaces externos https a fuentes oficiales o autoritativas que verificaste.

## Artículo del blog (`src/content/blog/<id>.md`)
Front matter exacto (YAML estricto, sin campos extra):
```
---
title: "..."            # 10 a 70 caracteres, lleva la keyword
description: "..."      # 70 a 160 caracteres
pubDate: AAAA-MM-DD     # el del plan
author: ari
cluster: L1-tecnico|L2-geo|L3-contenido|L4-eleccion|L5-mercados|L6-fundamentos
keyword: "..."          # la del plan
draft: true             # siempre true: revisa Juan
related: []             # opcional, hasta 3 ids
---
```
Cuerpo: empieza con un bloque `> **Respuesta corta:** ...` de 2 o 3 frases. Después secciones `##` (4 a 7) con un `##` por idea, mínimo 1200 y máximo 1900 palabras. Incluye al menos un elemento práctico (lista de pasos, checklist, tabla comparativa o ejemplo con código) y una sección final `## Preguntas frecuentes` con 3 preguntas reales y respuestas breves. Sin título `#` (el título sale del front matter). Sin imágenes. Sin CTA (la plantilla ya la pone).

## Servicio (`src/content/paginas/<id>.yaml`)
Campos obligatorios: `tipo: servicio`, `ruta: /servicios/<id>/`, `nombre`, `draft: true`, `title` (10 a 70), `description` (70 a 160), `h1` (10 o más, lleva la keyword), `intro` (dos párrafos, 120 o más caracteres), `secciones` (3 a 4, cada `cuerpo` de 120 o más caracteres, formato `|` con párrafos o listas con `- `), `senales` (3 a 6 frases de 15 o más caracteres: "señales de que lo necesitas"), `entregables` (4 a 6, `titulo` 5 o más, `texto` 30 o más), `proceso` (3 a 5 pasos propios del servicio, no genéricos), `faq` (4 con `pregunta` y `respuesta`), `grupo`, `publishAt` (del plan), `pendientes` (lista: siempre incluye "Juan o Ari: confirmar que Loops presta este servicio" y lo que no pudiste verificar). No uses los campos `chat`, `etapas` ni `medicion`. Mínimo 600 palabras entre todo el texto. Enlaces internos con `[ancla](/ruta/)` dentro de los cuerpos y de las respuestas del faq. Describe qué hace Loops con verbos generales (revisamos, priorizamos, entregamos, medimos) y qué recibe el cliente, sin cifras ni promesas.

## Validación (haz esto al terminar cada archivo)
- Parsea el YAML o el front matter con `node -e` y la librería `yaml` (está en node_modules) para comprobar que es válido.
- Ejecuta `node scripts/check-programmatic.mjs` y arregla todo `FAIL` de TUS archivos (ignora fallos de archivos que escriben otros agentes en paralelo).
- Cuenta palabras y largo de `title` y `description`.
- NO ejecutes `npm run build`, `git` ni toques archivos que no sean los tuyos. Otros agentes escriben a la vez.
