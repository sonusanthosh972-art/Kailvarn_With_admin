import { pageMetadata } from '@/lib/seo.js';
import PaintingQuotePage from '@/views/PaintingQuotePage.jsx';

export const metadata = pageMetadata({
  title: 'Diwali Painting Offer: 25% Off Home Painting in Silvassa & Vapi',
  description:
    'Flat 25% off painting services with any paint brand this Diwali. Free site visit and colour advice, mess-free work and a fixed written price. Silvassa, Vapi & Daman.',
  path: '/painting-quote',
});

export default function Page() {
  return <PaintingQuotePage />;
}
