import { buildImageKeys, isB2Configured, mediaUrl, putObject } from '@/server/b2.js';
import { findProject } from '@/server/designs.js';
import { IMAGE_TYPES, MAX_IMAGE_BYTES, serializeImage } from '@/server/models.js';
import { fail, ok, requireAdmin, serverError } from '@/server/http.js';
import { registerImage } from '../register.js';

// POST /api/admin/uploads/direct (multipart: projectId, file, thumb?, altText?, width?, height?)
// Fallback when a direct browser->B2 upload is blocked (e.g. bucket CORS not
// set for the current domain): the file passes through this server instead.
export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;
  if (!isB2Configured()) return fail('Image storage (Backblaze B2) is not configured.', 503);
  let form;
  try {
    form = await request.formData();
  } catch {
    return fail('Expected multipart form data.', 400);
  }
  const file = form.get('file');
  const thumb = form.get('thumb');
  if (!file || typeof file === 'string') return fail('No file uploaded.', 400);
  if (!IMAGE_TYPES[file.type]) return fail('Only JPG, PNG and WEBP images are allowed.', 415);
  if (file.size > MAX_IMAGE_BYTES) return fail('File is larger than 15 MB.', 413);
  const buf = Buffer.from(await file.arrayBuffer());
  if (!looksLikeImage(buf, file.type)) return fail('File content is not a valid image.', 415);
  try {
    const project = await findProject(String(form.get('projectId') || ''));
    if (!project) return fail('Project not found', 404);
    const keys = buildImageKeys({ category: project.category, projectSlug: project.slug, contentType: file.type });
    await putObject(keys.b2Key, buf, file.type);
    let thumbKey = '';
    if (thumb && typeof thumb !== 'string' && thumb.type === 'image/webp' && thumb.size < MAX_IMAGE_BYTES) {
      await putObject(keys.thumbKey, Buffer.from(await thumb.arrayBuffer()), 'image/webp');
      thumbKey = keys.thumbKey;
    }
    const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.round(Number(v)) : null);
    const img = await registerImage(project, {
      fileName: String(file.name || 'image').slice(0, 200),
      b2Key: keys.b2Key,
      thumbKey,
      contentType: file.type,
      size: file.size,
      width: num(form.get('width')),
      height: num(form.get('height')),
      altText: String(form.get('altText') || '').slice(0, 300),
    });
    return ok(serializeImage(img, mediaUrl), 201);
  } catch (err) {
    return serverError(err, 'direct upload');
  }
}

// Magic-byte check so a renamed non-image can't be stored as one.
function looksLikeImage(buf, type) {
  if (type === 'image/jpeg') return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (type === 'image/png') return buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === 'image/webp') return buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP';
  return false;
}
