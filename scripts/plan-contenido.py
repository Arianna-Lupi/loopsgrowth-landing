#!/usr/bin/env python3
"""Genera docs/seo/plan-contenido.json y .md: calendario, ángulo y matriz de enlaces (hub-and-spoke, claude-seo:seo-cluster)."""
import json, datetime as dt

# (id, grupo/cluster, keyword, ángulo diferenciador, fase)
SERV = [
 ("auditoria-seo-tecnica","tecnico","auditoría seo técnica","Diagnóstico por plantillas de página, no URL por URL; informe priorizado por impacto y esfuerzo; qué se revisa en rastreo, indexación, velocidad y datos estructurados.",1),
 ("core-web-vitals","tecnico","core web vitals","LCP, INP y CLS con datos de campo frente a laboratorio; foco en redes móviles de LATAM y en qué cambios mueven cada métrica.",2),
 ("indexacion-y-rastreo","tecnico","indexación y rastreo","Por qué Google no indexa páginas útiles: Search Console, robots, canonicals, sitemap y presupuesto de rastreo; cómo se corrige y se vigila.",2),
 ("migracion-seo","tecnico","migración seo","Cambio de dominio, de CMS o rediseño sin perder posiciones: mapa de redirecciones, pruebas antes y después, plan de contingencia.",3),
 ("seo-internacional","tecnico","seo internacional","Un sitio para varios países hispanos: hreflang, español neutro frente a variantes locales, estructura de URL y qué páginas se duplican o se separan.",3),
 ("investigacion-de-palabras-clave","contenido","investigación de palabras clave","De la lista de frases a un mapa frase-página: intención, dificultad real, cómo se evita la canibalización; el entregable es un mapa, no un Excel suelto.",1),
 ("estrategia-de-contenidos","contenido","estrategia de contenidos seo","Clusters por tema y calendario editorial; cómo se decide qué escribir primero; revisión por quien conoce el negocio.",1),
 ("redaccion-de-articulos-seo","contenido","redacción de artículos seo","Artículos con autor visible, fuentes y revisión; cómo se evita el contenido genérico; proceso de brief, borrador y revisión.",2),
 ("optimizacion-de-contenido-existente","contenido","optimización de contenido existente","Actualizar, consolidar o eliminar lo que ya tienes: criterios para decidir, cómo se detecta el contenido que cayó o compite contra sí mismo.",2),
 ("arquitectura-web-y-enlazado-interno","contenido","arquitectura web y enlazado interno","Estructura de categorías y enlaces para que Google y las personas lleguen a lo importante en pocos clics; páginas huérfanas y anclas.",2),
 ("link-building","autoridad","link building","Enlaces que ganan por mérito: qué fuentes sirven, qué prácticas se evitan y por qué; cómo se mide la calidad sin prometer cantidades.",1),
 ("relaciones-publicas-digitales","autoridad","relaciones públicas digitales","Menciones en medios y sitios del sector con una historia real; diferencia con el link building transaccional; sirve también para IA.",3),
 ("auditoria-de-backlinks","autoridad","auditoría de backlinks","Revisar tu perfil de enlaces y el de tus competidores; cuándo un enlace daña y cuándo no hace falta desautorizar.",3),
 ("optimizacion-para-ai-overviews","ia","optimización para ai overviews","Cómo se prepara una página para aparecer en los resúmenes de IA de Google: lo que Google documenta y lo que no.",1),
 ("optimizacion-para-chatgpt-y-perplexity","ia","optimización para chatgpt y perplexity","Rastreadores de OpenAI y Perplexity, páginas citables, menciones; qué se controla y qué no en cada plataforma.",1),
 ("medicion-de-menciones-en-ia","ia","medición de menciones en ia","Batería de prompts repetida cada mes, qué se registra, cómo se lee la variabilidad de las respuestas; sin promesas.",2),
 ("seo-para-ecommerce","negocio","seo para ecommerce","Categorías, fichas de producto, filtros y paginación; dolor propio de tiendas con muchas URL; datos de producto.",2),
 ("seo-para-saas-b2b","negocio","seo para saas b2b","Ciclos de compra largos, páginas de caso de uso, integraciones y comparativas; contenido para quien evalúa y para quien decide.",3),
 ("seo-local-y-google-business-profile","negocio","seo local","Negocios con ubicación física de los clientes de Loops: ficha de Google, coherencia de datos de contacto y páginas por ciudad sin duplicar. Nunca decir que Loops tiene oficina ni usar las palabras dirección, oficina o sede en el texto: usa 'datos de contacto' y 'ubicación'.",3),
]
# artículos: (id, cluster, keyword, ángulo, fase, pilar de servicio, extra enlaces)
POST = [
 ("que-es-seo-y-como-funciona","L6-fundamentos","qué es seo","Explicación desde cero con el recorrido rastreo, indexación y posicionamiento; qué es SEO frente a lo que prometen los mitos.",1),
 ("cuanto-tarda-el-seo","L6-fundamentos","cuánto tarda el seo en dar resultados","Qué factores alargan o acortan el plazo; qué se ve en el mes 1, 3 y 6 sin cifras inventadas; horizonte de 6 a 12 meses.",1),
 ("seo-vs-sem","L6-fundamentos","seo vs sem","Diferencia práctica y cuándo conviene cada uno; cómo se combinan; sin precios.",1),
 ("como-funciona-google","L6-fundamentos","cómo funciona google","Rastreo, indexación y clasificación con fuentes de Google Search Central.",2),
 ("que-es-search-console","L6-fundamentos","qué es google search console","Guía de uso: informes que importan, cómo leerlos y errores típicos de interpretación.",2),
 ("que-es-la-intencion-de-busqueda","L6-fundamentos","intención de búsqueda","Los cuatro tipos con ejemplos en español de LATAM y cómo se detectan mirando la SERP.",2),
 ("errores-de-seo-mas-comunes","L6-fundamentos","errores de seo","Errores reales que vemos al revisar sitios; cada uno con cómo detectarlo y arreglarlo.",3),
 ("como-medir-resultados-seo","L6-fundamentos","métricas seo","Qué medir según el objetivo; diferencia entre tráfico, visibilidad y negocio; fuentes de datos.",3),
 ("como-elegir-una-agencia-seo","L4-eleccion","cómo elegir una agencia seo","Criterios verificables y cómo comprobarlos antes de firmar.",1),
 ("preguntas-para-hacer-a-una-agencia-seo","L4-eleccion","preguntas para una agencia seo","Lista de preguntas con la respuesta que debería darte una agencia seria y señales de evasión.",1),
 ("seo-in-house-vs-agencia","L4-eleccion","seo in house vs agencia","Cuándo conviene equipo interno, agencia o mixto, por tamaño y madurez del negocio.",2),
 ("que-incluye-un-servicio-de-seo-mensual","L4-eleccion","qué incluye un servicio de seo","Actividades y entregables habituales mes a mes; qué es humo; sin cifras de inversión.",2),
 ("senales-de-alerta-agencia-seo","L4-eleccion","señales de alerta agencia seo","Promesas de posición garantizada, enlaces masivos, reportes vacíos; cómo reaccionar.",2),
 ("como-leer-un-reporte-seo","L4-eleccion","reporte seo mensual","Cómo leer un reporte mensual sin perderte; métricas de vanidad frente a métricas útiles.",2),
 ("cuando-contratar-una-agencia-seo","L4-eleccion","cuándo contratar una agencia seo","Momentos del negocio en que tiene sentido y momentos en que todavía no.",3),
 ("que-es-geo-optimizacion-para-motores-generativos","L2-geo","qué es geo","Definición, qué cambia frente al SEO y qué sigue igual; sin promesas.",1),
 ("que-es-aeo","L2-geo","qué es aeo","Optimización para respuestas: asistentes, voz, fragmentos destacados; relación con GEO.",1),
 ("geo-vs-aeo-vs-seo","L2-geo","geo vs seo","Tabla comparativa y cuándo aplica cada término; por qué en la práctica se trabajan juntos.",2),
 ("como-aparecer-en-ai-overviews","L2-geo","cómo aparecer en ai overviews","Lo que Google documenta sobre AI Overviews y qué acciones razonables siguen de ahí.",2),
 ("como-aparecer-en-perplexity","L2-geo","cómo aparecer en perplexity","Cómo funciona Perplexity al citar fuentes y qué puedes preparar en tu sitio.",3),
 ("como-saber-si-chatgpt-menciona-tu-marca","L2-geo","cómo saber si chatgpt menciona mi marca","Método paso a paso con batería de prompts y registro; variabilidad de las respuestas.",2),
 ("llms-txt-sirve-para-algo","L2-geo","llms.txt","Qué es llms.txt, qué dicen las plataformas sobre usarlo y por qué no es prioridad; honestidad.",3),
 ("datos-estructurados-para-ia","L2-geo","schema para ia","Schema y entidades: qué ayuda a que una máquina entienda quién eres, con ejemplos JSON-LD.",3),
 ("core-web-vitals-que-son","L1-tecnico","core web vitals qué son","LCP, INP y CLS explicados con umbrales oficiales de Google y cómo medirlos.",1),
 ("como-indexar-una-pagina-en-google","L1-tecnico","cómo indexar una página en google","Pasos reales, por qué a veces no se indexa y qué no sirve.",1),
 ("robots-txt-guia","L1-tecnico","robots.txt","Sintaxis, ejemplos, errores que bloquean tu sitio y relación con rastreadores de IA.",2),
 ("sitemap-xml-guia","L1-tecnico","sitemap xml","Qué es, qué incluir y excluir, cómo enviarlo en Search Console.",2),
 ("etiqueta-canonical-y-contenido-duplicado","L1-tecnico","etiqueta canonical","Cuándo usar canonical, casos de contenido duplicado y errores frecuentes.",3),
 ("redirecciones-301-guia","L1-tecnico","redirección 301","301 frente a 302, cadenas de redirecciones y cómo planear una migración.",3),
 ("hreflang-para-sitios-en-espanol","L1-tecnico","hreflang","Cómo se marca el español de México, Colombia o Venezuela; errores comunes.",3),
 ("como-hacer-keyword-research","L3-contenido","cómo hacer keyword research","Método paso a paso con herramientas gratuitas y de pago; sin cifras inventadas.",1),
 ("que-es-un-topic-cluster","L3-contenido","topic cluster","Pilares y satélites explicados con un ejemplo de sitio de servicios.",2),
 ("enlazado-interno-seo","L3-contenido","enlazado interno seo","Reglas prácticas de anclas, profundidad y páginas huérfanas.",2),
 ("que-es-link-building","L3-contenido","qué es link building","Qué es, qué prácticas están contra las políticas de Google y alternativas.",3),
 ("como-redactar-un-articulo-seo","L3-contenido","cómo redactar un artículo seo","Estructura, intención, fuentes y revisión; cómo evitar el texto genérico.",3),
 ("seo-en-venezuela","L5-mercados","seo en venezuela","Cómo busca y compra el usuario venezolano con datos verificados de la investigación de mercado.",1),
 ("seo-en-mexico","L5-mercados","seo en méxico","Competencia, marketplaces y búsqueda en México con datos verificados.",2),
 ("seo-en-colombia","L5-mercados","seo en colombia","Búsqueda y comercio digital en Colombia con datos verificados.",2),
]
PAISES = [
 ("venezuela","seo","Agencia SEO en Venezuela",1),
 ("mexico","seo","Agencia SEO en México",2),
 ("colombia","seo","Agencia SEO en Colombia",2),
 ("aeo-mexico","aeo","Agencia AEO en México",3),
 ("aeo-colombia","aeo","Agencia AEO en Colombia",3),
]
PILAR = {"L1-tecnico":"auditoria-seo-tecnica","L2-geo":"posicionamiento-en-ia","L3-contenido":"estrategia-de-contenidos","L4-eleccion":None,"L5-mercados":None,"L6-fundamentos":None}
SERV_BY_CLUSTER = {"L1-tecnico":["core-web-vitals","indexacion-y-rastreo","migracion-seo","seo-internacional"],"L2-geo":["optimizacion-para-ai-overviews","optimizacion-para-chatgpt-y-perplexity","medicion-de-menciones-en-ia"],"L3-contenido":["investigacion-de-palabras-clave","redaccion-de-articulos-seo","arquitectura-web-y-enlazado-interno","optimizacion-de-contenido-existente"],"L4-eleccion":["auditoria-seo-tecnica","estrategia-de-contenidos"],"L5-mercados":[],"L6-fundamentos":["investigacion-de-palabras-clave","auditoria-seo-tecnica"]}

