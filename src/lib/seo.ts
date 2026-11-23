/**
 * Utilidades de SEO y marcado de datos estructurados (Schema.org / JSON-LD).
 * Sin scripts ejecutables de cliente; genera objetos Schema.org válidos y compatibles
 * con Google Rich Results (Organization, WebSite, WebPage, Service, FAQPage, BreadcrumbList).
 */

// Morado oficial de marca (--color-brand-purple en tokens.css)
export const THEME_COLOR = '#' + '4228d1';
export const DEFAULT_OG_IMAGE = '/og-image.png';

export interface LandingSchemaParams {
  data: any;
  siteUrl: string;
  pageUrl: string;
  title: string;
  description: string;
  /** Ruta de la página de la autora, solo si existe en este build (ver `getLivePaths`). */
  authorPath?: string;
}

/** Zona de servicio de Loops: Venezuela y LATAM. Sin dirección ni oficina (decisión de Ari, 17-nov-2026). */
export const AREA_SERVED = [
  { '@type': 'Country', name: 'Venezuela' },
  { '@type': 'Place', name: 'América Latina' },
];

/**
 * Organization de Loops Growth. Un solo tipo (nunca LocalBusiness ni ProfessionalService: Loops no tiene oficina
 * ni dirección) con `areaServed` y sin `address` ni `priceRange`. Mismo nodo en la home y en las páginas que lo repiten.
 */
export function buildOrganization(data: any, siteUrl: string, authorPath?: string): Record<string, unknown> {
  const baseUrl = siteUrl.replace(/\/+$/, '');
  return {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: data.brand?.name?.text || 'Loops Growth',
    alternateName: 'Loops',
    url: `${baseUrl}/`,
    logo: `${baseUrl}/favicon.svg`,
    image: `${baseUrl}/og-image.png`,
    description: 'Agencia de crecimiento orgánico a través de Google, ChatGPT y Gemini.',
    email: 'hello@loopsgrowth.com',
    areaServed: AREA_SERVED,
    sameAs: ['https://ariannalupi.com', 'https://juan-tech.com', 'https://www.linkedin.com/in/arianna-lupi/'],
    founder: {
      '@type': 'Person',
      name: 'Arianna Lupi',
      jobTitle: 'Fundadora',
      ...(authorPath ? { url: `${baseUrl}${authorPath}` } : {}),
      sameAs: 'https://ariannalupi.com',
    },
    knowsAbout: ['SEO', 'Posicionamiento en IA', 'GEO', 'AEO', 'SEO para ecommerce', 'SEO técnico'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', url: `${baseUrl}/#agenda` },
  };
}

/**
 * Construye el grafo de Schema.org para la landing page de Loops Growth.
 */
export function buildLandingSchema(params: LandingSchemaParams): Record<string, unknown> {
  const { data, siteUrl, pageUrl, title, description } = params;
  const baseUrl = siteUrl.replace(/\/+$/, '');

  const organization = {
    ...buildOrganization(data, baseUrl, params.authorPath),
    employee: (data.team?.members || []).map((m: any) => ({
      '@type': 'Person',
      name: m.name?.text || '',
      jobTitle: m.role?.text || '',
      ...(m.link?.url?.text ? { sameAs: m.link.url.text } : {}),
    })),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: `${baseUrl}/`,
    name: 'Loops Growth',
    description: 'Agencia SEO para LATAM: Google y posicionamiento en IA.',
    publisher: { '@id': `${baseUrl}/#organization` },
    inLanguage: 'es',
  };

  const webpage = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    isPartOf: { '@id': `${baseUrl}/#website` },
    about: { '@id': `${baseUrl}/#organization` },
    inLanguage: 'es',
    primaryImageOfPage: `${baseUrl}/og-image.png`,
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
  };

  const serviceOffers = (data.includes?.items || []).map((item: any) => ({
    '@type': 'Offer',
    name: item.title?.text || '',
    description: item.description?.text || item.body?.text || '',
  }));

  const service = {
    '@type': 'Service',
    '@id': `${baseUrl}/#service`,
    name: 'Crecimiento Orgánico (SEO y GEO / AEO)',
    serviceType: 'Search Engine Optimization & Generative Engine Optimization',
    provider: { '@id': `${baseUrl}/#organization` },
    description:
      'Estrategia integral, auditoría SEO + AEO, ejecución técnica y optimización de contenido.',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Entregables del servicio',
      itemListElement: serviceOffers,
    },
  };

  const faqEntity = data.faq?.items?.length
    ? {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: data.faq.items.map((item: any) => ({
          '@type': 'Question',
          name: item.question?.text || '',
          acceptedAnswer: {
            '@type': 'Answer',
            text: (item.answer?.text || '').replace(/\n+/g, ' '),
          },
        })),
      }
    : null;

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${baseUrl}/`,
      },
    ],
  };

  const graph: any[] = [organization, website, webpage, service, breadcrumb];
  if (faqEntity) {
    graph.push(faqEntity);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface ArticleSchemaParams {
  siteUrl: string;
  path: string;
  title: string;
  description: string;
  datePublished: Date;
  dateModified?: Date;
  authorName: string;
  authorUrl: string;
  breadcrumbs: BreadcrumbItem[];
}

/** Grafo de un artículo: Article (autor y editor por referencia a Organization) y BreadcrumbList. Sin FAQPage: solo si el artículo trae una FAQ real. */
export function buildArticleSchema(p: ArticleSchemaParams): Record<string, unknown> {
  const base = p.siteUrl.replace(/\/+$/, '');
  const url = `${base}${p.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: p.title,
        description: p.description,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
        inLanguage: 'es',
        datePublished: p.datePublished.toISOString(),
        dateModified: (p.dateModified ?? p.datePublished).toISOString(),
        image: `${base}${DEFAULT_OG_IMAGE}`,
        author: { '@type': 'Person', name: p.authorName, url: p.authorUrl },
        publisher: { '@id': `${base}/#organization` },
      },
      buildBreadcrumb(base, p.breadcrumbs, url),
    ],
  };
}

export function buildBreadcrumb(base: string, items: BreadcrumbItem[], pageUrl: string): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}

export interface PersonSchemaParams {
  siteUrl: string;
  path: string;
  nombre: string;
  cargo: string;
  descripcion: string;
  sameAs: string[];
  conoceDe: string[];
}

/** Person de una autora o miembro del equipo, con su página como `url` y enlazada a la Organization. Sin dirección. */
export function buildPerson(p: PersonSchemaParams): Record<string, unknown> {
  const base = p.siteUrl.replace(/\/+$/, '');
  return {
    '@type': 'Person',
    '@id': `${base}${p.path}#person`,
    name: p.nombre,
    jobTitle: p.cargo,
    description: p.descripcion,
    url: `${base}${p.path}`,
    sameAs: p.sameAs,
    ...(p.conoceDe.length ? { knowsAbout: p.conoceDe } : {}),
    worksFor: { '@id': `${base}/#organization` },
  };
}
