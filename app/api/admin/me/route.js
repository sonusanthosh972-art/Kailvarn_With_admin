import { ok, requireAdmin } from '@/server/http.js';

// GET /api/admin/me — the signed-in admin
export async function GET() {
  const { admin, response } = await requireAdmin();
  return response || ok({ admin });
}