# calendario: martes y jueves
def slots(start, end):
    d=dt.date.fromisoformat(start); e=dt.date.fromisoformat(end); out=[]
    while d<=e:
        if d.weekday() in (1,3) and d not in (dt.date(2026,12,24),dt.date(2026,12,31),dt.date(2027,1,1)): out.append(d)
        d+=dt.timedelta(days=1)
    return out
FASES={1:("2026-12-01","2027-01-29"),2:("2027-02-02","2027-03-30"),3:("2027-04-01","2027-06-29")}
def spread(items, fase, offset):
    s=slots(*FASES[fase]); n=len(items)
    if not n: return {}
    step=len(s)/n
    return {it:s[min(len(s)-1,int(i*step)+offset)] for i,it in enumerate(items)}

items=[]
srv_dates={}; post_dates={}; pais_dates={}
for f in (1,2,3):
    srv_dates.update(spread([s[0] for s in SERV if s[4]==f],f,0))
    post_dates.update(spread([p[0] for p in POST if p[4]==f],f,0))
pd={ "venezuela":"2026-12-08","mexico":"2027-02-04","colombia":"2027-02-18","aeo-mexico":"2027-04-08","aeo-colombia":"2027-04-22"}
# no dos piezas el mismo día: desplaza artículos que coincidan con un servicio
used=set(srv_dates.values())|{dt.date.fromisoformat(v) for v in pd.values()}
for k in sorted(post_dates,key=lambda x:post_dates[x]):
    d=post_dates[k]
    while d in used or d.weekday() not in (1,3,0,2):
        d+=dt.timedelta(days=1)
    post_dates[k]=d; used.add(d)

