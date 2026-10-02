import { siteUrl } from '@/server/siteUrl.js';

// /robots.txt. The admin and the JSON APIs are kept out of search results,
// except /api/media/, which serves the portfolio images Google may show in
// image search. /paint-visualizer-gemini is an internal test page.
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media/'],
      disallow: ['/admin', '/api/', '/paint-visualizer-gemini'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
