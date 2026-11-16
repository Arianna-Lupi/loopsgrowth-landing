import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '../../lib/blog';
import { siteUrl } from '../../lib/site';

// Solo artículos publicados: en producción `getPosts()` ya excluye los borradores,
// así que con cero artículos el feed sale válido y vacío.
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  return rss({
    title: 'Blog de Loops Growth',
    description: 'Guías de SEO y GEO de Loops Growth.',
    site: siteUrl,
    trailingSlash: true,
    customData: '<language>es</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
};
