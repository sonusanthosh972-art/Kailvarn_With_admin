import { publicCreate } from '@/server/leads.js';
import { contactInput } from '@/server/models.js';

// POST /api/contact — Contact Us enquiries
export const POST = publicCreate({ collection: 'contacts', schema: contactInput, label: 'contact enquiry' });
