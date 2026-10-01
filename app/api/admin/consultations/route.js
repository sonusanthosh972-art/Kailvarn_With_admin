import { adminList } from '@/server/leads.js';

// GET /api/admin/consultations?q=&status=&page=&limit=
export const GET = adminList({ collection: 'consultations' });
