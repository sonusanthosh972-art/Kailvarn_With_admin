import { isB2Configured, putObject } from '@/server/b2.js';
import { addHeroImage, getPageContent, isKnownPage, siteImageKeys } from '@/server/content.js';
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/server/models.js';
import { fail, ok, requireAdmin, serverError } from '@/server/http.js';

// POST /api/admin/content/:page/images (multipart: file, thumb?) — adds a
// hero photo for the page (stored in B2). A handful of images, so they go
// through the server; the browser has already optimised them to WebP.
export async function POST(request, { params }) {
  const { admin, response } = await requireAdmin();
  if (response) return response;
  const { page } = await params;
  if (!isKnownPage(page)) return fail('Not found', 404);
  if (!isB2Configured()) return fail('Image storage (Backblaze B2) is not configured.', 503);
  let form;
  try { form = await request.formData(); } catch { return fail('Expected multipart form data.', 400); }
  const file = form.get('file');
  const thumb = form.get('thumb');
  if (!file || typeof file === 'string') return fail('No file uploaded.', 400);
  if (!IMAGE_TYPES[file.type]) return fail('Only JPG, PNG and WEBP images are allowed.', 415);
  if (file.size > MAX_IMAGE_BYTES) return fail('File is larger than 15 MB.', 413);
  const buf = Buffer.from(await file.arrayBuffer());
  if (!isImage(buf, file.type)) return fail('File content is not a valid image.', 415);
  try {
    const current = await getPageContent(page);
    if (current.heroImages.length >= current.maxHeroImages) return fail(`Up to ${current.maxHeroImages} hero images — remove one first.`, 409);
    const keys = siteImageKeys(page, IMAGE_TYPES[file.type]);
    await putObject(keys.b2Key, buf, file.type);
    let thumbKey = '';
    if (thumb && typeof thumb !== 'string' && thumb.type === 'image/webp' && thumb.size < MAX_IMAGE_BYTES) {
      await putObject(keys.thumbKey, Buffer.from(await thumb.arrayBuffer()), 'image/webp');
      thumbKey = keys.thumbKey;
    }
    await addHeroImage(page, { id: keys.id, b2Key: keys.b2Key, thumbKey }, admin.email);
    return ok(await getPageContent(page), 201);
  } catch (err) {
    return serverError(err, 'hero image upload');
  }
}

function isImage(buf, type) {
  if (type === 'image/jpeg') return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (type === 'image/png') return buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  if (type === 'image/webp') return buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP';
  return false;
}
