import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/server/session.js';

// Guards the admin area before anything renders:
//   /admin/*       -> redirect to /admin/login without a valid session
//   /api/admin/*   -> 401 JSON without a valid session
// and blocks cross-site state-changing requests to admin APIs (CSRF): a
// write must come from this site's own origin. Route handlers re-check the
// session against MongoDB as well (src/server/http.js requireAdmin).
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/admin');
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';

  if (isApi && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ ok: false, error: { message: 'Cross-site request blocked' } }, { status: 403 });
    }
  }

  if (isLoginPage || isLoginApi) return NextResponse.next();

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ ok: false, error: { message: 'Not authenticated' } }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
