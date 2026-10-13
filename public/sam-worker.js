// Tap-to-select for the paint visualizer: Segment Anything (SlimSAM) running
// entirely in the visitor's browser via Transformers.js. No server, no API key,
// the photo never leaves the device. Runs in a worker so the page stays smooth.
//
// Messages in:  { type: 'encode', id, width, height, rgba }   (once per photo)
//               { type: 'decode', id, points: [{ x, y, label }] }  x/y in 0..1, label 1 = include, 0 = exclude
// Messages out: { type: 'status', status: 'loading' | 'ready' | 'error', device, message }
//               { type: 'encoded', id } | { type: 'mask', id, width, height, mask (Uint8Array), score }
//               { type: 'error', id, message }
import { SamModel, AutoProcessor, RawImage, Tensor } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.0';

const MODEL_ID = 'Xenova/slimsam-77-uniform';

let modelPromise = null;
let current = null; // { id, processed, embeddings, width, height }

function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      self.postMessage({ type: 'status', status: 'loading' });
      let model;
      let device = 'wasm';
      if (self.navigator?.gpu) {
        try {
          model = await SamModel.from_pretrained(MODEL_ID, { dtype: 'fp16', device: 'webgpu' });
          device = 'webgpu';
        } catch {
          model = null;
        }
      }
      if (!model) model = await SamModel.from_pretrained(MODEL_ID, { dtype: 'fp32', device: 'wasm' });
      const processor = await AutoProcessor.from_pretrained(MODEL_ID);
      self.postMessage({ type: 'status', status: 'ready', device });
      return { model, processor };
    })().catch((err) => {
      modelPromise = null;
      self.postMessage({ type: 'status', status: 'error', message: String(err?.message || err) });
      throw err;
    });
  }
  return modelPromise;
}

async function encode({ id, width, height, rgba }) {
  const { model, processor } = await loadModel();
  // RGBA canvas pixels -> RGB image
  const rgb = new Uint8ClampedArray(width * height * 3);
  for (let p = 0, q = 0; p < rgba.length; p += 4, q += 3) {
    rgb[q] = rgba[p];
    rgb[q + 1] = rgba[p + 1];
    rgb[q + 2] = rgba[p + 2];
  }
  const processed = await processor(new RawImage(rgb, width, height, 3));
  const embeddings = await model.get_image_embeddings(processed);
  current = { id, processed, embeddings, width, height };
  self.postMessage({ type: 'encoded', id });
}

async function decode({ id, points }) {
  const { model, processor } = await loadModel();
  if (!current || current.id !== id) throw new Error('photo not encoded');
  const { processed, embeddings, width, height } = current;

  const reshaped = processed.reshaped_input_sizes[0]; // [h, w]
  const coords = points.flatMap((pt) => [pt.x * reshaped[1], pt.y * reshaped[0]]);
  const input_points = new Tensor('float32', coords, [1, 1, points.length, 2]);
  const input_labels = new Tensor('int64', points.map((pt) => BigInt(pt.label)), [1, 1, points.length]);

  const { pred_masks, iou_scores } = await model({ ...embeddings, input_points, input_labels });
  const masks = await processor.post_process_masks(pred_masks, processed.original_sizes, processed.reshaped_input_sizes);

  // masks[0][0]: [numMasks, H, W]. SAM offers 3 candidate masks; keep the best-scored one.
  const tensor = masks[0][0];
  const [numMasks, h, w] = tensor.dims;
  const scores = iou_scores.data;
  let best = 0;
  for (let i = 1; i < numMasks; i++) if (scores[i] > scores[best]) best = i;

  const plane = w * h;
  const offset = best * plane;
  const out = new Uint8Array(plane);
  const data = tensor.data;
  for (let i = 0; i < plane; i++) out[i] = data[offset + i] ? 1 : 0;

  self.postMessage({ type: 'mask', id, width: w || width, height: h || height, mask: out, score: scores[best] }, [out.buffer]);
}

self.onmessage = async (e) => {
  const msg = e.data;
  try {
    if (msg.type === 'load') await loadModel();
    else if (msg.type === 'encode') await encode(msg);
    else if (msg.type === 'decode') await decode(msg);
  } catch (err) {
    self.postMessage({ type: 'error', id: msg.id, message: String(err?.message || err) });
  }
};
