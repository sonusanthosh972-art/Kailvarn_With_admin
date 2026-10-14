import { pageMetadata } from '@/lib/seo.js';
import PaintConsultationPage from '@/views/PaintConsultationPage.jsx';

export const metadata = pageMetadata({
  title: 'Free Paint Consultation: Colours, Damp Check & Budget',
  description:
    'Book a free painting consultation in Silvassa, Vapi or Daman. Our expert helps you choose colours and finish with any paint brand, checks walls for damp and cracks, and plans your budget.',
  path: '/paint-consultation',
});

export default function Page() {
  return <PaintConsultationPage />;
}
