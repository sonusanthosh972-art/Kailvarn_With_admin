import { deleteObjects } from '@/server/b2.js';
import { getPageContent, isKnownPage, removeHeroImage } from '@/server/content.js';
import { fail, ok, requireAdmin, serverError } from '@/server/http.js';

// DELETE /api/admin/content/:page/images/:imageId — removes a hero photo (and its B2 files)
export async function DELETE(_request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { page, imageId } = await params;
  if (!isKnownPage(page)) return fail('Not found', 404);
  try {
    const img = await removeHeroImage(page, imageId);
    if (!img) return fail('Not found', 404);
    await deleteObjects([img.b2Key, img.thumbKey].filter(Boolean));
    return ok(await getPageContent(page));
  } catch (err) {
    return serverError(err, 'delete hero image');
  }
}
