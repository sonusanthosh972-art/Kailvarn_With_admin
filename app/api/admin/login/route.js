import { cookies } from 'next/headers';
import { z } from 'zod';
import { verifyAdminCredentials } from '@/server/auth.js';
import { fail, ok, rateLimit, readJson, serverError, validate } from '@/server/http.js';
import { SESSION_COOKIE, sessionCookieOptions, signSession } from '@/server/session.js';

const loginInput = z.object({ email: z.string().trim().max(160), password: z.string().min(1).max(200) });

// POST /api/admin/login { email, password } -> sets the httpOnly session cookie
export async function POST(request) {
  if (rateLimit(request, { key: 'admin-login', max: 8, windowMs: 15 * 60 * 1000 })) {
    return fail('Too many login attempts. Try again in 15 minutes.', 429);
  }
  const { data, response } = validate(loginInput, await readJson(request));
  if (response) return response;
  try {
    const admin = await verifyAdminCredentials(data.email, data.password);
    if (!admin) return fail('Incorrect email or password.', 401);
    const store = await cookies();
    store.set(SESSION_COOKIE, await signSession({ adminId: admin.id, email: admin.email }), sessionCookieOptions());
    return ok({ admin });
  } catch (err) {
    return serverError(err, 'admin login');
  }
}