def url_of(kind,i):
    if kind=="s": return f"/servicios/{i}/"
    if kind=="p": return f"/blog/{i}/"
    return None
paisurl={"venezuela":"/agencia-seo-venezuela/","mexico":"/agencia-seo-mexico/","colombia":"/agencia-seo-colombia/","aeo-mexico":"/agencia-aeo-mexico/","aeo-colombia":"/agencia-aeo-colombia/"}
plan={"servicios":[],"articulos":[],"paises":[]}
byc={}
for p in POST: byc.setdefault(p[1],[]).append(p[0])
for s in SERV:
    same=[x[0] for x in SERV if x[1]==s[1] and x[0]!=s[0]]
    arts=[p[0] for p in POST if s[0] in SERV_BY_CLUSTER.get(p[1],[])][:2]
    links=["/servicios/posicionamiento-en-ia/"] if s[1]=="ia" else []
    links+= [f"/servicios/{x}/" for x in same[:3]]+[f"/blog/{a}/" for a in arts]
    if s[1]=="negocio": links.append("/servicios/investigacion-de-palabras-clave/")
    plan["servicios"].append({"id":s[0],"grupo":s[1],"keyword":s[2],"angulo":s[3],"publishAt":srv_dates[s[0]].isoformat(),"enlaces":sorted(set(links))})
