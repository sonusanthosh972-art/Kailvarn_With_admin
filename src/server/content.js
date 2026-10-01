import 'server-only';
import crypto from 'node:crypto';
import { col } from '@/server/db.js';
import { mediaUrl } from '@/server/b2.js';
import { PAGE_CONTENT } from '@/server/models.js';

// Editable page content. One document per page in `site_content`:
//   { _id: 'our-design', fields: {...text}, heroImages: [{ id, b2Key, thumbKey }], updatedAt, updatedBy }
// Missing fields fall back to the page's current wording (PAGE_CONTENT defaults).

export const isKnownPage = (page) => Object.hasOwn(PAGE_CONTENT, page);

export async function getPageContent(page) {
  const def = PAGE_CONTENT[page];
  const doc = await (await col('site_content')).findOne({ _id: page });
  return {
    page,
    fields: { ...def.defaults, ...(doc?.fields || {}) },
    heroImages: (doc?.heroImages || []).map((i) => ({ id: i.id, url: mediaUrl(i.b2Key), thumbUrl: mediaUrl(i.thumbKey || i.b2Key) })),
    maxHeroImages: def.maxHeroImages,
    defaults: def.defaults,
    updatedAt: doc?.updatedAt || null,
    updatedBy: doc?.updatedBy || null,
  };
}

export async function savePageFields(page, fields, adminEmail) {
  await (await col('site_content')).updateOne(
    { _id: page },
    { $set: { fields, updatedAt: new Date(), updatedBy: adminEmail } },
    { upsert: true }
  );
}

export function siteImageKeys(page, ext) {
  const id = `${Date.now().toString(36)}-${crypto.randomBytes(8).toString('hex')}`;
  const base = `${process.env.B2_KEY_PREFIX || ''}designs/_site/${page}/${id}`;
  return { id, b2Key: `${base}.${ext}`, thumbKey: `${base}-thumb.webp` };
}

export async function addHeroImage(page, image, adminEmail) {
  await (await col('site_content')).updateOne(
    { _id: page },
    { $push: { heroImages: image }, $set: { updatedAt: new Date(), updatedBy: adminEmail } },
    { upsert: true }
  );
}

export async function removeHeroImage(page, imageId) {
  const c = await col('site_content');
  const doc = await c.findOne({ _id: page });
  const img = doc?.heroImages?.find((i) => i.id === imageId);
  if (!img) return null;
  await c.updateOne({ _id: page }, { $pull: { heroImages: { id: imageId } }, $set: { updatedAt: new Date() } });
  return img;
}
