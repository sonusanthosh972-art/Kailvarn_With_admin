import { col } from '@/server/db.js';
import { uniqueSlug, withImages } from '@/server/designs.js';
import { DESIGN_CATEGORIES, PROJECT_STATUSES, projectInput } from '@/server/models.js';
import { escapeRegex, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

// GET /api/admin/designs?q=&status=&category=  — all projects (any status)
export async function GET(request) {
  const { response } = await requireAdmin();
  if (response) return response;
  const sp = request.nextUrl.searchParams;
  const filter = {};
  const q = (sp.get('q') || '').trim().slice(0, 100);
  if (q) filter.$or = ['title', 'subtitle', 'location', 'tags'].map((f) => ({ [f]: { $regex: escapeRegex(q), $options: 'i' } }));
  if (PROJECT_STATUSES.includes(sp.get('status'))) filter.status = sp.get('status');
  if (DESIGN_CATEGORIES.includes(sp.get('category'))) filter.category = sp.get('category');
  try {
    const docs = await (await col('projects')).find(filter).sort({ updatedAt: -1 }).limit(500).toArray();
    return ok({ items: await withImages(docs) });
  } catch (err) {
    return serverError(err, 'admin designs');
  }
}

// POST /api/admin/designs  { title, category, status?, description?, location?, tags? }
export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { data, response: bad } = validate(projectInput, await readJson(request));
  if (bad) return bad;
  try {
    const now = new Date();
    const doc = {
      ...data,
      slug: await uniqueSlug(data.title),
      coverImageId: null,
      imageCount: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === 'published' ? now : null,
    };
    const { insertedId } = await (await col('projects')).insertOne(doc);
    const [project] = await withImages([{ ...doc, _id: insertedId }]);
    return ok(project, 201);
  } catch (err) {
    return serverError(err, 'create design');
  }
}
