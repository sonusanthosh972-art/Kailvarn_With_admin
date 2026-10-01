// Server-side only: which Gemini model performs the AI room redesign
// (image-to-image edit, not text/segmentation). gemini-3.1-flash-image is
// Google's standard-tier image generation/editing model ("Nano Banana"
// family) -- roughly $0.067 per 1024px image generated, confirmed by
// live testing. The pricier gemini-3-pro-image ("Nano Banana Pro", ~$0.13
// -0.24/image) trades cost for higher resolution/fidelity if this ever
// needs to be upgraded.
export const ROOM_REDESIGN_MODEL = 'gemini-3.1-flash-image';

// The user's own photo is always the first image; a chosen reference
// style (see redesignStyles.js) is the second. Explicitly numbering them
// in the prompt keeps a 2-image edit request unambiguous about which
// photo to preserve and which to treat as style inspiration only.
export const ROOM_REDESIGN_PROMPT =
  "Redesign the room in the FIRST photo to match the interior design style, furniture choices, color palette and overall mood of the SECOND photo (a reference design). Keep the first photo's exact room structure, camera angle, walls, windows, ceiling and layout unchanged -- only restyle the furniture, decor, colors and finishes to match the reference. Do not copy the second photo's room layout or camera angle.";
