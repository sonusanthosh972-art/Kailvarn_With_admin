import { pageMetadata } from '@/lib/seo.js';
import AboutUsPage from '@/views/AboutUsPage.jsx';

export const metadata = pageMetadata({
  title: 'About KailVarn – Interior Design & Build Team',
  description:
    'KailVarn is one team for interior design and execution in Silvassa, Vapi and Daman: free 3D design, our own craftsmen, a written price and warranty on work.',
  path: '/about',
});

export default function Page() {
  return <AboutUsPage />;
}
