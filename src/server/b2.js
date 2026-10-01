import 'server-only';
import crypto from 'node:crypto';
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IMAGE_TYPES, slugify } from '@/server/models.js';

// Backblaze B2 through its S3-compatible API. Keys never leave the server;
// the browser only ever receives short-lived presigned PUT URLs.

let client;
function s3() {
  if (!client) {
    const { B2_KEY_ID, B2_APPLICATION_KEY, B2_ENDPOINT, B2_REGION } = process.env;
    if (!B2_KEY_ID || !B2_APPLICATION_KEY || !B2_ENDPOINT) throw new Error('Backblaze B2 is not configured');
    client = new S3Client({
      region: B2_REGION || 'us-east-005',
      endpoint: B2_ENDPOINT,
      credentials: { accessKeyId: B2_KEY_ID, secretAccessKey: B2_APPLICATION_KEY },
      // B2 doesn't support the newer default checksum headers on presigned PUTs
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }
  return client;
}

const bucket = () => process.env.B2_BUCKET_NAME;
const prefix = () => process.env.B2_KEY_PREFIX || '';

export function isB2Configured() {
  return Boolean(process.env.B2_KEY_ID && process.env.B2_APPLICATION_KEY && process.env.B2_BUCKET_NAME && process.env.B2_ENDPOINT);
}

// designs/<category-slug>/<project-slug>/<random>.<ext>  (under B2_KEY_PREFIX)
// The user's file name is never used in the key.
export function buildImageKeys({ category, projectSlug, contentType }) {
  const ext = IMAGE_TYPES[contentType];
  const id = `${Date.now().toString(36)}-${crypto.randomBytes(8).toString('hex')}`;
  const base = `${prefix()}designs/${slugify(category)}/${slugify(projectSlug)}/${id}`;
  return { uploadId: id, b2Key: `${base}.${ext}`, thumbKey: `${base}-thumb.webp` };
}

// Keys this app is allowed to read/serve/delete.
export function isOwnedDesignKey(key) {
  return typeof key === 'string' && key.startsWith(`${prefix()}designs/`) && !key.includes('..');
}

export async function presignPut(key, contentType, expiresIn = 600) {
  const cmd = new PutObjectCommand({
    Bucket: bucket(),
    Key: key,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  return getSignedUrl(s3(), cmd, { expiresIn });
}

export async function putObject(key, body, contentType) {
  await s3().send(new PutObjectCommand({
    Bucket: bucket(), Key: key, Body: body, ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

export async function headObject(key) {
  try {
    const r = await s3().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
    return { exists: true, size: r.ContentLength, contentType: r.ContentType };
  } catch (e) {
    if (e?.$metadata?.httpStatusCode === 404 || e?.name === 'NotFound') return { exists: false };
    throw e;
  }
}

export async function getObject(key, range) {
  return s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key, ...(range ? { Range: range } : {}) }));
}

export async function deleteObjects(keys) {
  const list = keys.filter(isOwnedDesignKey);
  for (let i = 0; i < list.length; i += 1000) {
    await s3().send(new DeleteObjectsCommand({
      Bucket: bucket(),
      Delete: { Objects: list.slice(i, i + 1000).map((Key) => ({ Key })), Quiet: true },
    }));
  }
}

// Public URL for an object: direct bucket/CDN URL when the bucket is public
// (B2_PUBLIC_URL), otherwise this app's cached media route.
export function mediaUrl(key) {
  if (!key) return null;
  const base = process.env.B2_PUBLIC_URL;
  if (base) return `${base.replace(/\/$/, '')}/${key.split('/').map(encodeURIComponent).join('/')}`;
  return `/api/media/${key.split('/').map(encodeURIComponent).join('/')}`;
}
