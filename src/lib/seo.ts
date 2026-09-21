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
}

/**
 * Construye el grafo de Schema.org para la landing page de Loops Growth.
 */
export function buildLandingSchema(params: LandingSchemaParams): Record<string, unknown> {
  const { data, siteUrl, pageUrl, title, description } = params;
  const baseUrl = siteUrl.replace(/\/+$/, '');

  const organization = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${baseUrl}/#organization`,
    name: data.brand?.name?.text || 'Loops Growth',
    alternateName: 'Loops',
    url: `${baseUrl}/`,
    logo: `${baseUrl}/favicon.svg`,
    image: `${baseUrl}/og-image.png`,
    description:
      'Agencia de crecimiento orgánico a través de Google, ChatGPT y Gemini.',
    email: 'hello@ariannalupi.com',
    sameAs: [
      'https://ariannalupi.com',
      'https://juan-tech.com',
      'https://www.linkedin.com/in/arianna-lupi/',
    ],
    founder: {
      '@type': 'Person',
      name: 'Arianna Lupi',
      jobTitle: 'Fundadora',
      sameAs: 'https://ariannalupi.com',
    },
    employee: (data.team?.members || []).map((m: any) => ({
      '@type': 'Person',
      name: m.name?.text || '',
      jobTitle: m.role?.text || '',
      ...(m.link?.url?.text ? { sameAs: m.link.url.text } : {}),
    })),
    knowsAbout: ['SEO', 'GEO', 'AEO', 'E-commerce Growth', 'Technical SEO'],
    priceRange: '$$$',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: `${baseUrl}/#agenda`,
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: `${baseUrl}/`,
    name: 'Loops Growth',
    description: 'Agencia de SEO y GEO para marcas y e-commerce.',
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
