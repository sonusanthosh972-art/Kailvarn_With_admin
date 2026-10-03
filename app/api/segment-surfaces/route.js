import { NextResponse } from 'next/server';
import { SURFACE_SEGMENTATION_MODEL } from '@/constants/segmentationConfig.js';
import { rateLimit } from '@/server/http.js';
import { isDailyCapReached } from '@/server/dailyCap.js';
import { validateImage } from '@/server/imageValidation.js';

const PAINTABLE_LABELS = ['wall', 'ceiling'];

// Isolated, single-purpose route for the paint visualizer: takes an
// uploaded room photo, runs it through a Hugging Face-hosted ADE20K
// semantic segmentation model, and returns the "wall" and "ceiling"
// class masks. The HF token stays server-side -- never sent to the browser.
export async function POST(request) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Surface detection is not configured on the server.' }, { status: 500 });
  }

  if (rateLimit(request, { key: 'segment-hf', max: 5, windowMs: 60_000 })) {
    console.warn(`[ABUSE] segment-surfaces rate-limited | IP: ${request.headers.get('x-forwarded-for')?.split(',')[0] || 'local'}`);
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }
  if (isDailyCapReached('segment-hf', 500)) {
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

  const buffer = Buffer.from(await photo.arrayBuffer());

  let hfRes;
  try {
    hfRes = await fetch(`https://router.huggingface.co/hf-inference/models/${SURFACE_SEGMENTATION_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': photo.type || 'image/jpeg',
      },
      body: buffer,
    });
  } catch {
    return NextResponse.json({ error: 'Surface detection service is unreachable.' }, { status: 502 });
  }

  if (!hfRes.ok) {
    return NextResponse.json({ error: 'Surface detection failed.' }, { status: 502 });
  }

  const segments = await hfRes.json();
  if (!Array.isArray(segments)) {
    return NextResponse.json({ error: 'Unexpected response from surface detection service.' }, { status: 502 });
  }

  const masks = {};
  for (const label of PAINTABLE_LABELS) {
    const found = segments.find((s) => typeof s.label === 'string' && s.label.toLowerCase().includes(label));
    if (found) masks[label] = found.mask;
  }

  if (Object.keys(masks).length === 0) {
    return NextResponse.json({ error: 'No wall or ceiling detected in this photo.' }, { status: 404 });
  }

  return NextResponse.json({ masks });
}
