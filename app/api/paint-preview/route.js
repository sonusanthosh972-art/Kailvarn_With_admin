import { NextResponse } from 'next/server';
import { recordGeminiUsage } from '@/server/aiUsage.js';
import { rateLimit } from '@/server/http.js';
import { isDailyCapReached } from '@/server/dailyCap.js';
import { validateImage } from '@/server/imageValidation.js';
import { PAINT_PREVIEW_MODEL, closestAspectRatio } from '@/constants/segmentationConfig.js';
import { findPaintColor } from '@/constants/paintColors.js';

// Paint visualizer "AI realistic preview": one optional call per visitor,
// AFTER they've chosen colours (colour trials themselves are painted free in
// the browser). Gemini receives the original photo plus the browser-painted
// version as a guide, and returns a photorealistic render of the guide.
// Only hex codes come from the browser -- no visitor text reaches the prompt.

const HEX = /^#[0-9a-f]{6}$/i;

function describe(hex) {
  const shade = findPaintColor(hex);
  return shade?.code ? `${shade.name} (${shade.code}, ${hex.toUpperCase()})` : hex.toUpperCase();
}

function buildPrompt(wall, ceiling) {
  const targets = [
    wall && `- WALLS: ${describe(wall)}`,
    ceiling && `- CEILING: ${describe(ceiling)}`,
  ].filter(Boolean).join('\n');
  return `You are a photorealistic interior paint renderer.

IMAGE 1 is the original room photo. IMAGE 2 is the same photo with flat paint colour roughly applied to the surfaces the customer chose.

Produce IMAGE 1 with ONLY those surfaces repainted, as a real photograph of the room after professional painting:
${targets || '- Use exactly the colours shown in IMAGE 2.'}

Rules:
- Repaint exactly the areas painted in IMAGE 2 -- no more, no less. Use IMAGE 2 only to know WHERE and WHAT colour.
- Match the paint colour faithfully to the hex value given; do not shift its hue or make it more saturated.
- Keep the room's real lighting: shadows, lamp glow, corners and light falloff must show on the new paint, with a smooth matt emulsion finish.
- Keep EVERYTHING else pixel-identical to IMAGE 1: furniture, TV, decor, doors, windows, floor, people, framing and camera angle. Do not add, remove or move anything.
- Output one image only.`;
}

export async function POST(request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI preview is not configured on the server.' }, { status: 500 });
  }

  // ~Rs 6.5 per call (image output), so: 3 per visitor per 30 minutes, 150 a day overall.
  if (rateLimit(request, { key: 'paint-preview', max: 3, windowMs: 30 * 60_000 })) {
    console.warn(`[ABUSE] paint-preview rate-limited | IP: ${request.headers.get('x-forwarded-for')?.split(',')[0] || 'local'}`);
    return NextResponse.json({ error: "You've used your AI previews for now. Please try again in 30 minutes." }, { status: 429 });
  }
  if (isDailyCapReached('paint-preview', 150)) {
    return NextResponse.json({ error: 'AI preview has reached its daily limit. Please try again tomorrow.' }, { status: 503 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Missing photo.' }, { status: 400 });
  }
  const photo = formData.get('photo');
  const guide = formData.get('guide');
  const imageError = validateImage(photo) || validateImage(guide);
  if (imageError) return NextResponse.json({ error: imageError }, { status: 400 });

  const wall = String(formData.get('wall') || '');
  const ceiling = String(formData.get('ceiling') || '');
  if ((wall && !HEX.test(wall)) || (ceiling && !HEX.test(ceiling))) {
    return NextResponse.json({ error: 'Invalid colour.' }, { status: 400 });
  }
  const width = Number(formData.get('width'));
  const height = Number(formData.get('height'));
  const aspectRatio = width > 0 && height > 0 ? closestAspectRatio(width, height) : null;

  const toPart = async (file) => ({
    inline_data: { mime_type: file.type || 'image/jpeg', data: Buffer.from(await file.arrayBuffer()).toString('base64') },
  });

  // Manual AbortController with an Error reason -- see /api/segment-surfaces-ai.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error('AI preview timed out.')), 90000);

  let res;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${PAINT_PREVIEW_MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(wall, ceiling) }, await toPart(photo), await toPart(guide)] }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: { ...(aspectRatio ? { aspectRatio } : {}), imageSize: '1K' },
        },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    console.error('[paint-preview] request failed:', err?.cause?.code || err?.message);
    return NextResponse.json({ error: 'AI preview service is unreachable. Please try again.' }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    console.error('[paint-preview] Gemini error', res.status, (await res.text()).slice(0, 500));
    return NextResponse.json({ error: 'AI preview failed. Please try again.' }, { status: 502 });
  }

  const json = await res.json();
  await recordGeminiUsage('paint-preview', PAINT_PREVIEW_MODEL, json);
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData || p.inline_data);
  const image = imagePart?.inlineData || imagePart?.inline_data;
  if (!image?.data) {
    console.error('[paint-preview] no image in response', JSON.stringify(json).slice(0, 500));
    return NextResponse.json({ error: 'AI preview returned no image. Please try again.' }, { status: 422 });
  }

  return NextResponse.json({ image: `data:${image.mimeType || image.mime_type || 'image/png'};base64,${image.data}` });
}
