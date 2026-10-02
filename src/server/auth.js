import 'server-only';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { col } from '@/server/db.js';
import { toObjectId } from '@/server/models.js';
import { SESSION_COOKIE, verifySession } from '@/server/session.js';

// Admin accounts live in the `admins` collection. There is no registration:
// the first login with ADMIN_EMAIL + the password matching
// ADMIN_PASSWORD_HASH (from .env.local) creates that admin in MongoDB; after
// that the database copy is the source of truth (password changes from
// /admin/settings update it).

const normalizeEmail = (e) => String(e || '').trim().toLowerCase();

// Constant-ish work even when the email is unknown, so response time doesn't
// reveal whether an account exists. Built on first use, not at module load:
// src/server/http.js imports from this file, so every API route -- public
// ones included -- would otherwise pay a cost-12 bcrypt hash (~0.5s on a
// 2-core serverless instance) on each cold start.
let dummyHash;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync('not-a-real-password', 12));

export async function verifyAdminCredentials(email, password) {
  const e = normalizeEmail(email);
  if (!e || !password) return null;
  const admins = await col('admins');
  let admin = await admins.findOne({ email: e });

  if (!admin) {
    const envEmail = normalizeEmail(process.env.ADMIN_EMAIL);
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    if (envEmail && envHash && e === envEmail && (await bcrypt.compare(password, envHash))) {
      const now = new Date();
      const res = await admins.findOneAndUpdate(
        { email: e },
        { $setOnInsert: { email: e, name: 'Admin', passwordHash: envHash, createdAt: now, updatedAt: now } },
        { upsert: true, returnDocument: 'after' }
      );
      admin = res;
    } else {
      await bcrypt.compare(password, getDummyHash());
      return null;
    }
  } else if (!(await bcrypt.compare(password, admin.passwordHash))) {
    return null;
  }

  await admins.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });
  return { id: String(admin._id), email: admin.email, name: admin.name || 'Admin' };
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function changeAdminPassword(adminId, currentPassword, newPassword) {
  const admins = await col('admins');
  const admin = await admins.findOne({ _id: toObjectId(adminId) });
  if (!admin || !(await bcrypt.compare(currentPassword, admin.passwordHash))) return false;
  await admins.updateOne({ _id: admin._id }, { $set: { passwordHash: await hashPassword(newPassword), updatedAt: new Date() } });
  return true;
}

// Current admin from the session cookie, re-checked against the database
// (a deleted admin loses access immediately). Use in route handlers and
// server components; proxy.js already blocks unauthenticated requests.
export async function getCurrentAdmin() {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const admin = await (await col('admins')).findOne({ _id: toObjectId(session.adminId) }, { projection: { passwordHash: 0 } });
  return admin ? { id: String(admin._id), email: admin.email, name: admin.name || 'Admin', lastLoginAt: admin.lastLoginAt || null } : null;
}
