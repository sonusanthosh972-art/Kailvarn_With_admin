// Built-in wording of admin-editable pages. Used as defaults by the server
// (src/server/models.js PAGE_CONTENT) and as the first render / offline
// fallback on the public page. Editing happens in /admin/content/<page>.
export const OUR_DESIGN_DEFAULTS = {
  heroEyebrow: 'Our Portfolio',
  heroTitle: 'Designs That Inspire, Spaces That Transform',
  heroEmphasis: 'Spaces That Transform',
  heroLead: 'Browse our portfolio of modern, elegant Indian interior designs — real projects, real quality.',
  galleryEmptyText: 'No designs found for this category.',
  ctaTitle: "Like What You See? Let's Design Your Space",
  ctaText: 'Every design you see was built by the same KailVarn team that will design and execute your project — same quality, same care.',
  ctaPrimaryLabel: 'Get Free Design Consultation',
  ctaPrimaryHref: '/get-free-quote',
  ctaSecondaryLabel: 'View Our Services',
  ctaSecondaryHref: '/services',
};

// Site-wide advertisement (Admin -> Advertisement). Shown as a popup on top of
// the page; once closed it shrinks to a sticky tab on the right edge of every
// page. In any text, "{discount}" becomes the discount number and "{title}"
// the offer name (e.g. Diwali).
export const PROMO_DEFAULTS = {
  enabled: true,
  startDate: '',
  endDate: '',
  popup: 'always', // always: every homepage load/refresh · session: once per visit · daily: once a day · tab: never pops up, tab only
  title: 'Diwali', // offer name: used on the tab, quote page and saved leads
  tabLabel: '{title} Offer',
  eyebrow: 'This {title}',
  headline: 'Bring New Colours to Your Home',
  headlineEmphasis: 'New Colours', // painted in maroon; must be words from the headline
  lead: 'Make this {title} brighter with professional painting services from KailVarn.',
  discount: 25,
  offerText: 'On Painting Services',
  ribbonText: 'With Any Paint Brand',
  feature1: 'Professional Painting Services',
  feature2: 'Premium Finish',
  feature3: 'Clean & Timely Work',
  feature4: 'Limited Time {title} Offer',
  ctaLabel: 'Claim {discount}% Off',
  ctaHref: '/painting-quote',
  showVisualizer: true,
  showConsultation: true,
};
