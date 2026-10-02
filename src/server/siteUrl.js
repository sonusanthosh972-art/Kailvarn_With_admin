// The site's public origin, for robots.txt and sitemap.xml. Set
// NEXT_PUBLIC_SITE_URL once the custom domain (kailvarn.com) is live; until
// then Vercel's own production hostname is used, which it provides on every
// build.
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}
