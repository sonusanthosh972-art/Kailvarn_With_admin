import GeminiWallPainter from '@/components/paint/GeminiWallPainter.jsx';

export const metadata = {
  title: 'AI Wall & Ceiling Painter (Gemini POC) | KailVarn',
  description: 'Proof of concept: Gemini-powered wall and ceiling detection with instant color preview.',
};

export default function Page() {
  return <GeminiWallPainter />;
}
