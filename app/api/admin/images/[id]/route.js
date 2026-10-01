import { col } from '@/server/db.js';
import { mediaUrl } from '@/server/b2.js';
import { deleteImages } from '@/server/designs.js';
import { imageUpdate, serializeImage, toObjectId } from '@/server/models.js';
import { fail, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

// PATCH /api/admin/images/:id { altText }
export async function PATCH(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const _id = toObjectId((await params).id);
  if (!_id) return fail('Not found', 404);
  const { data, response: bad } = validate(imageUpdate, await readJson(request));
  if (bad) return bad;
  const res = await (await col('images')).findOneAndUpdate({ _id }, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: 'after' });
  return res ? ok(serializeImage(res, mediaUrl)) : fail('Not found', 404);
}

// DELETE /api/admin/images/:id — removes the record and the files in B2
export async function DELETE(_request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const _id = toObjectId((await params).id);
  if (!_id) return fail('Not found', 404);
  try {
    const n = await deleteImages({ _id });
    return n ? ok({ deleted: true }) : fail('Not found', 404);
  } catch (err) {
    return serverError(err, 'delete image');
  }
}
