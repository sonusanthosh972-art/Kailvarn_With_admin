// Phone cameras produce 3-12 MB photos (sometimes HEIC). Uploading those
// raw trips the nginx proxy's 1 MB default body limit (413) and sends
// Gemini far more pixels than it needs. Re-encoding through a canvas
// shrinks the upload and always yields a plain JPEG.
export function resizeToJpegBlob(file, maxDimension, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not process this photo.'))), 'image/jpeg', quality);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read this photo. Please try a JPG or PNG image.'));
    };
    img.src = url;
  });
}

// Proxies (nginx 413/502 pages) answer with HTML, not JSON -- res.json()
// then throws a cryptic parse error (Safari: "The string did not match
// the expected pattern"). Turn that into a readable message instead.
export async function readJsonResponse(res) {
  try {
    return await res.json();
  } catch {
    if (res.status === 413) throw new Error('This photo is too large. Please try a smaller one.');
    throw new Error('Unexpected server response. Please try again.');
  }
}
