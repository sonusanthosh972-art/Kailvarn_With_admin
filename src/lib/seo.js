import { siteUrl } from '@/server/siteUrl.js';

// Search/social metadata shared by every public page. Next.js replaces (does
// not merge) a parent's `openGraph` when a page sets its own, so each page
// builds its full set through pageMetadata().

export const SITE_NAME = 'KailVarn';

export const BUSINESS = {
  phone: '+91-8460150027',
  email: 'kailvarn0@gmail.com',
  areas: ['Silvassa', 'Vapi', 'Daman', 'Nani Daman', 'Bhilad', 'Kachigam', 'Surangi', 'Dunetha'],
  description:
    'KailVarn is an interior design and execution company serving Silvassa, Vapi, Daman and nearby areas. One team handles free 3D design, full home interiors, modular kitchens, custom furniture and painting, with a written price agreed before work starts.',
};

const OG_IMAGE = { url: '/brand/kailvarn-mark-512.png', width: 512, height: 512, alt: 'KailVarn logo' };

// title: page-specific part; the root layout's template adds " | KailVarn".
// Pass absoluteTitle for a title that should appear exactly as written.
export function pageMetadata({ title, absoluteTitle, description, path = '/', noIndex = false }) {
  const fullTitle = absoluteTitle || `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary', title: fullTitle, description, images: [OG_IMAGE.url] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

// Business details for search engines (schema.org), rendered once in the
// public site layout.
export function businessJsonLd() {
  const base = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeAndConstructionBusiness',
        '@id': `${base}/#business`,
        name: SITE_NAME,
        description: BUSINESS.description,
        url: base,
        logo: `${base}/brand/kailvarn-mark-512.png`,
        image: `${base}/brand/kailvarn-mark-512.png`,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        address: { '@type': 'PostalAddress', addressLocality: 'Silvassa', addressCountry: 'IN' },
        areaServed: BUSINESS.areas.map((name) => ({ '@type': 'City', name })),
        openingHoursSpecification: [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        }],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Interior design and execution services',
          itemListElement: [
            'Full Home Interior Design & Execution',
            'Modular Kitchen Design & Installation',
            'Custom Furniture & Wardrobes',
            'Painting & Wall Finishes',
            'Commercial & Office Interiors',
          ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: SITE_NAME,
        publisher: { '@id': `${base}/#business` },
        inLanguage: 'en-IN',
      },
    ],
  };
}

// <script type="application/ld+json"> body; escapes "<" so data can't close the tag.
export const jsonLdHtml = (data) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
