// Session token helpers shared by proxy.js and the server. Deliberately free
// of 'server-only'/Mongo imports so the proxy can use it.
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'kv_admin';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('NEXTAUTH_SECRET must be set (32+ chars)');
  return new TextEncoder().encode(secret);
}

export async function signSession({ adminId, email }) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(adminId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .setIssuer('kailvarn-admin')
    .sign(secretKey());
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: 'kailvarn-admin', algorithms: ['HS256'] });
    return { adminId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    // Secure (HTTPS-only) in production. Set COOKIE_SECURE=false only if the
    // site is served over plain HTTP, otherwise the browser drops the cookie.
    secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}
