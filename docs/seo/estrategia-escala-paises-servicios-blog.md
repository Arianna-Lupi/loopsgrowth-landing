# Estrategia de escala: páginas por país, 20 servicios y 40 artículos

Fecha: 2026-11-24. Estado: PROPUESTA para Ari. Nada de esto está en producción.
Parte de lo que ya está publicado: home, Posicionamiento en IA, Nosotros, página de Ari y 2 artículos.

## 1. Qué cambia respecto a la estrategia del 17-nov

| Tema | Decisión del 17-nov | Pedido de Ari (24-nov) |
| --- | --- | --- |
| Países | Venezuela y Caracas en diciembre. Colombia condicionada al mes 3 y a tener cliente o caso. Chile y México después de febrero | Venezuela, México y Colombia |
| Variante AEO | No existía | AEO México y AEO Colombia |
| Servicios | 1 página de servicio (Posicionamiento en IA) | Al menos 20 |
| Blog | 2 artículos | Al menos 40 |

Ari revierte su propia condición de Colombia y adelanta México. Pido que lo confirme por escrito, porque el código y la guarda hoy dicen lo contrario.

## 2. El riesgo que hay que resolver antes de escribir

Cinco páginas que solo cambian el nombre del país son contenido a escala sin valor propio. Las políticas de spam de Google lo penalizan, y la penalización puede alcanzar a todo el dominio, incluida la home que hoy posiciona.

Regla para que cada página país se justifique:

- 3 o más hechos del mercado con fuente https (cómo busca la gente, plataformas, regulación, pagos).
- Sectores o tipos de negocio de ese país, con ejemplos reales.
- Al menos 40 % de texto único frente a las otras páginas.
- Preguntas frecuentes propias, sacadas de búsquedas reales de ese país.
- Sin precios, garantías, dirección, oficina ni reseñas. Loops trabaja de forma remota.

Si un país no cumple, sigue en borrador. La guarda `check:programmatic` ya bloquea el resto.

Para AEO por país se mantiene la misma regla, y además cada una debe diferenciarse de su página SEO hermana: distinta intención (aparecer en respuestas de ChatGPT, Gemini y AI Overviews frente a posicionar en el buscador), distinta batería de prompts y distintos ejemplos.

## 3. Arquitectura propuesta

```
/                                   home (agencia SEO en LATAM)
/agencia-seo-venezuela/             país SEO
/agencia-seo-mexico/                país SEO
/agencia-seo-colombia/              país SEO
/agencia-aeo-mexico/                país AEO
/agencia-aeo-colombia/              país AEO
/servicios/                         índice de servicios
/servicios/<servicio>/              20 servicios
/blog/                              índice
/blog/<articulo>/                   40 artículos, en 5 grupos temáticos
```

Venezuela AEO queda fuera por ahora: Ari no lo pidió y la demanda no está medida.

Enlazado: cada página país enlaza a 3 o 4 servicios y 2 o 3 artículos de su grupo. Cada artículo enlaza a su servicio y a una página país. Los servicios enlazan entre sí por afinidad.

## 4. Los 20 servicios (propuesta, Ari confirma cuáles ofrece de verdad)

Ninguna página se publica con un servicio que Loops no preste.

**SEO técnico**
1. Auditoría SEO técnica
2. Core Web Vitals y velocidad
3. Indexación y rastreo
4. Migración SEO
5. SEO internacional y hreflang

**SEO de contenido**
6. Investigación de palabras clave
7. Estrategia de contenidos y clusters
8. Redacción de artículos SEO
9. Optimización de contenido existente
10. Arquitectura web y enlazado interno

**Autoridad**
11. Link building
12. Relaciones públicas digitales
13. Auditoría de backlinks y limpieza

**Posicionamiento en IA (GEO y AEO)**
14. Posicionamiento en IA (ya publicada)
15. Optimización para AI Overviews de Google
16. Optimización para ChatGPT y Perplexity
17. Medición de menciones en IA

**Por tipo de negocio**
18. SEO para ecommerce
19. SEO para SaaS B2B
20. SEO local y Google Business Profile

Cada servicio necesita: qué incluye, a quién sirve, cómo se trabaja, entregables y 3 preguntas frecuentes. Mínimo 600 palabras únicas, con un dato o ejemplo real de Loops.

## 5. Los 40 artículos (propuesta de grupos)

Distribución: 8 artículos por grupo. Dos ya existen.

| Grupo | Enlaza a | Ejemplos de tema |
| --- | --- | --- |
| A. Fundamentos de SEO y elegir agencia | Home y servicios 1 a 10 | Agencia SEO vs especialista (publicado), cuánto tarda el SEO, cómo evaluar una agencia, SEO vs SEM |
| B. Aparecer en IA | Servicios 14 a 17 y páginas AEO | Cómo aparecer en ChatGPT (publicado), qué es GEO, qué es AEO, cómo medir menciones en IA |
| C. SEO técnico | Servicios 1 a 5 | Core Web Vitals, indexación, migraciones, hreflang |
| D. Contenido y autoridad | Servicios 6 a 13 | Clusters, enlazado interno, link building sin riesgo |
| E. Mercados LATAM | Páginas país | Cómo busca el cliente venezolano, mexicano y colombiano; SEO en español neutro frente a local |

Los artículos del grupo E salen solo si hay datos reales de cada mercado, con fuente.

Cada artículo: autor con perfil publicado, Ari como revisora, fecha real, fuentes citadas, sin cifras inventadas.

## 6. Calendario realista

Ritmo sostenible con revisión de Ari: 6 a 8 artículos al mes.

| Fase | Mes | Entrega |
| --- | --- | --- |
| 1 | Dic 2026 a ene 2027 | Venezuela y Caracas si llegan los datos. 6 servicios (grupo SEO técnico y contenido). 10 artículos |
| 2 | Feb a mar 2027 | México SEO y Colombia SEO. 7 servicios. 15 artículos |
| 3 | Abr a jun 2027 | AEO México y AEO Colombia. 7 servicios restantes. 15 artículos |

Publicar de golpe 65 páginas nuevas en un dominio con pocas páginas se ve como contenido a escala. Por eso el goteo.

## 7. Cambios de código que esto exige

- Subir el techo de la guarda de 14 páginas programáticas. Total previsto: 5 países, más ciudades. Los servicios y artículos no cuentan como programáticos.
- Aceptar `agencia-aeo-<pais>` como segunda familia de URL.
- Colección de servicios con índice `/servicios/`.
- Cambiar la regla de países en `docs/seo/paises-plantilla-y-datos.md`.
- Ampliar el sitemap y el menú (hoy el menú solo enseña lo publicado, eso se mantiene).

## 8. Lo que necesito de Ari

1. Confirmar por escrito que Colombia y México entran ahora, y que se retira la condición de caso real.
2. Lista final de servicios que Loops presta, de los 20 propuestos.
3. Por país (Venezuela, México, Colombia): 3 hechos del mercado con fuente, sectores atendidos, y si hay clientes citables.
4. Si habrá apoyo de redacción: 40 artículos con revisión suya no caben en una sola persona.
5. Aprobar el gasto de SerpAPI para medir las SERPs de México y Colombia antes de escribir (en la línea base de 2026-11-13 solo se midió Venezuela).
6. El export de GSC con país VEN y `demanda_terminos_venezuela.md`.

## 9. Lo que no cambia

Sin precios ni garantías, sin dirección, sin datos inventados, borrador hasta que Ari apruebe por escrito.
