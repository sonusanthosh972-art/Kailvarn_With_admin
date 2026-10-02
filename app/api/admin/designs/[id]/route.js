import { col } from '@/server/db.js';
import { deleteObjects } from '@/server/b2.js';
import { deleteImages, findProject, uniqueSlug, withImages } from '@/server/designs.js';
import { projectUpdate, toObjectId } from '@/server/models.js';
import { fail, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

async function load(params) {
  const { id } = await params;
  return toObjectId(id) ? findProject(id) : null;
}

// GET /api/admin/designs/:id
export async function GET(_request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const p = await load(params);
  if (!p) return fail('Not found', 404);
  const [project] = await withImages([p]);
  return ok(project);
}

// PATCH /api/admin/designs/:id
//   any of { title, category, status, description, location, tags,
//            coverImageId, imageOrder: [imageId, ...] }
export async function PATCH(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const p = await load(params);
  if (!p) return fail('Not found', 404);
  const { data, response: bad } = validate(projectUpdate, await readJson(request));
  if (bad) return bad;
  try {
    const images = await col('images');
    const { coverImageId, imageOrder, ...fields } = data;
    const set = { ...fields, updatedAt: new Date() };
    if (fields.title && fields.title !== p.title) set.slug = await uniqueSlug(fields.title, p._id);
    if (fields.status === 'published' && !p.publishedAt) set.publishedAt = new Date();
    if (fields.category && fields.category !== p.category) {
      await images.updateMany({ projectId: p._id }, { $set: { category: fields.category } });
    }
    if (coverImageId !== undefined) {
      const img = await images.findOne({ _id: toObjectId(coverImageId), projectId: p._id });
      if (!img) return fail('Cover image must belong to this project.', 400);
      set.coverImageId = img._id;
    }
    if (imageOrder) {
      const ids = imageOrder.map(toObjectId).filter(Boolean);
      await images.bulkWrite(ids.map((_id, order) => ({ updateOne: { filter: { _id, projectId: p._id }, update: { $set: { order } } } })));
    }
    // videoUrl is also a free-text field in the admin form. If it has been
    // pointed somewhere else by hand, the tracked B2 object is no longer the
    // one playing, so drop the reference. The object itself is left alone --
    // deleting storage as a side effect of a text edit would be too eager.
    const unset = {};
    if (fields.videoUrl !== undefined && fields.videoUrl !== p.videoUrl && p.videoKey) {
      unset.videoKey = '';
      unset.videoSize = '';
      unset.videoContentType = '';
    }
    await (await col('projects')).updateOne(
      { _id: p._id },
      { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) }
    );
    const [project] = await withImages([await findProject(String(p._id))]);
    return ok(project);
  } catch (err) {
    return serverError(err, 'update design');
  }
}

// DELETE /api/admin/designs/:id — removes the project, its image records
// and the image and video files in Backblaze B2.
export async function DELETE(_request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const p = await load(params);
  if (!p) return fail('Not found', 404);
  try {
    const removedImages = await deleteImages({ projectId: p._id });
    if (p.videoKey) await deleteObjects([p.videoKey]).catch(() => {});
    await (await col('projects')).deleteOne({ _id: p._id });
    return ok({ deleted: true, removedImages });
  } catch (err) {
    return serverError(err, 'delete design');
  }
}
