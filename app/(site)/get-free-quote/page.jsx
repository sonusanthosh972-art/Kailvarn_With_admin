import { pageMetadata } from '@/lib/seo.js';
import GetFreeQuotePage from '@/views/GetFreeQuotePage.jsx';

export const metadata = pageMetadata({
  title: 'Free Interior Design Quote in Silvassa & Vapi',
  description:
    'Get a free, no-obligation quote for your home or office interior in Silvassa or Vapi. Tell us about your space in 2 minutes and get a clear, itemised estimate.',
  path: '/get-free-quote',
});

export default function Page() {
  return <GetFreeQuotePage />;
}
