import { findProject, withImages } from '@/server/designs.js';
import { fail, ok, serverError } from '@/server/http.js';

// GET /api/designs/:idOrSlug — one published project with all images
export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const p = await findProject(id, { status: 'published' });
    if (!p) return fail('Not found', 404);
    const [project] = await withImages([p]);
    const { status, ...pub } = project;
    return ok(pub);
  } catch (err) {
    return serverError(err, 'public design');
  }
}
