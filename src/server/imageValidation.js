import 'server-only';

// Shared image validation for every route that accepts an uploaded photo.
// Rejects non-image files, oversized uploads, and suspiciously tiny files
// (a real room photo is always well above 5 KB).

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MIN_FILE_SIZE = 5_000;             // 5 KB — anything smaller isn't a real photo

/**
 * Validate an uploaded File/Blob.
 * @returns {string|null} An error message if invalid, or `null` if the file is OK.
 */
export function validateImage(photo) {
  if (!photo || typeof photo === 'string') {
    return 'Missing photo.';
  }
  if (!ALLOWED_TYPES.has(photo.type)) {
    return 'Please upload a JPEG, PNG or WebP image.';
  }
  if (photo.size > MAX_FILE_SIZE) {
    return 'Image must be under 10 MB.';
  }
  if (photo.size < MIN_FILE_SIZE) {
    return 'Image is too small. Please upload a clear room photo.';
  }
  return null;
}
