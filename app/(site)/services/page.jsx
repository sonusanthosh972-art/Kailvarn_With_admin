import { pageMetadata } from '@/lib/seo.js';
import ServicesPage from '@/views/ServicesPage.jsx';

export const metadata = pageMetadata({
  title: 'Interior Design Services in Silvassa & Vapi',
  description:
    'Full home interiors, modular kitchens, custom furniture, wardrobes, painting and wall finishes in Silvassa and Vapi. Free 3D design and warranty on work.',
  path: '/services',
});

export default function Page() {
  return <ServicesPage />;
}
