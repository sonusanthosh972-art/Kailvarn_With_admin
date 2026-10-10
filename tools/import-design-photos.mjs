#!/usr/bin/env node
// Gives every imported portfolio design that still has no photo a matching
// stock photo and publishes it, so all designs from designs.js appear on the
// Our Design page. Each card label (Master Bedroom, L-Shaped Kitchen,
// Cafés…) gets its own hand-checked set of photos, rotated across its
// designs so neighbouring cards differ.
//
//   node --env-file=.env.local tools/import-design-photos.mjs           (dry run)
//   node --env-file=.env.local tools/import-design-photos.mjs --apply
//
// Safe to re-run: only designs with zero images are touched, so photos
// uploaded in /admin are never replaced. Every photo stays editable in
// /admin (upload your own, set it as cover, delete the stock one).
import { MongoClient } from 'mongodb';

const unsplash = (id) => `https://images.unsplash.com/photo-${id}`;
const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

const PHOTOS = {
  'Master Bedroom': [unsplash('1632210702485-e1841e30752a'), unsplash('1559599238-308793637427'), unsplash('1618220924273-338d82d6b886'), unsplash('1591079381491-cb2c19ce7f15')],
  'Standard Bedroom': [unsplash('1679939153964-2b9bd027f6e3'), pexels(6312079), pexels(6296926)],
  'Kids Bedroom': [unsplash('1699799462235-53a0ca5a7a43'), unsplash('1696540609399-d3f2fb8d76b8'), unsplash('1442168135051-af7aeff1c877'), unsplash('1693034433366-57fbb0286641'), unsplash('1686040087857-9e3ab3947f41')],
  'Bathroom': [unsplash('1644421439741-712c7fde7e95'), unsplash('1655216122621-871f953cf09f'), unsplash('1643949700446-7905f6e08b33'), unsplash('1603825394451-bea89af17bca')],
  'Toilet': [unsplash('1603825394631-f66fb413e970'), unsplash('1603825394451-bea89af17bca')],
  'L-Shaped Kitchen': [unsplash('1594297270189-4056091ab583'), pexels(13009887), unsplash('1699134831822-173d92d74ef2')],
  'U-Shaped Kitchen': [pexels(15409472), unsplash('1699134831822-173d92d74ef2'), pexels(13009887)],
  'Straight Kitchen': [pexels(19846388), pexels(6835116)],
  'Island Kitchen': [unsplash('1552155235-ff96c5ab1328'), unsplash('1600585152220-90363fe7e115'), pexels(8583735), pexels(3623785)],
  'Parallel Kitchen': [pexels(19846379), pexels(6301168)],
  'Open Kitchen+Dining': [pexels(1080721), unsplash('1629079447841-d04df9ee2d72'), unsplash('1680007889201-114ac772447d')],
  'Beds': [unsplash('1591079381491-cb2c19ce7f15'), unsplash('1559599238-308793637427'), pexels(6296926)],
  'Sliding Wardrobes': [unsplash('1672137233327-37b0c1049e77'), pexels(6585750)],
  'Hinged Wardrobes': [unsplash('1613193196083-f25f4acabf5a'), pexels(6312079), pexels(6296926)],
  'TV Units': [pexels(3423817), pexels(6636320), pexels(34153693)],
  'Feature Walls': [unsplash('1568598851640-422f4137426c'), unsplash('1700768352543-d7f4d2532201'), pexels(30488731), unsplash('1618220924273-338d82d6b886'), unsplash('1686040087857-9e3ab3947f41')],
  'Partitions': [pexels(2062432), pexels(2407761), unsplash('1659720879327-827462ca3942')],
  'Study Tables': [pexels(7014764), pexels(38201400), pexels(16446858), pexels(21325131), pexels(10099172)],
  'Italian Texture': [pexels(9809060), pexels(14583331), pexels(28947779)],
  'Sand Texture': [pexels(4913801), pexels(4612381), pexels(11236678)],
  'Stucco Finish': [pexels(4913793), pexels(6317431)],
  'Exterior Painting': [pexels(18408821), pexels(19168388), pexels(11435856), pexels(17174768)],
  'Cafés': [unsplash('1644644949416-52bde1bf0f4e'), unsplash('1596040014705-ceba4af8b524'), unsplash('1599579138621-934d609f41a4'), pexels(8890516), pexels(17584116), pexels(2551794)],
  'Offices': [pexels(8606292), pexels(7511753), pexels(5511124), pexels(12703093)],
  'Retail': [pexels(4940756), pexels(4914811), pexels(19599222), unsplash('1703430556574-11994feb36a7')],
  'Showrooms': [pexels(15306470), pexels(581344), pexels(12770245), pexels(5531549)],
  'Reception': [pexels(5425714), pexels(6794927)],
};

const apply = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'kailvarn');
const projects = db.collection('projects');
const images = db.collection('images');

// The legacy import dated earlier designs later, so newest-first is the
// order of designs.js; each label's designs rotate through its photos in
// that sequence.
const todo = await projects.find({ imageCount: { $in: [0, null] } }).sort({ createdAt: -1, _id: 1 }).toArray();
const seen = {};
const unmatched = [];
let done = 0;
for (const p of todo) {
  const pool = PHOTOS[p.subtitle];
  if (!pool) { unmatched.push(`${p.title} [${p.subtitle || 'no label'}]`); continue; }
  const n = (seen[p.subtitle] = (seen[p.subtitle] ?? -1) + 1);
  const url = pool[n % pool.length];
  if (!apply) { done++; continue; }
  const now = new Date();
  const img = await images.insertOne({
    projectId: p._id,
    fileName: url.split('/').pop(),
    b2Key: `external/${p._id}`,              // unique placeholder; never sent to B2
    externalUrl: url,
    thumbKey: '',
    category: p.category,
    altText: p.title,
    contentType: 'image/jpeg',
    size: null,
    width: null,
    height: null,
    order: 0,
    createdAt: now,
    updatedAt: now,
  });
  await projects.updateOne(
    { _id: p._id },
    { $set: { coverImageId: img.insertedId, imageCount: 1, status: 'published', publishedAt: p.publishedAt || p.createdAt || now, updatedAt: now } }
  );
  done++;
}
console.log(`${apply ? 'Published' : 'Would publish'} ${done} designs with a matching photo.`);
for (const [label, count] of Object.entries(seen)) console.log(`  ${label}: ${count + 1} designs, ${PHOTOS[label].length} photos`);
if (unmatched.length) console.log(`No photo set for ${unmatched.length} (left as drafts): ${unmatched.join(', ')}`);
if (!apply) console.log('Dry run only. Re-run with --apply to write to the database.');
await client.close();
