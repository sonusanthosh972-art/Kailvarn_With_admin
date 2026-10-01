import 'server-only';
import { col } from '@/server/db.js';
import { refreshImageCount } from '@/server/designs.js';

// Saves one uploaded image's metadata (after its object is confirmed in B2)
// at the end of the project's image order; becomes the cover if none yet.
export async function registerImage(project, meta) {
  const images = await col('images');
  const last = await images.find({ projectId: project._id }).sort({ order: -1 }).limit(1).next();
  const now = new Date();
  const doc = {
    projectId: project._id,
    fileName: meta.fileName,
    b2Key: meta.b2Key,
    thumbKey: meta.thumbKey || '',
    category: project.category,
    altText: meta.altText || project.title,
    contentType: meta.contentType,
    size: meta.size,
    width: meta.width || null,
    height: meta.height || null,
    order: last ? (last.order ?? 0) + 1 : 0,
    createdAt: now,
    updatedAt: now,
  };
  const { insertedId } = await images.insertOne(doc);
  if (!project.coverImageId) {
    await (await col('projects')).updateOne({ _id: project._id, coverImageId: null }, { $set: { coverImageId: insertedId } });
  }
  await refreshImageCount(project._id);
  return { ...doc, _id: insertedId };
}
