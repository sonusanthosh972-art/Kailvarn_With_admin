import { pageMetadata } from '@/lib/seo.js';
import ARExperience from '@/components/ar/ARExperience.jsx';

export const metadata = pageMetadata({
  title: 'See a Living Room Design in Your Space (AR)',
  description:
    'Use your phone camera to place KailVarn\'s modern living room design in your own room with augmented reality, and see how it fits before you decide.',
  path: '/ar/modern-living-room-design-1',
});

export default function Page() {
  return <ARExperience />;
}
