import { pageMetadata } from '@/lib/seo.js';
import RoomAdvisor from '@/components/advisor/RoomAdvisor.jsx';

export const metadata = pageMetadata({
  title: 'AI Room Design Advisor',
  description:
    'Upload a photo of your room and get instant, free interior design suggestions from KailVarn\'s AI advisor. Then book a free consultation for a full plan.',
  path: '/design-advisor',
});

export default function Page() {
  return <RoomAdvisor />;
}
