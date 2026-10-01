import { buildImageKeys, isB2Configured, presignPut } from '@/server/b2.js';
import { findProject } from '@/server/designs.js';
import { toObjectId, uploadRequest } from '@/server/models.js';
import { fail, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

// POST /api/admin/uploads
//   { projectId, files: [{ name, type, size, width?, height?, hasThumb? }] }
// -> presigned PUT URLs (10 min) so the browser uploads straight to B2.
// Keys are generated here (random, category/project folders); the client's
// file name is kept only as metadata. After each PUT the client calls
// /api/admin/uploads/complete, which verifies the object before saving it.
export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;
  if (!isB2Configured()) return fail('Image storage (Backblaze B2) is not configured.', 503);
  const { data, response: bad } = validate(uploadRequest, await readJson(request));
  if (bad) return bad;
  if (!toObjectId(data.projectId)) return fail('Project not found', 404);
  try {
    const project = await findProject(data.projectId);
    if (!project) return fail('Project not found', 404);
    const uploads = await Promise.all(
      data.files.map(async (f) => {
        const keys = buildImageKeys({ category: project.category, projectSlug: project.slug, contentType: f.type });
        return {
          ...keys,
          name: f.name,
          contentType: f.type,
          uploadUrl: await presignPut(keys.b2Key, f.type),
          thumbUploadUrl: f.hasThumb ? await presignPut(keys.thumbKey, 'image/webp') : null,
        };
      })
    );
    return ok({ uploads, expiresIn: 600 });
  } catch (err) {
    return serverError(err, 'presign uploads');
  }
}
