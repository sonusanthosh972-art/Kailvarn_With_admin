import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { ROOM_REDESIGN_MODEL, ROOM_REDESIGN_PROMPT } from '@/constants/redesignConfig.js';
import { REDESIGN_STYLES } from '@/constants/redesignStyles.js';

// Isolated, single-purpose route: takes one uploaded room photo plus a
// chosen reference style (one of the 5 REDESIGN_STYLES) and asks
// Gemini's image model to return the user's room restyled to match that
// reference. Confirmed live against real photos before wiring this up --
// see src/constants/redesignConfig.js for the model/cost notes. The
// Google API key stays server-side -- never sent to the browser.
//
// styleId is looked up against the server's own REDESIGN_STYLES list,
// never used to fetch a client-supplied URL directly -- keeps this route
// from being usable to make the server fetch arbitrary external
// addresses (SSRF).

// Node fetch errors (err.cause.code) that happen before a connection is
// established: connect timeout, refused, network/host unreachable, DNS.
const CONNECT_FAILURE_CODES = new Set([
  'UND_ERR_CONNECT_TIMEOUT',
  'ECONNREFUSED',
  'ENETUNREACH',
  'EHOSTUNREACH',
  'ENOTFOUND',
  'EAI_AGAIN',
]);

export async function POST(request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Room redesign is not configured on the server.' }, { status: 500 });
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
  const styleId = formData.get('styleId');
  const style = REDESIGN_STYLES.find((s) => s.id === styleId);
  if (!style) {
    return NextResponse.json({ error: 'Please choose a design style.' }, { status: 400 });
  }

  const buffer = Buffer.from(await photo.arrayBuffer());
  const base64Data = buffer.toString('base64');
  const mimeType = photo.type || 'image/jpeg';

  let styleBase64;
  try {
    const styleBuffer = await readFile(path.join(process.cwd(), style.localPath));
    styleBase64 = styleBuffer.toString('base64');
  } catch {
    return NextResponse.json({ error: 'Could not load the selected style. Please try again.' }, { status: 500 });
  }

  // Bounded so a stalled connection fails fast with a retryable error
  // instead of leaving the client spinning indefinitely -- generation
  // itself normally takes 15-30s. Uses a manual AbortController with an
  // explicit Error as the abort reason rather than AbortSignal.timeout():
  // that convenience API aborts with a DOMException whose .message is a
  // getter-only property, and something in Next's dev instrumentation
  // tries to write to it when logging the rejection, crashing with
  // "Cannot set property message of [object] which has only a getter"
  // (confirmed by reproducing it standalone before this fix).
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(new Error('Room redesign timed out.')), 60000);

  const requestBody = JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [
          { text: ROOM_REDESIGN_PROMPT },
          { inline_data: { mime_type: mimeType, data: base64Data } },
          { inline_data: { mime_type: 'image/jpeg', data: styleBase64 } },
        ],
      },
    ],
  });
  const callGemini = () =>
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${ROOM_REDESIGN_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
      signal: timeoutController.signal,
    });

  let geminiRes;
  try {
    try {
      geminiRes = await callGemini();
    } catch (err) {
      // Only retry failures where the connection was never opened -- the
      // request never reached Gemini, so a retry can't double-bill.
      if (timeoutController.signal.aborted || !CONNECT_FAILURE_CODES.has(err?.cause?.code)) throw err;
      console.error('[redesign-room] connection failed, retrying once:', err.cause.code);
      geminiRes = await callGemini();
    }
  } catch (err) {
    console.error('[redesign-room] request failed:', err?.cause?.code || err?.message);
    const message = timeoutController.signal.aborted
      ? 'Room redesign timed out. Please try again.'
      : 'Could not reach the redesign service. Please try again.';
    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!geminiRes.ok) {
    // Gemini's own error text, not exposed to the client -- kept for
    // operational visibility since this route (unlike its siblings) can
    // fail for reasons outside our control (quota, transient model
    // errors), not just a malformed request.
    console.error('[redesign-room] Gemini error', geminiRes.status, (await geminiRes.text()).slice(0, 500));
    return NextResponse.json({ error: 'Room redesign failed. Please try again.' }, { status: 502 });
  }

  const json = await geminiRes.json();
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData || p.inline_data);
  const image = imagePart?.inlineData || imagePart?.inline_data;

  if (!image?.data) {
    console.error('[redesign-room] no image in Gemini response', JSON.stringify(json).slice(0, 500));
    return NextResponse.json({ error: 'Could not generate a redesign for this photo. Please try again.' }, { status: 422 });
  }

  return NextResponse.json({
    image: `data:${image.mimeType || image.mime_type || 'image/jpeg'};base64,${image.data}`,
  });
}
