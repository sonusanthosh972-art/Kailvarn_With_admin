import { publicCreate } from '@/server/leads.js';
import { consultationInput, splitDateTime } from '@/server/models.js';

// POST /api/consultations — Book Consultation form
export const POST = publicCreate({
  collection: 'consultations',
  schema: consultationInput,
  label: 'consultation',
  transform: ({ datetime, ...rest }) => ({ ...rest, ...splitDateTime(datetime) }),
});
