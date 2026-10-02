import { siteUrl } from '@/server/siteUrl.js';

// /sitemap.xml -- the pages a visitor can reach from the site's own links.
const PAGES = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/our-design', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/get-free-quote', changeFrequency: 'yearly', priority: 0.8 },
  { path: '/book-consultation', changeFrequency: 'yearly', priority: 0.8 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/paint-visualizer', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/ar/modern-living-room-design-1', changeFrequency: 'yearly', priority: 0.4 },
];

export default function sitemap() {
  const base = siteUrl();
  const lastModified = new Date();
  return PAGES.map(({ path, ...rest }) => ({ url: `${base}${path === '/' ? '' : path}`, lastModified, ...rest }));
}
