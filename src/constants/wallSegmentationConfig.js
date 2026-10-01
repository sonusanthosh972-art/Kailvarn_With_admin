// Server-side only: isolated config for the Gemini-backed wall/ceiling
// segmentation proof of concept (app/api/segment-surfaces-gemini). Kept
// separate from segmentationConfig.js (the existing Hugging Face-based
// /api/segment-surfaces route, which this POC does not touch).
//
// gemini-3.8-flash is what Google's own segmentation documentation uses
// in its examples -- the lighter "flash-lite" tier is tuned for cheap
// text/simple-vision tasks, not the precise polygon-boundary output this
// feature depends on.
export const WALL_SEGMENTATION_MODEL = 'gemini-3.8-flash';

// Categories Gemini is asked to detect. "wall" and "ceiling" are what
// get painted; everything else is only detected so its polygon can be
// subtracted back out of the paintable area (a window or a plant that
// happens to sit in front of a wall must never receive color).
export const PAINTABLE_LABELS = ['wall', 'ceiling'];
export const EXCLUDE_LABELS = [
  'window',
  'door',
  'furniture',
  'tv',
  'plant',
  'artwork',
  'floor',
  'light fixture',
  'ceiling fan',
  'vent',
  'mirror',
  'curtain',
];
