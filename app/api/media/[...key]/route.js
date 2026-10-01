import { getObject, isOwnedDesignKey } from '@/server/b2.js';

// GET /api/media/<b2 key> — serves design images from the (private) B2
// bucket. Object keys are random and never change, so responses are cached
// for a year by browsers and any CDN in front. Only this app's
// designs/ objects are reachable.
export async function GET(request, { params }) {
  const key = (await params).key.map(decodeURIComponent).join('/');
  if (!isOwnedDesignKey(key)) return new Response('Not found', { status: 404 });
  try {
    const obj = await getObject(key);
    return new Response(obj.Body.transformToWebStream(), {
      headers: {
        'Content-Type': obj.ContentType || 'application/octet-stream',
        ...(obj.ContentLength ? { 'Content-Length': String(obj.ContentLength) } : {}),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(obj.ETag ? { ETag: obj.ETag } : {}),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    const status = err?.$metadata?.httpStatusCode === 404 || err?.name === 'NoSuchKey' ? 404 : 502;
    return new Response(status === 404 ? 'Not found' : 'Storage error', { status });
  }
}
