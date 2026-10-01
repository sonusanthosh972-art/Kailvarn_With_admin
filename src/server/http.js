import 'server-only';
import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/server/auth.js';

// Consistent JSON envelope for every API route:
//   success -> { ok: true, data }
//   failure -> { ok: false, error: { message, fields? } }

export const ok = (data, status = 200, headers) => NextResponse.json({ ok: true, data }, { status, headers });

export const fail = (message, status = 400, fields) =>
  NextResponse.json({ ok: false, error: { message, ...(fields ? { fields } : {}) } }, { status });

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Validate with a zod schema; returns { data } or { response } (a 400).
export function validate(schema, input) {
  const r = schema.safeParse(input ?? {});
  if (r.success) return { data: r.data };
  const fields = {};
  for (const issue of r.error.issues) {
    const k = issue.path.join('.') || '_';
    if (!fields[k]) fields[k] = issue.message;
  }
  return { response: fail('Please check the highlighted fields.', 400, fields) };
}

// Route-handler guard (defence in depth on top of proxy.js).
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  return admin ? { admin } : { response: fail('Not authenticated', 401) };
}

// Simple in-memory sliding-window rate limiter (per server instance).
const buckets = new Map();
export function rateLimit(request, { key, max, windowMs }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const id = `${key}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(id, hits);
  if (buckets.size > 10000) buckets.clear();
  return hits.length > max;
}

export function serverError(err, where) {
  console.error(`[api] ${where}:`, err?.message || err);
  return fail('Something went wrong. Please try again.', 500);
}

export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
