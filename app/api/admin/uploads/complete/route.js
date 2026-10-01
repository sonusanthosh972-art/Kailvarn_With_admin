import { headObject, mediaUrl } from '@/server/b2.js';
import { findProject } from '@/server/designs.js';
import { MAX_IMAGE_BYTES, serializeImage, slugify, uploadComplete } from '@/server/models.js';
import { fail, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';
import { registerImage } from '../register.js';

// POST /api/admin/uploads/complete — called after the browser's direct PUT.
// Verifies the object really exists in B2 (and its size/type) and that the
// key belongs to this project before recording it in MongoDB.
export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { data, response: bad } = validate(uploadComplete, await readJson(request));
  if (bad) return bad;
  try {
    const project = await findProject(data.projectId);
    if (!project) return fail('Project not found', 404);
    const folder = `${process.env.B2_KEY_PREFIX || ''}designs/${slugify(project.category)}/${slugify(project.slug)}/${data.uploadId}`;
    if (!data.b2Key.startsWith(`${folder}.`) || (data.thumbKey && data.thumbKey !== `${folder}-thumb.webp`)) {
      return fail('Upload key does not match this project.', 400);
    }
    const head = await headObject(data.b2Key);
    if (!head.exists) return fail('The file was not found in storage. Please retry the upload.', 409);
    if (head.size > MAX_IMAGE_BYTES) return fail('File is larger than 15 MB.', 413);
    const thumbOk = data.thumbKey ? (await headObject(data.thumbKey)).exists : false;
    const img = await registerImage(project, { ...data, size: head.size, thumbKey: thumbOk ? data.thumbKey : '' });
    return ok(serializeImage(img, mediaUrl), 201);
  } catch (err) {
    if (err?.code === 11000) return fail('This image was already saved.', 409);
    return serverError(err, 'complete upload');
  }
}
