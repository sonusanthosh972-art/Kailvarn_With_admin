#!/usr/bin/env node
// One-time import of the old hardcoded portfolio (src/constants/portfolioData.js)
// into MongoDB, so every item on the Our Design page becomes editable in the
// admin. Safe to re-run: items already imported (by legacyId) are skipped.
//
//   node --env-file=.env.local tools/import-legacy-portfolio.mjs
//
// Items that have a photo are imported as "published" with that photo (an
// external image the admin can replace by uploading to B2). Items without a
// photo are imported as "draft" — upload an image and publish them in /admin.
import { MongoClient } from 'mongodb';
import { portfolioData } from '../src/constants/portfolioData.js';

const CATEGORY_BY_SUB = {
  'Living Room': 'Living Room',
  'Master Bedroom': 'Bedroom',
  'Standard Bedroom': 'Bedroom',
  'Kids Bedroom': 'Kids Bedroom',
  'Bathroom': 'Full Home',
  'Toilet': 'Full Home',
  'Full Home Overview': 'Full Home',
};
const categoryFor = (item) => CATEGORY_BY_SUB[item.subcategory] || item.category; // Kitchen/Furniture/Painting/Commercial

const slugify = (t) => String(t).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'kailvarn');
const projects = db.collection('projects');
const images = db.collection('images');

const base = Date.now();
let created = 0, skipped = 0, withPhoto = 0;
for (const [i, item] of portfolioData.entries()) {
  if (await projects.findOne({ legacyId: item.id })) { skipped++; continue; }
  let slug = slugify(item.title);
  for (let n = 2; await projects.findOne({ slug }); n++) slug = `${slugify(item.title)}-${n}`;
  // Same order as the old page: earlier items get a later publishedAt.
  const when = new Date(base - i * 1000);
  const hasPhoto = Boolean(item.imageUrl);
  const category = categoryFor(item);
  const { insertedId } = await projects.insertOne({
    legacyId: item.id,
    title: item.title,
    slug,
    category,
    subtitle: item.subcategory,
    status: hasPhoto ? 'published' : 'draft',
    description: item.description || '',
    location: '',
    tags: [item.category, item.subcategory].filter(Boolean),
    coverImageId: null,
    imageCount: hasPhoto ? 1 : 0,
    createdAt: when,
    updatedAt: when,
    publishedAt: hasPhoto ? when : null,
  });
  if (hasPhoto) {
    const img = await images.insertOne({
      projectId: insertedId,
      fileName: item.imageUrl.split('/').pop(),
      b2Key: `external/${item.id}`,           // unique placeholder; never sent to B2
      externalUrl: item.imageUrl,
      thumbKey: '',
      category,
      altText: item.title,
      contentType: 'image/jpeg',
      size: null,
      width: null,
      height: null,
      order: 0,
      createdAt: when,
      updatedAt: when,
    });
    await projects.updateOne({ _id: insertedId }, { $set: { coverImageId: img.insertedId } });
    withPhoto++;
  }
  created++;
}
console.log(`Imported ${created} portfolio items (${withPhoto} published with a photo, ${created - withPhoto} as drafts). Skipped ${skipped} already imported.`);
await client.close();
