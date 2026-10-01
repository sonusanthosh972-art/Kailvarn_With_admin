import 'server-only';
import { col } from '@/server/db.js';
import { mediaUrl, deleteObjects } from '@/server/b2.js';
import { serializeProject, slugify, toObjectId } from '@/server/models.js';

// Loads projects with their images (ordered) in two queries, not N+1.
export async function withImages(projects) {
  if (!projects.length) return [];
  const images = await (await col('images'))
    .find({ projectId: { $in: projects.map((p) => p._id) } })
    .sort({ order: 1, createdAt: 1 })
    .toArray();
  const byProject = new Map();
  for (const img of images) {
    const k = String(img.projectId);
    if (!byProject.has(k)) byProject.set(k, []);
    byProject.get(k).push(img);
  }
  return projects.map((p) => serializeProject(p, { images: byProject.get(String(p._id)) || [], mediaUrl }));
}

// Find by ObjectId or slug.
export async function findProject(idOrSlug, extraFilter = {}) {
  const projects = await col('projects');
  const _id = toObjectId(idOrSlug);
  return projects.findOne(_id ? { _id, ...extraFilter } : { slug: String(idOrSlug), ...extraFilter });
}

export async function uniqueSlug(title, excludeId) {
  const projects = await col('projects');
  const base = slugify(title);
  let slug = base;
  for (let i = 2; await projects.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }); i++) {
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function refreshImageCount(projectId) {
  const count = await (await col('images')).countDocuments({ projectId });
  await (await col('projects')).updateOne({ _id: projectId }, { $set: { imageCount: count, updatedAt: new Date() } });
  return count;
}

// Deletes image docs + their B2 objects. Re-points the cover if needed.
export async function deleteImages(filter) {
  const images = await col('images');
  const docs = await images.find(filter).toArray();
  if (!docs.length) return 0;
  await deleteObjects(docs.flatMap((d) => [d.b2Key, d.thumbKey].filter(Boolean)));
  await images.deleteMany({ _id: { $in: docs.map((d) => d._id) } });
  const projectIds = [...new Set(docs.map((d) => String(d.projectId)))].map(toObjectId);
  const projects = await col('projects');
  for (const pid of projectIds) {
    const p = await projects.findOne({ _id: pid });
    if (!p) continue;
    if (p.coverImageId && docs.some((d) => String(d._id) === String(p.coverImageId))) {
      const next = await images.find({ projectId: pid }).sort({ order: 1 }).limit(1).next();
      await projects.updateOne({ _id: pid }, { $set: { coverImageId: next ? next._id : null } });
    }
    await refreshImageCount(pid);
  }
  return docs.length;
}