for p in POST:
    pillar=PILAR[p[1]]
    sib=[x for x in byc[p[1]] if x!=p[0]]
    i=sib.index(sib[0]) if sib else 0
    links=[]
    if pillar: links.append(f"/servicios/{pillar}/")
    links+= [f"/servicios/{x}/" for x in SERV_BY_CLUSTER[p[1]][:2]]
    links+= [f"/blog/{x}/" for x in sib[:2]]
    if p[1]=="L5-mercados":
        pais={"seo-en-venezuela":"venezuela","seo-en-mexico":"mexico","seo-en-colombia":"colombia"}[p[0]]
        links.append(paisurl[pais])
    if p[1]=="L4-eleccion": links.append("/")
    plan["articulos"].append({"id":p[0],"cluster":p[1],"keyword":p[2],"angulo":p[3],"pubDate":post_dates[p[0]].isoformat(),"enlaces":sorted(set(links))})
for pid,fam,name,fase in PAISES:
    plan["paises"].append({"id":pid,"familia":fam,"nombre":name,"publishAt":pd[pid],"url":paisurl[pid]})
json.dump(plan,open("docs/seo/plan-contenido.json","w"),ensure_ascii=False,indent=1)
# md
L=["# Plan de contenido y calendario de publicación\n","Generado por `scripts/plan-contenido.py`. Todo en borrador hasta la revisión de Juan; el cron diario publica en la fecha si está aprobado.\n","## Países (progresivo, una por vez)\n","| Fecha | Página |","| --- | --- |"]
for x in sorted(plan["paises"],key=lambda x:x["publishAt"]): L.append(f"| {x['publishAt']} | {x['url']} |")
L+=["\n## Servicios\n","| Fecha | Servicio | Grupo |","| --- | --- | --- |"]
for x in sorted(plan["servicios"],key=lambda x:x["publishAt"]): L.append(f"| {x['publishAt']} | /servicios/{x['id']}/ | {x['grupo']} |")
L+=["\n## Artículos\n","| Fecha | Artículo | Cluster | Keyword |","| --- | --- | --- | --- |"]
for x in sorted(plan["articulos"],key=lambda x:x["pubDate"]): L.append(f"| {x['pubDate']} | /blog/{x['id']}/ | {x['cluster']} | {x['keyword']} |")
open("docs/seo/plan-contenido.md","w").write("\n".join(L)+"\n")
print(len(plan["servicios"]),"servicios",len(plan["articulos"]),"artículos",len(plan["paises"]),"países")
