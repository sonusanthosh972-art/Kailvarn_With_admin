import { pageMetadata } from '@/lib/seo.js';
import GeminiWallPainter from '@/components/paint/GeminiWallPainter.jsx';

export const metadata = pageMetadata({
  title: 'AI Wall & Ceiling Painter (Test)',
  description:
    'Internal test page for AI wall and ceiling detection.',
  path: '/paint-visualizer-gemini',
  noIndex: true,
});

export default function Page() {
  return <GeminiWallPainter />;
}
