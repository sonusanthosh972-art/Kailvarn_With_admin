import { publicCreate } from '@/server/leads.js';
import { quoteInput } from '@/server/models.js';

// POST /api/quotes — "Get Free Quote" form submissions
export const POST = publicCreate({ collection: 'quotes', schema: quoteInput, label: 'quote' });
