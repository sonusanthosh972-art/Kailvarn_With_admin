// In-browser image optimisation before upload: downscale to a sensible
// maximum, re-encode as WebP, and make a small thumbnail for grids. Keeps
// uploads fast and the public site light. Falls back to the original file
// if the browser can't decode/encode it.

const MAX_EDGE = 2560;
const THUMB_EDGE = 720;

async function decode(file) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch { /* fall through */ }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function encode(source, w, h, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/webp', quality));
}

function fit(w, h, max) {
  const s = Math.min(1, max / Math.max(w, h));
  return [Math.round(w * s), Math.round(h * s)];
}

export async function optimiseImage(file) {
  const bitmap = await decode(file);
  const width = bitmap.width || bitmap.naturalWidth;
  const height = bitmap.height || bitmap.naturalHeight;
  const [mw, mh] = fit(width, height, MAX_EDGE);
  const [tw, th] = fit(width, height, THUMB_EDGE);
  const [main, thumb] = await Promise.all([encode(bitmap, mw, mh, 0.86), encode(bitmap, tw, th, 0.8)]);
  bitmap.close?.();

  // Keep the original if re-encoding didn't help (or WebP isn't supported).
  const useMain = main && main.type === 'image/webp' && main.size < file.size;
  return {
    blob: useMain ? main : file,
    type: useMain ? 'image/webp' : file.type,
    width: useMain ? mw : width,
    height: useMain ? mh : height,
    thumb: thumb && thumb.type === 'image/webp' ? thumb : null,
    originalSize: file.size,
  };
}

// PUT with upload progress (fetch can't report upload progress).
export function putWithProgress(url, blob, contentType, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(Object.assign(new Error(`Storage returned ${xhr.status}`), { status: xhr.status })));
    xhr.onerror = () => reject(Object.assign(new Error('Upload blocked or network error'), { status: 0 }));
    xhr.send(blob);
  });
}

export function postFormWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => {
      let json = null;
      try { json = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300 && json?.ok) resolve(json.data);
      else reject(new Error(json?.error?.message || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}
