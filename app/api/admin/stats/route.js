import { col } from '@/server/db.js';
import { ok, requireAdmin, serverError } from '@/server/http.js';

// GET /api/admin/stats — dashboard overview numbers + recent activity
export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  try {
    const [projects, images, quotes, consultations, contacts] = await Promise.all(
      ['projects', 'images', 'quotes', 'consultations', 'contacts'].map((n) => col(n))
    );
    const recent = (c, type) =>
      c.find({}, { projection: { name: 1, title: 1, status: 1, createdAt: 1, service: 1, city: 1 } })
        .sort({ createdAt: -1 }).limit(6).toArray()
        .then((rows) => rows.map((r) => ({ type, id: String(r._id), label: r.name || r.title, detail: r.service || r.city || r.status, status: r.status, createdAt: r.createdAt })));
    const [totalDesigns, publishedDesigns, totalImages, newQuotes, pendingQuotes, totalConsultations, newConsultations, newContacts, ...lists] = await Promise.all([
      projects.countDocuments({}),
      projects.countDocuments({ status: 'published' }),
      images.countDocuments({}),
      quotes.countDocuments({ status: 'NEW' }),
      quotes.countDocuments({ status: { $in: ['NEW', 'CONTACTED', 'IN_PROGRESS'] } }),
      consultations.countDocuments({}),
      consultations.countDocuments({ status: 'NEW' }),
      contacts.countDocuments({ status: 'NEW' }),
      recent(quotes, 'quote'), recent(consultations, 'consultation'), recent(contacts, 'contact'), recent(projects, 'design'),
    ]);
    const activity = lists.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    return ok({ totalDesigns, publishedDesigns, totalImages, newQuotes, pendingQuotes, totalConsultations, newConsultations, newContacts, activity });
  } catch (err) {
    return serverError(err, 'stats');
  }
}
