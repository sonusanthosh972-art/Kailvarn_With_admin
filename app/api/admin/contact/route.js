import { adminList } from '@/server/leads.js';

// GET /api/admin/contact?q=&status=&page=&limit=
export const GET = adminList({ collection: 'contacts' });
