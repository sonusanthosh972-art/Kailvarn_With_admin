import { getPageContent, isKnownPage, savePageFields } from '@/server/content.js';
import { PAGE_CONTENT } from '@/server/models.js';
import { fail, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

// GET /api/admin/content/:page — current content (+ defaults for "reset")
export async function GET(_request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { page } = await params;
  if (!isKnownPage(page)) return fail('Not found', 404);
  try {
    return ok(await getPageContent(page));
  } catch (err) {
    return serverError(err, 'admin page content');
  }
}

// PUT /api/admin/content/:page { fields: {...} } — replaces the page's text
export async function PUT(request, { params }) {
  const { admin, response } = await requireAdmin();
  if (response) return response;
  const { page } = await params;
  if (!isKnownPage(page)) return fail('Not found', 404);
  const body = await readJson(request);
  const { data, response: bad } = validate(PAGE_CONTENT[page].schema, body?.fields);
  if (bad) return bad;
  try {
    await savePageFields(page, data, admin.email);
    return ok(await getPageContent(page));
  } catch (err) {
    return serverError(err, 'save page content');
  }
}
