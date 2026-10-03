import { pageMetadata } from '@/lib/seo.js';
import HomePage from '@/views/HomePage.jsx';

export const metadata = pageMetadata({
  absoluteTitle: 'Interior Designers in Silvassa & Vapi | KailVarn',
  description:
    'Complete home interiors in Silvassa, Vapi & Daman. Free 3D design, then one team builds it all: kitchen, furniture, ceiling, painting. Fixed written price.',
  path: '/',
});

export default function Page() {
  return <HomePage />;
}
