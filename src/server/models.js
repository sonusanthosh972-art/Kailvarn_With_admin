import 'server-only';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { OUR_DESIGN_DEFAULTS } from '@/constants/pageContent.js';

// ---- Shared enums (also mirrored for the admin UI in src/constants/adminEnums.js)
export const DESIGN_CATEGORIES = ['Full Home', 'Living Room', 'Bedroom', 'Kids Bedroom', 'Kitchen', 'Furniture', 'Painting', 'Commercial'];
export const PROJECT_STATUSES = ['draft', 'published'];
export const LEAD_STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];
export const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // per file, after client-side optimisation

// ---- Helpers
const str = (max) => z.string().trim().max(max);
const optStr = (max) => str(max).optional().default('');
const phone = z.string().trim().min(7, 'Enter a valid phone number').max(20).regex(/^[+\d][\d\s-]{6,19}$/, 'Enter a valid phone number');
const email = z.union([z.literal(''), z.email('Enter a valid email address').max(160)]).optional().default('');

export function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(String(id)) : null;
}

export function slugify(text) {
  return String(text).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'project';
}

// ---- Public form submissions (field names match the existing forms)
export const quoteInput = z.object({
  name: str(120).min(2, 'Enter your name'),
  phone,
  email,
  city: str(120).min(2, 'Enter your city'),
  service: str(80).min(1, 'Choose a service'),
  source: optStr(80),            // "How did you find us?"
  contactMethod: optStr(40),     // preferred contact method
  projectType: optStr(80),
  budget: optStr(80),
  message: optStr(2000),
});

export const contactInput = z.object({
  name: str(120).min(2, 'Enter your name'),
  phone,
  email,
  city: optStr(120),
  service: optStr(80),
  message: optStr(2000),
});

export const consultationInput = z.object({
  name: str(120).min(2, 'Enter your name'),
  phone,
  email,
  city: str(120).min(2, 'Enter your city'),
  service: str(80).min(1, 'Choose a service'),
  projectType: optStr(80),
  datetime: optStr(40),          // <input type="datetime-local"> value, split below
  message: optStr(2000),
});

export function splitDateTime(value) {
  const [preferredDate = '', preferredTime = ''] = String(value || '').split('T');
  return { preferredDate, preferredTime: preferredTime.slice(0, 5) };
}

export const leadUpdate = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: str(4000).optional(),
});

// ---- Projects (designs)
export const projectInput = z.object({
  title: str(140).min(2, 'Title is required'),
  category: z.enum(DESIGN_CATEGORIES),
  status: z.enum(PROJECT_STATUSES).default('draft'),
  description: optStr(4000),
  location: optStr(120),
  subtitle: optStr(80),          // small label on the card, e.g. "Master Bedroom"
  videoUrl: optStr(500),         // walkthrough video URL
  tags: z.array(str(40).min(1)).max(20).optional().default([]),
});

// Partial update: only fields that are sent change. Deliberately NOT
// projectInput.partial() — in zod 4 the .default()s inside it would still
// fill missing fields ('' / 'draft') and wipe them on every PATCH.
export const projectUpdate = z.object({
  title: str(140).min(2, 'Title is required').optional(),
  category: z.enum(DESIGN_CATEGORIES).optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  description: str(4000).optional(),
  location: str(120).optional(),
  subtitle: str(80).optional(),
  videoUrl: str(500).optional(),
  tags: z.array(str(40).min(1)).max(20).optional(),
  coverImageId: z.string().optional(),
  imageOrder: z.array(z.string()).max(500).optional(),
});

// ---- Uploads
export const uploadRequest = z.object({
  projectId: z.string().min(1),
  files: z.array(z.object({
    name: str(200).min(1),
    type: z.enum(Object.keys(IMAGE_TYPES)),
    size: z.number().int().positive().max(MAX_IMAGE_BYTES, 'File is larger than 15 MB'),
    width: z.number().int().positive().max(20000).optional(),
    height: z.number().int().positive().max(20000).optional(),
    hasThumb: z.boolean().optional().default(true),
  })).min(1).max(30),
});

export const uploadComplete = z.object({
  projectId: z.string().min(1),
  uploadId: z.string().min(8).max(64),
  b2Key: z.string().min(5).max(400),
  thumbKey: z.string().max(400).optional().default(''),
  fileName: str(200),
  contentType: z.enum(Object.keys(IMAGE_TYPES)),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES),
  width: z.number().int().positive().max(20000).optional(),
  height: z.number().int().positive().max(20000).optional(),
  altText: optStr(300),
});

export const imageUpdate = z.object({ altText: str(300) });

// ---- Editable page content (site_content collection, one doc per page)
const href = z.string().trim().max(300).refine(
  (v) => v === '' || /^\/(?!\/)/.test(v) || /^(https:\/\/|tel:|mailto:)/.test(v),
  'Use a site path like /services, or an https://, tel: or mailto: link'
);
export const PAGE_CONTENT = {
  'our-design': {
    schema: z.object({
      heroEyebrow: str(60),
      heroTitle: str(140).min(2, 'Title is required'),
      heroEmphasis: str(140),
      heroLead: str(400),
      galleryEmptyText: str(200),
      ctaTitle: str(140),
      ctaText: str(500),
      ctaPrimaryLabel: str(60),
      ctaPrimaryHref: href,
      ctaSecondaryLabel: str(60),
      ctaSecondaryHref: href,
    }).refine((d) => !d.heroEmphasis || d.heroTitle.endsWith(d.heroEmphasis), {
      message: 'The gold italic part must be the last words of the title',
      path: ['heroEmphasis'],
    }),
    // Current wording of the page = defaults (used until the admin edits it)
    defaults: OUR_DESIGN_DEFAULTS,
    maxHeroImages: 4,
  },
};

// ---- Serialisers: never leak internal fields to the client
// Images either live in B2 (b2Key) or, for portfolio items imported from the
// old site, point at an external URL (externalUrl, sized on request).
const sizedExternal = (url, w) => (url.startsWith('https://images.unsplash.com') ? `${url.split('?')[0]}?auto=format&fit=crop&w=${w}&q=78` : url);

export function serializeImage(img, mediaUrl) {
  const external = img.externalUrl || null;
  return {
    id: String(img._id),
    projectId: String(img.projectId),
    fileName: img.fileName,
    b2Key: external ? null : img.b2Key,
    external: Boolean(external),
    publicUrl: external ? sizedExternal(external, 1800) : mediaUrl(img.b2Key),
    thumbUrl: external ? sizedExternal(external, 720) : img.thumbKey ? mediaUrl(img.thumbKey) : mediaUrl(img.b2Key),
    category: img.category,
    altText: img.altText || '',
    width: img.width || null,
    height: img.height || null,
    size: img.size || null,
    order: img.order ?? 0,
    createdAt: img.createdAt,
    updatedAt: img.updatedAt,
  };
}

export function serializeProject(p, { images = [], mediaUrl } = {}) {
  const imgs = images.map((i) => serializeImage(i, mediaUrl));
  const cover = imgs.find((i) => i.id === String(p.coverImageId)) || imgs[0] || null;
  return {
    id: String(p._id),
    title: p.title,
    slug: p.slug,
    category: p.category,
    status: p.status,
    description: p.description || '',
    location: p.location || '',
    subtitle: p.subtitle || '',
    videoUrl: p.videoUrl || null,
    tags: p.tags || [],
    coverImageId: cover ? cover.id : null,
    cover,
    images: imgs,
    imageCount: p.imageCount ?? imgs.length,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publishedAt: p.publishedAt || null,
  };
}

export function serializeLead(doc) {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}
