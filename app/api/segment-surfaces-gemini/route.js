import { NextResponse } from 'next/server';
import {
  WALL_SEGMENTATION_MODEL,
  PAINTABLE_LABELS,
  EXCLUDE_LABELS,
} from '@/constants/wallSegmentationConfig.js';

// Isolated proof-of-concept route: takes one uploaded room photo and asks
// Gemini to segment it into walls/ceiling (paintable) plus anything that
// might sit in front of them -- windows, furniture, art, etc. (kept only
// so their polygons can be subtracted back out client-side). This is a
// separate route from /api/segment-surfaces (the existing Hugging
// Face-based paint visualizer) -- that route and its component are left
// untouched. The Google API key stays server-side -- never sent to the
// browser.
const ALL_LABELS = [...PAINTABLE_LABELS, ...EXCLUDE_LABELS];

const PROMPT = `Analyze this photo of a room. Find and segment every visible instance of these categories: ${ALL_LABELS.join(', ')}.

Rules:
- If there are multiple separate wall surfaces visible (e.g. a left wall and a back wall), return a separate "wall" entry for each one.
- Only include a category if it is actually visible in the photo -- do not guess or include categories that aren't present.
- Trace each polygon precisely around the item's real visible outline, especially where a window, door, furniture, or other object interrupts a wall or ceiling.
- label must be exactly one of: ${ALL_LABELS.join(', ')}.

Return a JSON array. Each entry has:
- "label": one of the categories above
- "mask": the segmentation mask of the item as a polygon of [x, y] coordinates, normalized to 0-1000`;

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      label: { type: 'STRING' },
      mask: {
        type: 'ARRAY',
        items: { type: 'ARRAY', items: { type: 'NUMBER' } },
      },
    },
    required: ['label', 'mask'],
  },
};

export async function POST(request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Wall detection is not configured on the server.' }, { status: 500 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Missing photo.' }, { status: 400 });
  }
  const photo = formData.get('photo');
  if (!photo || typeof photo === 'string') {
    return NextResponse.json({ error: 'Missing photo.' }, { status: 400 });
  }

  const buffer = Buffer.from(await photo.arrayBuffer());
  const base64Data = buffer.toString('base64');
  const mimeType = photo.type || 'image/jpeg';

  let geminiRes;
  try {
    geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${WALL_SEGMENTATION_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: PROMPT }, { inline_data: { mime_type: mimeType, data: base64Data } }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.2,
            maxOutputTokens: 4096,
          },
        }),
      }
    );
  } catch {
    return NextResponse.json({ error: 'Wall detection service is unreachable.' }, { status: 502 });
  }

  if (!geminiRes.ok) {
    return NextResponse.json({ error: 'Wall detection failed.' }, { status: 502 });
  }

  const json = await geminiRes.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';

  let items;
  try {
    items = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Unexpected response from wall detection service.' }, { status: 502 });
  }
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'Unexpected response from wall detection service.' }, { status: 502 });
  }

  const clean = items
    .filter((it) => it && typeof it.label === 'string' && Array.isArray(it.mask) && it.mask.length >= 3)
    .map((it) => ({
      label: it.label.toLowerCase().trim(),
      // Gemini's mask points come as [y, x] (matching box_2d's
      // [ymin, xmin, ymax, xmax] y-first convention, confirmed by
      // testing real output against the actual photo -- not [x, y] as
      // the API docs' prose implies). Normalized here to [x, y] so
      // every consumer of "polygon" can treat it as a normal point.
      polygon: it.mask
        .filter((p) => Array.isArray(p) && p.length === 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]))
        .map(([y, x]) => [x, y]),
    }))
    .filter((it) => it.polygon.length >= 3);

  const paintable = clean.filter((it) => PAINTABLE_LABELS.includes(it.label));
  if (paintable.length === 0) {
    return NextResponse.json({ error: 'No wall or ceiling detected in this photo.' }, { status: 404 });
  }
  const exclude = clean.filter((it) => !PAINTABLE_LABELS.includes(it.label));

  return NextResponse.json({ paintable, exclude });
}
