import { adminItem } from '@/server/leads.js';

// GET / PATCH { status?, notes? } / DELETE  /api/admin/contact/:id
const handlers = adminItem({ collection: 'contacts' });
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
