import { pageMetadata } from '@/lib/seo.js';
import PaintingQuotePage from '@/views/PaintingQuotePage.jsx';

export const metadata = pageMetadata({
  title: 'Home Painting Quote: Free Site Visit in Silvassa & Vapi',
  description:
    'Get a home painting quote with any paint brand. Free site visit and colour advice, mess-free work and a fixed written price. Silvassa, Vapi & Daman.',
  path: '/painting-quote',
});

export default function Page() {
  return <PaintingQuotePage />;
}
