import { pageMetadata } from '@/lib/seo.js';
import OurDesignPage from '@/views/OurDesignPage.jsx';

export const metadata = pageMetadata({
  title: 'Interior Design Portfolio – Homes & Offices',
  description:
    'Browse KailVarn\'s interior designs for living rooms, bedrooms, modular kitchens, wardrobes and offices in Silvassa and Vapi. Photos and video walkthroughs.',
  path: '/our-design',
});

export default function Page() {
  return <OurDesignPage />;
}
