import { pageMetadata } from '@/lib/seo.js';
import BookConsultationPage from '@/views/BookConsultationPage.jsx';

export const metadata = pageMetadata({
  title: 'Book a Free Interior Design Consultation',
  description:
    'Pick a time for a free consultation with a KailVarn interior designer in Silvassa or Vapi. Talk through your space, style and budget. No charge, no obligation.',
  path: '/book-consultation',
});

export default function Page() {
  return <BookConsultationPage />;
}
