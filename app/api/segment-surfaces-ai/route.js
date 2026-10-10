import { NextResponse } from 'next/server';
import { recordGeminiUsage } from '@/server/aiUsage.js';
import { rateLimit } from '@/server/http.js';
import { isDailyCapReached } from '@/server/dailyCap.js';
import { validateImage } from '@/server/imageValidation.js';
import {
  AI_SURFACE_MODEL,
  AI_SURFACE_PROMPT,
  closestAspectRatio,
} from '@/constants/segmentationConfig.js';

// Isolated, single-purpose route for the paint visualizer: takes an
// uploaded room photo and asks Gemini's image model (Google API) to
// redraw it as a color-coded wall/ceiling map -- see AI_SURFACE_PROMPT.
// The map is returned as-is; the client decodes red/blue pixels into
// wall/ceiling masks at its own canvas resolution. The Google API key
// stays server-side -- never sent to the browser.

export async function POST(request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI surface detection is not configured on the server.' }, { status: 500 });
  }

  // Each call costs ~Rs 6 (an image-output Gemini call), so cap per visitor
  // and per day like the other AI routes.
  if (rateLimit(request, { key: 'segment-ai', max: 5, windowMs: 60_000 })) {
    console.warn(`[ABUSE] segment-surfaces-ai rate-limited | IP: ${request.headers.get('x-forwarded-for')?.split(',')[0] || 'local'}`);
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }
  if (isDailyCapReached('segment-ai', 300)) {
    return NextResponse.json({ error: 'This feature has reached its daily limit. Please try again tomorrow.' }, { status: 503 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Missing photo.' }, { status: 400 });
  }
  const photo = formData.get('photo');
  const imageError = validateImage(photo);
  if (imageError) {
    return NextResponse.json({ error: imageError }, { status: 400 });
  }
  const width = Number(formData.get('width'));
  const height = Number(formData.get('height'));
  const aspectRatio = width > 0 && height > 0 ? closestAspectRatio(width, height) : null;

  const buffer = Buffer.from(await photo.arrayBuffer());

  // Manual AbortController with an Error reason (not AbortSignal.timeout)
  // -- same reason as /api/redesign-room: Next's dev logging crashes on
  // the getter-only DOMException message that AbortSignal.timeout uses.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error('AI surface detection timed out.')), 90000);

  let res;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_SURFACE_MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: AI_SURFACE_PROMPT },
              { inline_data: { mime_type: photo.type || 'image/jpeg', data: buffer.toString('base64') } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: { ...(aspectRatio ? { aspectRatio } : {}), imageSize: '1K' },
        },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    console.error('[segment-surfaces-ai] request failed:', err?.cause?.code || err?.message);
    return NextResponse.json({ error: 'AI surface detection service is unreachable.' }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    console.error('[segment-surfaces-ai] Gemini error', res.status, (await res.text()).slice(0, 500));
    return NextResponse.json({ error: 'AI surface detection failed.' }, { status: 502 });
  }

  const json = await res.json();
  await recordGeminiUsage('paint-visualizer', AI_SURFACE_MODEL, json);
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData || p.inline_data);
  const image = imagePart?.inlineData || imagePart?.inline_data;
  if (!image?.data) {
    console.error('[segment-surfaces-ai] no image in response', JSON.stringify(json).slice(0, 500));
    return NextResponse.json({ error: 'AI surface detection returned no map.' }, { status: 422 });
  }

  return NextResponse.json({
    surfaceMap: `data:${image.mimeType || image.mime_type || 'image/png'};base64,${image.data}`,
  });
}
