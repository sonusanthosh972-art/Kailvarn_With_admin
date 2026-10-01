import { z } from 'zod';
import { changeAdminPassword } from '@/server/auth.js';
import { fail, ok, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

const input = z.object({
  currentPassword: z.string().min(1, 'Enter your current password').max(200),
  newPassword: z.string().min(10, 'Use at least 10 characters').max(200),
});

// POST /api/admin/settings/password { currentPassword, newPassword }
export async function POST(request) {
  const { admin, response } = await requireAdmin();
  if (response) return response;
  const { data, response: bad } = validate(input, await readJson(request));
  if (bad) return bad;
  try {
    const changed = await changeAdminPassword(admin.id, data.currentPassword, data.newPassword);
    return changed ? ok({ changed: true }) : fail('Current password is incorrect.', 400, { currentPassword: 'Current password is incorrect.' });
  } catch (err) {
    return serverError(err, 'change password');
  }
}
