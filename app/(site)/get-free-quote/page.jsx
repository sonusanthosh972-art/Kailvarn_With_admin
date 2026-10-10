import { pageMetadata } from '@/lib/seo.js';
import GetFreeQuotePage from '@/views/GetFreeQuotePage.jsx';

export const metadata = pageMetadata({
  title: 'Interior Cost Calculator: Free Estimate in Silvassa & Vapi',
  description:
    'Free interior cost calculator for Silvassa, Vapi and Daman. Choose your home type, rooms and package and get an instant, itemised estimate for 1, 2, 3 BHK and villa interiors.',
  path: '/get-free-quote',
});

export default function Page() {
  return <GetFreeQuotePage />;
}
