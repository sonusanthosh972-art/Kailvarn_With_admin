import { adminList } from '@/server/leads.js';

// GET /api/admin/quotes?q=&status=&page=&limit=
export const GET = adminList({ collection: 'quotes' });
