import { NextResponse } from 'next/server';
import { ROOM_ADVISOR_MODEL, ROOM_ADVISOR_MAX_OUTPUT_TOKENS } from '@/constants/advisorConfig.js';

// Isolated, single-purpose route: takes one uploaded room photo and asks
// Gemini for a short, KailVarn-relevant interior design read on it. The
// prompt asks for a fixed, terse structure (one style line + up to 5
// bullets) and generationConfig caps output tokens -- both deliberately
// tight to keep each call cheap. The Google API key stays server-side --
// never sent to the browser.
const PROMPT = `You are an interior design advisor for KailVarn, a company offering Full Home Interior, Kitchen Interior, Custom Furniture, and Painting & Wall Finishes services.

Look at this room photo and respond in EXACTLY this format, nothing else:

STYLE: <one short sentence naming the current style/mood>
SUGGESTIONS:
- <one concise, actionable improvement, under 20 words>
- <one concise, actionable improvement, under 20 words>
- <one concise, actionable improvement, under 20 words>
- <one concise, actionable improvement, under 20 words>

Keep it specific to what you actually see in the photo. Do not add any other text.`;

function parseAdvisorText(text) {
  const styleMatch = text.match(/STYLE:\s*(.+)/i);
  const suggestions = [...text.matchAll(/^-\s*(.+)$/gm)].map((m) => m[1].trim()).filter(Boolean);
  const style = styleMatch ? styleMatch[1].trim() : '';
  if (!style && suggestions.length === 0) return null;
  return { style, suggestions };
}

export async function POST(request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Room advisor is not configured on the server.' }, { status: 500 });
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
      `https://generativelanguage.googleapis.com/v1beta/models/${ROOM_ADVISOR_MODEL}:generateContent?key=${apiKey}`,
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
            maxOutputTokens: ROOM_ADVISOR_MAX_OUTPUT_TOKENS,
            temperature: 0.4,
          },
        }),
      }
    );
  } catch {
    return NextResponse.json({ error: 'Room advisor service is unreachable.' }, { status: 502 });
  }

  if (!geminiRes.ok) {
    return NextResponse.json({ error: 'Room advisor request failed.' }, { status: 502 });
  }

  const json = await geminiRes.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  const parsed = parseAdvisorText(text);

  if (!parsed) {
    return NextResponse.json({ error: 'Could not read this photo. Try a clearer, well-lit shot.' }, { status: 422 });
  }

  return NextResponse.json(parsed);
}
