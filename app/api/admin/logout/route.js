import { cookies } from 'next/headers';
import { ok } from '@/server/http.js';
import { SESSION_COOKIE, sessionCookieOptions } from '@/server/session.js';

// POST /api/admin/logout — clears the session cookie
export async function POST() {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 });
  return ok({ loggedOut: true });
}
