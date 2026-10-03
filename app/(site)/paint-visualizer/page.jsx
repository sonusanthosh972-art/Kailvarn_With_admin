import { pageMetadata } from '@/lib/seo.js';
import PaintVisualizer from '@/components/paint/PaintVisualizer.jsx';

export const metadata = pageMetadata({
  title: 'Paint Color Visualizer – Try Wall Colors Free',
  description:
    'Upload a photo of your room and see how different wall and ceiling paint colors look before you paint. Free online tool from KailVarn, Silvassa & Vapi.',
  path: '/paint-visualizer',
});

export default function Page() {
  return <PaintVisualizer />;
}
