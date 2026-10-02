import { getObject, isOwnedDesignKey } from '@/server/b2.js';

// GET /api/media/<b2 key> — serves design images and walkthrough videos from
// the (private) B2 bucket. Object keys are random and never change, so
// responses are cached for a year by browsers and any CDN in front. Only this
// app's designs/ objects are reachable.
//
// Range requests are forwarded to B2 and answered with 206: video players need
// them to seek, and Safari refuses to start playback at all without them.
export async function GET(request, { params }) {
  const key = (await params).key.map(decodeURIComponent).join('/');
  if (!isOwnedDesignKey(key)) return new Response('Not found', { status: 404 });
  const range = request.headers.get('range') || undefined;
  try {
    const obj = await getObject(key, range);
    const partial = Boolean(range && obj.ContentRange);
    return new Response(obj.Body.transformToWebStream(), {
      status: partial ? 206 : 200,
      headers: {
        'Content-Type': obj.ContentType || 'application/octet-stream',
        ...(obj.ContentLength ? { 'Content-Length': String(obj.ContentLength) } : {}),
        ...(partial ? { 'Content-Range': obj.ContentRange } : {}),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(obj.ETag ? { ETag: obj.ETag } : {}),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    const name = err?.name;
    const code = err?.$metadata?.httpStatusCode;
    if (code === 416 || name === 'InvalidRange') return new Response('Range not satisfiable', { status: 416 });
    const status = code === 404 || name === 'NoSuchKey' ? 404 : 502;
    return new Response(status === 404 ? 'Not found' : 'Storage error', { status });
  }
}
