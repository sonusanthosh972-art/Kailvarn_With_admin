import 'server-only';
import { col } from '@/server/db.js';
import { LEAD_STATUSES, leadUpdate, serializeLead, toObjectId } from '@/server/models.js';
import { escapeRegex, fail, ok, rateLimit, readJson, requireAdmin, serverError, validate } from '@/server/http.js';

// Quotes, consultations and contact enquiries share the same lifecycle:
// a public POST creates one (status NEW), admins list/search/filter,
// open, update status/notes, and delete. One implementation, three
// collections.

export function publicCreate({ collection, schema, transform = (d) => d, label }) {
  return async function POST(request) {
    if (rateLimit(request, { key: `form:${collection}`, max: 5, windowMs: 10 * 60 * 1000 })) {
      return fail('Too many submissions. Please try again in a few minutes, or call/WhatsApp 8401226123.', 429);
    }
    const body = await readJson(request);
    // Honeypot field: real visitors never fill it (hidden in the form).
    if (body && typeof body.website === 'string' && body.website.trim()) return ok({ id: null }, 201);
    const { data, response } = validate(schema, body);
    if (response) return response;
    try {
      const now = new Date();
      const doc = { ...transform(data), status: 'NEW', notes: '', createdAt: now, updatedAt: now };
      const { insertedId } = await (await col(collection)).insertOne(doc);
      return ok({ id: String(insertedId) }, 201);
    } catch (err) {
      return serverError(err, `create ${label}`);
    }
  };
}

const SEARCH_FIELDS = ['name', 'phone', 'email', 'city', 'service', 'message'];

export function adminList({ collection }) {
  return async function GET(request) {
    const { response } = await requireAdmin();
    if (response) return response;
    const sp = request.nextUrl.searchParams;
    const q = (sp.get('q') || '').trim().slice(0, 100);
    const status = sp.get('status');
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(sp.get('limit') || '25', 10) || 25));
    const filter = {};
    if (status && LEAD_STATUSES.includes(status)) filter.status = status;
    if (q) filter.$or = SEARCH_FIELDS.map((f) => ({ [f]: { $regex: escapeRegex(q), $options: 'i' } }));
    try {
      const c = await col(collection);
      const [items, total, counts] = await Promise.all([
        c.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
        c.countDocuments(filter),
        c.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]).toArray(),
      ]);
      const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
      for (const r of counts) byStatus[r._id] = r.n;
      return ok({ items: items.map(serializeLead), total, page, limit, byStatus });
    } catch (err) {
      return serverError(err, `list ${collection}`);
    }
  };
}

export function adminItem({ collection }) {
  async function find(params) {
    const { id } = await params;
    return toObjectId(id);
  }
  return {
    async GET(_request, { params }) {
      const { response } = await requireAdmin();
      if (response) return response;
      const _id = await find(params);
      if (!_id) return fail('Not found', 404);
      const doc = await (await col(collection)).findOne({ _id });
      return doc ? ok(serializeLead(doc)) : fail('Not found', 404);
    },
    async PATCH(request, { params }) {
      const { response } = await requireAdmin();
      if (response) return response;
      const _id = await find(params);
      if (!_id) return fail('Not found', 404);
      const { data, response: bad } = validate(leadUpdate, await readJson(request));
      if (bad) return bad;
      const res = await (await col(collection)).findOneAndUpdate(
        { _id },
        { $set: { ...data, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return res ? ok(serializeLead(res)) : fail('Not found', 404);
    },
    async DELETE(_request, { params }) {
      const { response } = await requireAdmin();
      if (response) return response;
      const _id = await find(params);
      if (!_id) return fail('Not found', 404);
      const { deletedCount } = await (await col(collection)).deleteOne({ _id });
      return deletedCount ? ok({ deleted: true }) : fail('Not found', 404);
    },
  };
}
