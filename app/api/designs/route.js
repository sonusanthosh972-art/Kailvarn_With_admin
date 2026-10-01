import { col, isDbConfigured } from '@/server/db.js';
import { withImages } from '@/server/designs.js';
import { DESIGN_CATEGORIES } from '@/server/models.js';
import { ok, serverError } from '@/server/http.js';

// GET /api/designs?category=&page=&limit=  — published projects only,
// newest first, paginated. Powers the public "Our Design" page.
export async function GET(request) {
  if (!isDbConfigured()) return ok({ items: [], total: 0, page: 1, limit: 0, categories: [] });
  const sp = request.nextUrl.searchParams;
  const category = sp.get('category');
  const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
  const limit = Math.min(48, Math.max(1, parseInt(sp.get('limit') || '24', 10) || 24));
  const filter = { status: 'published', imageCount: { $gt: 0 } };
  if (category && DESIGN_CATEGORIES.includes(category)) filter.category = category;
  try {
    const projects = await col('projects');
    const [docs, total, cats] = await Promise.all([
      projects.find(filter).sort({ publishedAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      projects.countDocuments(filter),
      projects.aggregate([
        { $match: { status: 'published', imageCount: { $gt: 0 } } },
        { $group: { _id: '$category', n: { $sum: 1 } } },
      ]).toArray(),
    ]);
    const items = (await withImages(docs)).map(({ status, ...p }) => p);
    const categories = DESIGN_CATEGORIES.map((c) => ({ name: c, count: cats.find((x) => x._id === c)?.n || 0 })).filter((c) => c.count);
    return ok({ items, total, page, limit, categories }, 200, { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' });
  } catch (err) {
    return serverError(err, 'public designs');
  }
}
