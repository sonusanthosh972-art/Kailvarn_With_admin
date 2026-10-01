import { adminItem } from '@/server/leads.js';

// GET / PATCH { status?, notes? } / DELETE  /api/admin/consultations/:id
const handlers = adminItem({ collection: 'consultations' });
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
