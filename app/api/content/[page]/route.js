import { isDbConfigured } from '@/server/db.js';
import { getPageContent, isKnownPage } from '@/server/content.js';
import { PAGE_CONTENT } from '@/server/models.js';
import { fail, ok } from '@/server/http.js';

// GET /api/content/:page — public, editable page text + hero images.
// Falls back to the built-in wording if the database is unavailable.
export async function GET(_request, { params }) {
  const { page } = await params;
  if (!isKnownPage(page)) return fail('Not found', 404);
  const fallback = { page, fields: PAGE_CONTENT[page].defaults, heroImages: [] };
  if (!isDbConfigured()) return ok(fallback);
  try {
    const { defaults, updatedBy, ...content } = await getPageContent(page);
    return ok(content, 200, { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' });
  } catch (err) {
    console.error('[api] page content:', err?.message);
    return ok(fallback);
  }
}
